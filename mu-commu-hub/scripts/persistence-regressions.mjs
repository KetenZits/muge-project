import assert from "node:assert/strict";
import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";

// All fixtures live in a new, isolated browser context. No existing browser profile is opened.
const legacy = {
  id: "u0",
  username: "thanapon.dev",
  name: "Thanapon Chaiyasit",
  initials: "TC",
  faculty: "Information Technology",
  major: "Software Engineering",
  year: 1,
  bio: "Building useful things with code. Always up for a hackathon, a new idea, or a good cup of coffee.",
  skills: ["Next.js", "TypeScript", "React", "Python", "UI Design"],
  interests: [
    "Artificial Intelligence",
    "Web Development",
    "Startup",
    "Hackathons",
    "Design",
  ],
  availability: ["Hackathons", "Projects", "Startups"],
  avatarColor: "#DDE9FA",
  followersCount: 12,
  followingCount: 0,
  achievements: ["MU Innovation Hackathon 2025 finalist"],
  role: "student",
};
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
const passed = [];
const check = (name) => {
  passed.push(name);
  console.log("PASS", name);
};
const ready = async () => {
  await page.locator("[data-mock-ready=true]").waitFor();
  await page.locator("main h1").first().waitFor();
};
const snapshot = () =>
  page.evaluate(async () => {
    const request = indexedDB.open("mu-connect-prototype");
    const database = await new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    try {
      const names = Array.from(database.objectStoreNames);
      const result = {};
      const transaction = database.transaction(names, "readonly");
      await Promise.all(
        names.map(async (name) => {
          const rows = await new Promise((resolve, reject) => {
            const req = transaction.objectStore(name).getAll();
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => reject(req.error);
          });
          result[name] = await Promise.all(
            rows.map(async (row) => {
              if (!(row.blob instanceof Blob)) return row;
              const { blob, ...metadata } = row;
              return {
                ...metadata,
                blobBytes: Array.from(new Uint8Array(await blob.arrayBuffer())),
                blobType: blob.type,
              };
            }),
          );
        }),
      );
      return result;
    } finally {
      database.close();
    }
  });

try {
  await page.goto("http://localhost:3000/profile/tester");
  await ready();
  await page.getByRole("heading", { name: "Tester", exact: true }).waitFor();
  const seeded = await page.evaluate(async () =>
    (await fetch("/api/users")).json(),
  );
  assert.equal(seeded.filter((user) => user.id === "u0").length, 1);
  assert.equal(new Set(seeded.map((user) => user.id)).size, seeded.length);
  assert.deepEqual(
    {
      name: seeded[0].name,
      username: seeded[0].username,
      email: seeded[0].email,
      displayRole: seeded[0].displayRole,
      faculty: seeded[0].faculty,
      year: seeded[0].year,
    },
    {
      name: "Tester",
      username: "tester",
      email: "user@gmail.com",
      displayRole: "Demo Student",
      faculty: "Information Technology",
      year: 1,
    },
  );
  check("Neutral demo identity retains one stable u0 seed");
  await page.evaluate(async (profile) => {
    localStorage.setItem("mu-connect-user", JSON.stringify(profile));
    localStorage.setItem("mu-connect-onboarded", "true");
    localStorage.setItem(
      "mu-connect-message-drafts:u0",
      JSON.stringify({ "fixture-conversation": "Unsent conversation draft" }),
    );
    const req = indexedDB.open("mu-connect-prototype");
    const database = await new Promise((resolve, reject) => {
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    try {
      const names = [
        "posts",
        "postImages",
        "drafts",
        "bookmarks",
        "conversations",
        "messages",
        "comments",
        "interactions",
      ];
      const transaction = database.transaction(names, "readwrite");
      const now = new Date().toISOString();
      const bytes = Uint8Array.from(
        atob(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLbtAAAAABJRU5ErkJggg==",
        ),
        (char) => char.charCodeAt(0),
      );
      const blob = new Blob([bytes], { type: "image/png" });
      transaction.objectStore("posts").put({
        id: "fixture-preserved-post",
        authorId: "u0",
        category: "General",
        title: "Preserve this student post",
        content:
          "Original student content and attached photo must stay unchanged.",
        tags: ["Research"],
        createdAt: now,
        likes: 0,
        comments: 0,
        imageIds: ["fixture-photo"],
      });
      transaction.objectStore("postImages").put({
        id: "fixture-photo",
        ownerId: "post:fixture-preserved-post",
        position: 0,
        mimeType: "image/png",
        fileName: "original.png",
        fileSize: blob.size,
        width: 1,
        height: 1,
        createdAt: now,
        blob,
      });
      transaction.objectStore("drafts").put({
        id: "current",
        type: "General",
        title: "Keep this unfinished draft",
        content: "This draft has not been published.",
        tags: ["Design"],
        updatedAt: now,
        imageIds: [],
      });
      transaction.objectStore("bookmarks").put({
        id: "posts:fixture-preserved-post",
        kind: "posts",
        itemId: "fixture-preserved-post",
      });
      transaction.objectStore("conversations").put({
        id: "fixture-conversation",
        participantIds: ["u0", "u2"],
        updatedAt: now,
        unread: 0,
      });
      transaction.objectStore("messages").put({
        id: "fixture-message",
        conversationId: "fixture-conversation",
        senderId: "u0",
        content: "Keep this existing conversation",
        createdAt: now,
      });
      transaction.objectStore("comments").put({
        id: "fixture-comment",
        postId: "fixture-preserved-post",
        userId: "u0",
        content: "Keep this comment",
        createdAt: now,
      });
      transaction
        .objectStore("interactions")
        .put({ id: "teamRequest:t2", kind: "teamRequest", itemId: "t2" });
      await new Promise((resolve, reject) => {
        transaction.oncomplete = resolve;
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
      });
    } finally {
      database.close();
    }
  }, legacy);
  const before = await snapshot();
  await page.reload();
  await ready();
  const migrated = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("mu-connect-user")),
  );
  assert.equal(migrated.name, "Tester");
  assert.equal(migrated.username, "tester");
  assert.equal(migrated.id, "u0");
  assert.deepEqual(await snapshot(), before);
  check(
    "Untouched legacy identity migrates without changing any IndexedDB row or image bytes",
  );
  await page.goto("http://localhost:3000/teams");
  await ready();
  await page.getByRole("button", { name: /Recruit teammates/i }).click();
  const composer = page.getByRole("dialog", {
    name: "Create a post",
    exact: true,
  });
  await composer.locator('input[name="title"]').waitFor();
  await page.waitForFunction(
    () =>
      document.querySelector('input[name="title"]')?.value ===
      "Keep this unfinished draft",
  );
  assert.equal(
    await composer.locator('select[name="category"]').inputValue(),
    "General",
  );
  await page.keyboard.press("Escape");
  check(
    "Recruiting restores the existing draft without silently changing its category",
  );
  const customized = {
    ...legacy,
    bio: "My customized biography must remain exactly as I wrote it.",
    interests: ["Photography", "Research", "Music"],
    skills: ["Figma"],
    email: "my.profile@example.com",
  };
  await page.evaluate(
    (profile) =>
      localStorage.setItem("mu-connect-user", JSON.stringify(profile)),
    customized,
  );
  await page.goto("http://localhost:3000/profile/thanapon.dev");
  await ready();
  await page.getByText(customized.bio, { exact: true }).waitFor();
  assert.deepEqual(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("mu-connect-user")),
    ),
    customized,
  );
  assert.deepEqual(await snapshot(), before);
  check(
    "Customized legacy profiles, selections, and existing local content are preserved",
  );
  await page.goto("http://localhost:3000/login");
  await page.locator("[data-mock-ready=true]").waitFor();
  await page.getByRole("button", { name: /Continue as demo student/i }).click();
  await page.waitForURL("**/home");
  const afterLogin = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("mu-connect-user")),
  );
  for (const key of ["bio", "interests", "skills", "username", "email"])
    assert.deepEqual(afterLogin[key], customized[key]);
  assert.equal(
    await page.evaluate(
      () =>
        JSON.parse(localStorage.getItem("mu-connect-message-drafts:u0"))[
          "fixture-conversation"
        ],
    ),
    "Unsent conversation draft",
  );
  check(
    "Returning demo login respects onboarding completion and customized profile/drafts",
  );
  await page.goto("http://localhost:3000/onboarding");
  await page
    .getByRole("heading", { name: "What are you curious about?", exact: true })
    .waitFor();
  await page.getByRole("button", { name: "Photography", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Continue", exact: true })
      .isEnabled(),
    false,
  );
  await page.getByRole("button", { name: "Photography", exact: true }).click();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.getByRole("button", { name: "Figma", exact: true }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Enter the community", exact: true })
      .isEnabled(),
    false,
  );
  await page.getByRole("button", { name: "Figma", exact: true }).click();
  await page
    .getByRole("button", { name: "Enter the community", exact: true })
    .click();
  await page.waitForURL("**/home");
  const selected = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("mu-connect-user")),
  );
  assert.deepEqual(
    [...selected.interests].sort(),
    [...customized.interests].sort(),
  );
  assert.deepEqual(selected.skills, customized.skills);
  check("Onboarding enforces its visible minimums while preserving selections");
  await mkdir(".impeccable/implementation", { recursive: true });
  await writeFile(
    ".impeccable/implementation/persistence-validation.json",
    JSON.stringify(
      {
        passed,
        preservation:
          "All pre-existing IndexedDB records and image Blob bytes compared before/after in an isolated context; local message drafts retained.",
      },
      null,
      2,
    ),
  );
} finally {
  await context.close();
  await browser.close();
}
