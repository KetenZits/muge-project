import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir } from "node:fs/promises";
import { chromium } from "./browser.mjs";

const base = process.env.BASE_URL ?? "http://localhost:3000";
const artifacts = ".next/image-test-artifacts";
await mkdir(artifacts, { recursive: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  hasTouch: true,
});
const page = await context.newPage();
page.setDefaultTimeout(20000);
const browserErrors = [];
page.on("pageerror", (error) => browserErrors.push(error.message));
await context.addInitScript(() => {
  const create = URL.createObjectURL.bind(URL);
  const revoke = URL.revokeObjectURL.bind(URL);
  window.__photoUrls = { active: new Set(), created: 0, revoked: 0 };
  URL.createObjectURL = (blob) => {
    const url = create(blob);
    window.__photoUrls.active.add(url);
    window.__photoUrls.created++;
    return url;
  };
  URL.revokeObjectURL = (url) => {
    window.__photoUrls.active.delete(url);
    window.__photoUrls.revoked++;
    revoke(url);
  };
});

const go = async (path) => {
  await page.goto(base + path);
  await page.locator("[data-mock-ready=true]").waitFor();
};
const composer = () =>
  page.getByRole("dialog", { name: "Create a post", exact: true });
const selected = () =>
  composer().getByRole("list", { name: "Selected photos" }).locator("li");
const selectedNames = () =>
  selected()
    .locator("img")
    .evaluateAll((images) =>
      images.map((image) => image.alt.split(": ").slice(1).join(": ")),
    );
const waitCount = async (count) => {
  await page.waitForFunction((expected) => {
    const section = document
      .querySelector("[data-image-dropzone]")
      ?.closest("section");
    return (
      section &&
      section.getAttribute("aria-busy") === "false" &&
      section.querySelectorAll("li").length === expected
    );
  }, count);
};
const openComposer = async () => {
  await page
    .getByRole("button", { name: "Create post", exact: true })
    .first()
    .click();
  await composer().waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector('[role="dialog"] fieldset')?.disabled === false,
  );
};
const pick = async (files, count) => {
  await composer().locator('input[type="file"]').setInputFiles(files);
  await waitCount(count);
};
const fillText = async (
  title,
  content = "Sharing a useful campus update with the community and inviting other students to join us.",
) => {
  await composer().locator('input[name="title"]').fill(title);
  await composer().locator('textarea[name="content"]').fill(content);
};
const publish = async () => {
  await composer()
    .getByRole("button", { name: "Publish post", exact: true })
    .click();
  await composer().waitFor({ state: "detached" });
};
const snapshot = () =>
  page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("mu-connect-prototype");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      const names = [
        "posts",
        "postImages",
        "drafts",
        "teams",
        "bookmarks",
        "comments",
      ];
      const tx = db.transaction(names);
      const values = await Promise.all(
        names.map(
          (name) =>
            new Promise((resolve, reject) => {
              const request = tx.objectStore(name).getAll();
              request.onsuccess = () => resolve(request.result);
              request.onerror = () => reject(request.error);
            }),
        ),
      );
      const result = Object.fromEntries(
        names.map((name, index) => [name, values[index]]),
      );
      result.postImages = await Promise.all(
        result.postImages.map(async ({ blob, ...image }) => ({
          ...image,
          isBlob: blob instanceof Blob,
          actualSize: blob.size,
          hash: [
            ...new Uint8Array(
              await crypto.subtle.digest("SHA-256", await blob.arrayBuffer()),
            ),
          ]
            .map((value) => value.toString(16).padStart(2, "0"))
            .join(""),
        })),
      );
      result.version = db.version;
      return result;
    } finally {
      db.close();
    }
  });
const assertNoOrphans = (state) => {
  for (const image of state.postImages) {
    const owner = image.ownerId.startsWith("post:")
      ? state.posts.find((post) => `post:${post.id}` === image.ownerId)
      : state.drafts.find((draft) => `draft:${draft.id}` === image.ownerId);
    assert.ok(
      owner?.imageIds.includes(image.id),
      `Orphan attachment: ${image.id}`,
    );
    assert.equal(
      owner.imageIds[image.position],
      image.id,
      "Stored photo order differs from owner references",
    );
    assert.equal(image.isBlob, true);
    assert.equal(image.fileSize, image.actualSize);
  }
};
const photoGrid = (id) => page.locator(`[data-post-gallery="${id}"]`);
const assertPhotosLoaded = async (id, count) => {
  await photoGrid(id).waitFor();
  await photoGrid(id).scrollIntoViewIfNeeded();
  await page.waitForFunction(
    ({ id, count }) => {
      const images = document.querySelectorAll(
        `[data-post-gallery="${id}"] img`,
      );
      return (
        images.length === count &&
        [...images].every((image) => image.complete && image.naturalWidth > 0)
      );
    },
    { id, count },
  );
};
const jsonPosts = () =>
  page.evaluate(async () => (await fetch("/api/posts")).json());

try {
  // Seed a real v2 database before loading the app. This is an isolated browser context.
  await page.route("**/image-migration-fixture", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<html><body>Migration fixture</body></html>",
    }),
  );
  await page.goto(base + "/image-migration-fixture");
  await page.evaluate(async () => {
    const db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("mu-connect-prototype", 20);
      request.onupgradeneeded = () => {
        const stores = {
          posts: ["createdAt"],
          teams: ["createdAt"],
          bookmarks: ["kind", "itemId"],
          follows: ["targetId"],
          notifications: ["createdAt", "read"],
          drafts: ["updatedAt"],
          conversations: ["updatedAt"],
          messages: ["conversationId", "createdAt"],
          interactions: ["kind", "itemId"],
          comments: ["postId", "createdAt"],
        };
        for (const [name, indexes] of Object.entries(stores)) {
          const store = request.result.createObjectStore(name, {
            keyPath: "id",
          });
          for (const index of indexes) store.createIndex(index, index);
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    await new Promise((resolve, reject) => {
      const tx = db.transaction(
        ["posts", "drafts", "bookmarks", "comments"],
        "readwrite",
      );
      tx.objectStore("posts").add({
        id: "migration-post",
        authorId: "u0",
        category: "General",
        title: "A preserved post from schema v2",
        content:
          "Existing student content must survive the image schema upgrade.",
        tags: [],
        likes: 0,
        comments: 0,
        createdAt: new Date().toISOString(),
      });
      tx.objectStore("drafts").add({
        id: "current",
        type: "General",
        title: "A preserved text draft",
        content: "Existing draft content",
        tags: [],
        updatedAt: new Date().toISOString(),
      });
      tx.objectStore("bookmarks").add({
        id: "posts:migration-post",
        kind: "posts",
        itemId: "migration-post",
      });
      tx.objectStore("comments").add({
        id: "migration-comment",
        postId: "migration-post",
        userId: "u0",
        content: "An older comment",
        createdAt: new Date().toISOString(),
      });
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  });
  await go("/home?view=feed");
  const migrated = await snapshot();
  assert.equal(migrated.version, 30);
  assert.equal(migrated.posts.length, 1);
  assert.equal(migrated.comments.length, 1);
  assert.equal(migrated.bookmarks.length, 1);
  await openComposer();
  assert.equal(
    await composer().locator('input[name="title"]').inputValue(),
    "A preserved text draft",
  );
  await composer().getByRole("button", { name: "Discard draft" }).click();
  await composer().waitFor({ state: "detached" });
  console.log(
    "PASS: additive v2 migration preserves posts, drafts, comments, and bookmarks",
  );

  const rawFixtures = await page.evaluate(async () => {
    const fixtures = [];
    for (let index = 0; index < 7; index++) {
      const canvas = document.createElement("canvas");
      canvas.width = index === 6 ? 3200 : 640 + index * 20;
      canvas.height = index === 6 ? 1800 : 400 + index * 30;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = [
        "#17468c",
        "#a5812d",
        "#fac334",
        "#a6c9e9",
        "#39a57a",
        "#d78e9f",
        "#17468c",
      ][index];
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "48px sans-serif";
      ctx.fillText(`Campus photo ${index + 1}`, 30, 90);
      const mimeType =
        index === 0 ? "image/jpeg" : index === 2 ? "image/webp" : "image/png";
      fixtures.push({
        name: `campus-${index + 1}.${mimeType.split("/")[1]}`,
        mimeType,
        width: canvas.width,
        height: canvas.height,
        data: canvas.toDataURL(mimeType).split(",")[1],
      });
    }
    return fixtures;
  });
  const fixtures = rawFixtures.map(({ data, ...metadata }) => ({
    ...metadata,
    buffer: Buffer.from(data, "base64"),
  }));

  await openComposer();
  await fillText("A normal text-only campus post");
  await publish();
  assert.ok(
    (await jsonPosts()).find(
      (post) =>
        post.title === "A normal text-only campus post" &&
        !post.imageIds.length,
    ),
  );
  await openComposer();
  await fillText("Campus photo with a caption");
  await pick([fixtures[0]], 1);
  await publish();
  let posts = await jsonPosts();
  const single = posts.find(
    (post) => post.title === "Campus photo with a caption",
  );
  await assertPhotosLoaded(single.id, 1);
  await page.reload();
  await assertPhotosLoaded(single.id, 1);
  await photoGrid(single.id).getByRole("button").click();
  let viewer = page.getByRole("dialog", {
    name: "Photos: Campus photo with a caption",
  });
  await viewer.waitFor();
  await page.keyboard.press("Escape");
  await viewer.waitFor({ state: "detached" });
  assert.equal(
    await photoGrid(single.id)
      .getByRole("button")
      .evaluate((button) => button === document.activeElement),
    true,
  );
  await go(`/posts/${single.id}`);
  await assertPhotosLoaded(single.id, 1);
  console.log(
    "PASS: text-only and one-photo publishing, immediate feed, refresh, detail, Escape, focus return",
  );

  await go("/home?view=feed");
  await openComposer();
  await composer()
    .locator('input[type="file"]')
    .setInputFiles([
      {
        name: "notes.txt",
        mimeType: "text/plain",
        buffer: Buffer.from("not a photo"),
      },
      {
        name: "oversized.png",
        mimeType: "image/png",
        buffer: Buffer.alloc(8 * 1024 * 1024 + 1),
      },
      {
        name: "disguised.png",
        mimeType: "image/png",
        buffer: Buffer.from("<svg xmlns='http://www.w3.org/2000/svg'></svg>"),
      },
      {
        name: "damaged.png",
        mimeType: "image/png",
        buffer: Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0]),
      },
      fixtures[0],
    ]);
  await waitCount(1);
  const validationText = await composer().getByRole("alert").innerText();
  assert.match(validationText, /choose a JPEG/);
  assert.match(validationText, /8 MB/);
  assert.match(validationText, /contents do not match/);
  assert.match(validationText, /damaged/);
  await pick(fixtures.slice(1, 6), 5);
  assert.match(await composer().getByRole("alert").innerText(), /up to 5/);
  assert.deepEqual(
    await selectedNames(),
    fixtures.slice(0, 5).map((file) => file.name),
  );
  await composer()
    .getByRole("button", { name: "Remove photo 2", exact: true })
    .click();
  await waitCount(4);
  await composer()
    .getByRole("button", { name: "Move photo 4 earlier", exact: true })
    .focus();
  await page.keyboard.press("Enter");
  assert.deepEqual(
    await selectedNames(),
    [fixtures[0], fixtures[2], fixtures[4], fixtures[3]].map(
      (file) => file.name,
    ),
  );
  await composer()
    .getByRole("button", { name: "Drag photo 1 to reorder" })
    .dragTo(selected().nth(2));
  assert.deepEqual(
    await selectedNames(),
    [fixtures[2], fixtures[4], fixtures[0], fixtures[3]].map(
      (file) => file.name,
    ),
  );
  // Exercise the file drop surface independently of the hidden picker.
  const transfer = await page.evaluateHandle(({ name, mimeType, data }) => {
    const transfer = new DataTransfer();
    transfer.items.add(
      new File(
        [Uint8Array.from(atob(data), (char) => char.charCodeAt(0))],
        name,
        { type: mimeType },
      ),
    );
    return transfer;
  }, rawFixtures[5]);
  await composer()
    .locator("[data-image-dropzone]")
    .dispatchEvent("drop", { dataTransfer: transfer });
  await transfer.dispose();
  await waitCount(5);
  let order = await selectedNames();
  const createdBeforeTyping = await page.evaluate(
    () => window.__photoUrls.created,
  );
  await composer()
    .locator('input[name="title"]')
    .fill("Draft photo collection");
  await composer()
    .locator('input[name="tags"]')
    .fill("Artificial Intelligence");
  assert.equal(
    await page.evaluate(() => window.__photoUrls.created),
    createdBeforeTyping,
    "Typing recreated preview URLs",
  );

  for (const width of [375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.equal(
      await composer().evaluate(
        (dialog) => dialog.scrollWidth > dialog.clientWidth,
      ),
      false,
      `Composer overflow at ${width}px`,
    );
    await composer().locator("[data-image-dropzone]").scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${artifacts}/composer-${width}.png` });
  }
  await composer()
    .getByRole("button", { name: "Save draft", exact: true })
    .click();
  await composer().waitFor({ state: "detached" });
  let state = await snapshot();
  assertNoOrphans(state);
  const draftIds = [...state.drafts[0].imageIds];
  assert.deepEqual(
    state.postImages
      .filter((image) => image.ownerId === "draft:current")
      .sort((a, b) => a.position - b.position)
      .map((image) => image.fileName),
    order,
  );
  await page.reload();
  await openComposer();
  await waitCount(5);
  assert.deepEqual(await selectedNames(), order);
  await composer()
    .getByRole("button", { name: "Remove photo 2", exact: true })
    .click();
  await waitCount(4);
  await pick([fixtures[1]], 5);
  order = await selectedNames();
  await composer()
    .getByRole("button", { name: "Save draft", exact: true })
    .click();
  await composer().waitFor({ state: "detached" });
  state = await snapshot();
  assertNoOrphans(state);
  assert.equal(
    state.postImages.some((image) => image.id === draftIds[1]),
    false,
    "Removed draft image was not cleaned up",
  );
  await openComposer();
  await waitCount(5);
  await composer().locator('input[name="title"]').fill("");
  await composer().locator('textarea[name="content"]').fill("");
  await publish();
  posts = await jsonPosts();
  const multi = posts.find((post) => post.title === "Photos from campus");
  assert.ok(multi);
  assert.equal(multi.content, "");
  assert.equal(multi.imageIds.length, 5);
  await assertPhotosLoaded(multi.id, 5);
  state = await snapshot();
  assert.equal(state.drafts.length, 0);
  assertNoOrphans(state);
  const persisted = state.postImages
    .filter((image) => image.ownerId === `post:${multi.id}`)
    .sort((a, b) => a.position - b.position);
  assert.deepEqual(
    persisted.map((image) => image.fileName),
    order,
  );
  for (const image of persisted)
    assert.equal(
      image.hash,
      createHash("sha256")
        .update(fixtures.find((file) => file.name === image.fileName).buffer)
        .digest("hex"),
    );
  assert.equal(JSON.stringify(posts).includes('"blob"'), false);
  assert.equal(JSON.stringify(posts).includes("blob:"), false);
  console.log(
    "PASS: per-file validation, five-photo limit, remove, keyboard/drag reorder, drop, preview URL stability",
  );
  console.log(
    "PASS: image drafts restore and replace cleanly, publish image-only with original bytes and photo order intact",
  );

  await photoGrid(multi.id)
    .getByRole("button", { name: "View photo 2 of 5" })
    .click();
  viewer = page.getByRole("dialog", { name: "Photos: Photos from campus" });
  await viewer.getByText("2 / 5", { exact: true }).waitFor();
  await page.keyboard.press("ArrowRight");
  await viewer.getByText("3 / 5", { exact: true }).waitFor();
  await viewer.getByRole("button", { name: "Previous photo" }).click();
  await viewer.getByText("2 / 5", { exact: true }).waitFor();
  const swipeSurface = viewer.locator('[style*="touch-action"]');
  await swipeSurface.dispatchEvent("pointerdown", {
    pointerType: "touch",
    clientX: 250,
    clientY: 200,
  });
  await swipeSurface.dispatchEvent("pointerup", {
    pointerType: "touch",
    clientX: 80,
    clientY: 210,
  });
  await viewer.getByText("3 / 5", { exact: true }).waitFor();
  for (let index = 0; index < 7; index++) {
    await page.keyboard.press("Tab");
    assert.equal(
      await viewer.evaluate((dialog) =>
        dialog.contains(document.activeElement),
      ),
      true,
      "Viewer focus escaped",
    );
  }
  await page.keyboard.press("Escape");
  await viewer.waitFor({ state: "detached" });
  await page
    .locator("article")
    .filter({ has: photoGrid(multi.id) })
    .getByRole("button", { name: "Save post", exact: true })
    .click();
  await go("/saved");
  await assertPhotosLoaded(multi.id, 5);
  await go("/profile/tester");
  await page.getByRole("tab", { name: /^Posts\b/ }).click();
  await assertPhotosLoaded(multi.id, 5);
  await go("/me");
  await assertPhotosLoaded(multi.id, 5);
  await go("/communities/ai-collective");
  await assertPhotosLoaded(multi.id, 5);
  await go(`/posts/${multi.id}`);
  await assertPhotosLoaded(multi.id, 5);
  const detail = await page.evaluate(
    async (id) => (await fetch(`/api/posts/${id}`)).json(),
    multi.id,
  );
  assert.deepEqual(detail.imageIds, multi.imageIds);
  console.log(
    "PASS: lightbox arrows, buttons, swipe, focus trap; photos in details, profiles, saved, activity, community",
  );

  // Create 2/3/4-photo API fixtures to verify every gallery layout and the binary mock contract.
  const layoutIds = await page.evaluate(async (files) => {
    const result = [];
    for (const count of [2, 3, 4]) {
      const id = `layout-${count}`;
      const date = new Date().toISOString();
      const metadata = files.slice(0, count).map((file, index) => ({
        id: `${id}-photo-${index}`,
        mimeType: file.mimeType,
        fileName: file.name,
        fileSize: atob(file.data).length,
        width: file.width,
        height: file.height,
        createdAt: date,
      }));
      const form = new FormData();
      form.set(
        "post",
        JSON.stringify({
          id,
          authorId: "u0",
          category: "General",
          title: `Layout with ${count} photos`,
          content: "",
          tags: [],
          likes: 0,
          comments: 0,
          createdAt: date,
          imageIds: metadata.map((image) => image.id),
        }),
      );
      form.set("imageMetadata", JSON.stringify(metadata));
      for (const file of files.slice(0, count))
        form.append(
          "images",
          new File(
            [Uint8Array.from(atob(file.data), (char) => char.charCodeAt(0))],
            file.name,
            { type: file.mimeType },
          ),
        );
      const response = await fetch("/api/posts", {
        method: "POST",
        body: form,
      });
      if (!response.ok) throw new Error(await response.text());
      result.push(id);
    }
    return result;
  }, rawFixtures);
  await go("/home?view=feed");
  for (const width of [375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width === 1024 ? 768 : 932 });
    for (const [id, count] of [
      [single.id, 1],
      ...layoutIds.map((id, index) => [id, index + 2]),
      [multi.id, 5],
    ]) {
      await assertPhotosLoaded(id, count);
      const overflowing = await photoGrid(id).evaluate(
        (grid) => grid.scrollWidth > grid.clientWidth,
      );
      assert.equal(
        overflowing,
        false,
        `${count}-photo gallery overflow at ${width}px`,
      );
    }
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `Feed overflow at ${width}px`,
    );
    await photoGrid(multi.id).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${artifacts}/feed-gallery-${width}.png` });
    await photoGrid(multi.id).getByRole("button").first().click();
    viewer = page.getByRole("dialog", { name: "Photos: Photos from campus" });
    await page.waitForFunction(() => {
      const image = document.querySelector('[role="dialog"] img');
      return (
        image?.complete &&
        image.naturalWidth > 0 &&
        getComputedStyle(image.parentElement).opacity === "1"
      );
    });
    assert.equal(
      await viewer.evaluate(
        (dialog) =>
          dialog.scrollWidth > dialog.clientWidth ||
          dialog.scrollHeight > dialog.clientHeight,
      ),
      false,
      `Viewer overflow at ${width}px`,
    );
    await page.screenshot({ path: `${artifacts}/viewer-${width}.png` });
    await page.keyboard.press("Escape");
    await viewer.waitFor({ state: "detached" });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  console.log(
    "PASS: composer, 1–5 image grids, viewer at 375, 430, 768, 1024, 1440px without overflow",
  );

  await openComposer();
  await pick([fixtures[6]], 1);
  // Escape auto-saves the unfinished form and its optimized attachment.
  await page.keyboard.press("Escape");
  await composer().waitFor({ state: "detached" });
  state = await snapshot();
  assertNoOrphans(state);
  let draftImages = state.postImages.filter(
    (image) => image.ownerId === "draft:current",
  );
  assert.equal(draftImages[0].width, 2560);
  assert.equal(draftImages[0].mimeType, "image/webp");
  assert.ok(draftImages[0].fileSize < fixtures[6].buffer.length);
  await openComposer();
  await waitCount(1);
  await composer().getByRole("button", { name: "Discard draft" }).click();
  await composer().waitFor({ state: "detached" });
  state = await snapshot();
  assert.equal(state.drafts.length, 0);
  assert.equal(
    state.postImages.some((image) => image.ownerId === "draft:current"),
    false,
  );
  assertNoOrphans(state);
  console.log(
    "PASS: large-photo optimization, auto-save on close, draft deletion cleans binary data",
  );

  await openComposer();
  await pick(fixtures.slice(0, 2), 2);
  await fillText("Image recruitment that can be retried safely");
  await composer()
    .getByRole("button", { name: "Save draft", exact: true })
    .click();
  await composer().waitFor({ state: "detached" });
  await openComposer();
  await waitCount(2);
  await pick([fixtures[2]], 3);
  const beforeSaveError = await snapshot();
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.put;
    window.__restoreStorage = () => {
      IDBObjectStore.prototype.put = original;
    };
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "drafts")
        throw new DOMException("Simulated storage full", "QuotaExceededError");
      return original.apply(this, args);
    };
  });
  await composer()
    .getByRole("button", { name: "Save draft", exact: true })
    .click();
  await composer()
    .getByRole("alert")
    .filter({ hasText: "storage is full" })
    .waitFor();
  await waitCount(3);
  assert.deepEqual(
    await snapshot(),
    beforeSaveError,
    "Failed draft replacement did not roll back",
  );
  await page.evaluate(() => window.__restoreStorage());
  await composer()
    .getByRole("button", { name: "Save draft", exact: true })
    .click();
  await composer().waitFor({ state: "detached" });
  await openComposer();
  await waitCount(3);
  await composer().locator('select[name="category"]').selectOption("Team");
  await composer().locator('input[name="roles"]').fill("Designer, Developer");
  await composer().locator('input[name="teamSize"]').fill("1 of 4");
  await composer()
    .locator('input[name="deadline"]')
    .fill(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const beforePublishError = await snapshot();
  // Fail after images and recruitment have been written, proving the entire transaction rolls back.
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add;
    window.__restoreStorage = () => {
      IDBObjectStore.prototype.add = original;
    };
    IDBObjectStore.prototype.add = function (...args) {
      if (this.name === "posts")
        throw new DOMException("Simulated storage full", "QuotaExceededError");
      return original.apply(this, args);
    };
  });
  await composer()
    .getByRole("button", { name: "Publish post", exact: true })
    .click();
  await composer()
    .getByRole("alert")
    .filter({ hasText: "storage is full" })
    .waitFor();
  await waitCount(3);
  assert.deepEqual(
    await snapshot(),
    beforePublishError,
    "Failed publish changed persisted data",
  );
  assert.equal(
    await composer().locator('input[name="title"]').inputValue(),
    "Image recruitment that can be retried safely",
  );
  await page.evaluate(() => window.__restoreStorage());
  // Also simulate a dropped response after a committed write; retry must use the same IDs.
  await page.evaluate(() => {
    const original = window.fetch;
    let loseResponse = true;
    window.__restoreFetch = () => {
      window.fetch = original;
    };
    window.fetch = async (...args) => {
      const response = await original(...args);
      if (
        loseResponse &&
        String(args[0]).endsWith("/posts") &&
        args[1]?.method === "POST"
      ) {
        loseResponse = false;
        throw new TypeError("Simulated connection loss after saving");
      }
      return response;
    };
  });
  await composer()
    .getByRole("button", { name: "Publish post", exact: true })
    .click();
  await composer()
    .getByRole("alert")
    .filter({ hasText: "connection loss" })
    .waitFor();
  const afterLostResponse = await snapshot();
  assertNoOrphans(afterLostResponse);
  assert.equal(
    afterLostResponse.posts.length,
    beforePublishError.posts.length + 1,
  );
  await composer().locator('input[name="roles"]').fill("Incorrect retry role");
  await publish();
  await page.evaluate(() => window.__restoreFetch());
  state = await snapshot();
  assertNoOrphans(state);
  assert.equal(state.posts.length, afterLostResponse.posts.length);
  assert.equal(state.teams.length, afterLostResponse.teams.length);
  assert.equal(state.drafts.length, 0);
  const recruitment = state.posts.find(
    (post) => post.title === "Image recruitment that can be retried safely",
  );
  await assertPhotosLoaded(recruitment.id, 3);
  const recruitmentCard = page
    .locator("article")
    .filter({ has: photoGrid(recruitment.id) });
  assert.match(await recruitmentCard.innerText(), /Designer, Developer/);
  assert.doesNotMatch(
    await recruitmentCard.innerText(),
    /Incorrect retry role/,
  );
  console.log(
    "PASS: quota failures preserve form/photos and roll back drafts, posts, images, teams; retry is idempotent",
  );

  const compatibility = await page.evaluate(async () => {
    const post = {
      id: "old-json-contract",
      authorId: "u0",
      category: "General",
      title: "Original JSON post contract",
      content:
        "Older clients can still publish ordinary posts without attachment fields.",
      tags: [],
      likes: 0,
      comments: 0,
      createdAt: new Date().toISOString(),
    };
    const response = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });
    return { status: response.status, post: await response.json() };
  });
  assert.equal(compatibility.status, 200);
  assert.equal(compatibility.post.imageIds, undefined);
  // Corrupt two records in the isolated test database and confirm bounded placeholders.
  await page.evaluate(
    async ({ postId }) => {
      const db = await new Promise((resolve) => {
        const request = indexedDB.open("mu-connect-prototype");
        request.onsuccess = () => resolve(request.result);
      });
      await new Promise((resolve, reject) => {
        const tx = db.transaction(["posts", "postImages"], "readwrite");
        const request = tx.objectStore("posts").get(postId);
        request.onsuccess = () => {
          const ids = request.result.imageIds;
          tx.objectStore("postImages").delete(ids[0]);
          const imageRequest = tx.objectStore("postImages").get(ids[1]);
          imageRequest.onsuccess = () => {
            const image = imageRequest.result;
            tx.objectStore("postImages").put({
              ...image,
              blob: new Blob([new Uint8Array(image.fileSize)], {
                type: image.mimeType,
              }),
            });
          };
        };
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      db.close();
    },
    { postId: recruitment.id },
  );
  await go(`/posts/${recruitment.id}`);
  await page.waitForFunction(
    (id) =>
      document
        .querySelector(`[data-post-gallery="${id}"]`)
        ?.querySelectorAll('[aria-label="Photo unavailable"]').length === 2,
    recruitment.id,
  );
  await go("/home?view=feed");
  await assertPhotosLoaded(multi.id, 5);
  // SPA navigation unmounts gallery consumers without resetting the URL instrumentation.
  await page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: "Discover", exact: true }).click();
  await page.waitForURL("**/discover");
  await page.waitForFunction(() => window.__photoUrls.active.size === 0);
  assert.equal(
    await page.evaluate(
      () => window.__photoUrls.created === window.__photoUrls.revoked,
    ),
    true,
    "Leaked object URLs after navigation",
  );
  assert.deepEqual(browserErrors, []);
  console.log(
    "PASS: original JSON API, missing/corrupt attachments, no orphan records or object URL leaks, no browser errors",
  );
  console.log(`Image attachment checks passed. Screenshots: ${artifacts}`);
} catch (error) {
  await page.screenshot({ path: `${artifacts}/failure.png` }).catch(() => {});
  console.error(error);
  process.exitCode = 1;
} finally {
  await context.close();
  await browser.close();
}
