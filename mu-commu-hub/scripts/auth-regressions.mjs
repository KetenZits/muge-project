import assert from "node:assert/strict";
import { chromium } from "./browser.mjs";

// Every scenario uses an isolated context. Never open or reset a user's browser profile.
const base = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const unexpected = [];
const scenario = async (name, run) => {
  if (process.env.AUTH_FILTER && !name.includes(process.env.AUTH_FILTER))
    return;
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const diagnostics = [];
  context.on("page", (page) => {
    page.on("pageerror", (error) =>
      unexpected.push(`${name}: ${error.message}`),
    );
    page.on("console", (message) => {
      if (["warning", "error"].includes(message.type()))
        diagnostics.push(message.text());
      if (
        message.type() === "error" &&
        /hydrated|hydration|maximum update depth|too many re-renders/i.test(
          message.text(),
        )
      )
        unexpected.push(`${name}: ${message.text()}`);
    });
    page.on("response", (response) => {
      if (response.url().includes("/api/"))
        diagnostics.push(`${response.status()} ${response.url()}`);
    });
  });
  try {
    await run(context);
    console.log("PASS", name);
  } catch (error) {
    console.error(
      JSON.stringify(
        {
          diagnostics: diagnostics.slice(-20),
          pages: await Promise.all(
            context.pages().map(async (page) => ({
              url: page.url(),
              ...(await page.evaluate(() => ({
                text: document.body.innerText.slice(0, 2400),
                ready: document
                  .querySelector("[data-mock-ready]")
                  ?.getAttribute("data-mock-ready"),
                events: window.databaseEvents,
              }))),
            })),
          ),
        },
        null,
        2,
      ),
    );
    throw error;
  } finally {
    await context.close();
  }
};
const login = async (page) => {
  await page.goto(`${base}/login`);
  await page
    .getByRole("heading", { name: "Enter the demo", exact: true })
    .waitFor();
  await page.locator('[data-session-status="ready"]').waitFor();
};
const dataReady = async (page) => {
  await page.locator('[data-mock-ready="true"]').waitFor();
  assert.equal(
    await page
      .getByRole("button", { name: "Retry campus data", exact: true })
      .count(),
    0,
  );
};
const fixture = async (context) => {
  const page = await context.newPage();
  await page.route("**/auth-fixture", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Isolated auth fixture</title>",
    }),
  );
  await page.goto(`${base}/auth-fixture`);
  return page;
};

try {
  await scenario(
    "Fresh login, onboarding, returning entry, refresh, Back/Forward, and all related routes",
    async (context) => {
      const page = await context.newPage();
      const counts = new Map();
      page.on("request", (request) => {
        if (request.url().includes("/api/"))
          counts.set(request.url(), (counts.get(request.url()) ?? 0) + 1);
      });
      await login(page);
      assert.equal(
        await page.locator('input[type="email"]').inputValue(),
        "user@gmail.com",
      );
      assert.equal(
        await page
          .getByRole("button", {
            name: "Continue as demo student",
            exact: true,
          })
          .isEnabled(),
        true,
      );
      await dataReady(page);
      for (const width of [375, 430, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          `Login must fit at ${width}px`,
        );
        assert.equal(
          await page
            .getByRole("button", {
              name: "Continue as demo student",
              exact: true,
            })
            .isEnabled(),
          true,
        );
      }
      assert.equal(counts.size, 12);
      assert.ok(
        [...counts.values()].every((count) => count === 1),
        "Strict Mode must not double startup requests",
      );
      await page
        .getByRole("button", { name: "Continue as demo student", exact: true })
        .click();
      await page.waitForURL("**/onboarding");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page
        .getByRole("button", { name: "Enter the community", exact: true })
        .click();
      await page.waitForURL("**/home");
      await page.locator("main h1").first().waitFor();
      assert.equal(
        await page.evaluate(() => localStorage.getItem("mu-connect-onboarded")),
        "true",
      );
      for (const path of [
        "/",
        "/home",
        "/profile/tester",
        "/me",
        "/onboarding",
      ]) {
        await page.goto(`${base}${path}`);
        await page.locator('[data-session-status="ready"]').waitFor();
        await page.locator("h1").first().waitFor();
        assert.equal(new URL(page.url()).pathname, path);
      }
      for (let entry = 0; entry < 2; entry++) {
        await login(page);
        await page
          .getByRole("button", {
            name: "Continue as demo student",
            exact: true,
          })
          .click();
        await page.waitForURL("**/home");
        await page.reload();
        await page.locator("main h1").first().waitFor();
      }
      await page.goBack();
      await page
        .getByRole("heading", { name: "Enter the demo", exact: true })
        .waitFor();
      await page.goForward();
      await page.waitForURL("**/home");
      await page.locator("main h1").first().waitFor();
    },
  );

  await scenario(
    "Blocked v2 database upgrade renders login and an actionable error; retry preserves old records",
    async (context) => {
      await context.addInitScript(() => {
        const open = IDBFactory.prototype.open;
        window.databaseEvents = [];
        IDBFactory.prototype.open = function (...args) {
          const request = open.apply(this, args);
          if (args[0] === "mu-connect-prototype") {
            window.databaseEvents.push(`open(${args.join(",")})`);
            for (const event of [
              "blocked",
              "success",
              "error",
              "upgradeneeded",
            ])
              request.addEventListener(event, () =>
                window.databaseEvents.push(event),
              );
          }
          return request;
        };
      });
      const blocker = await fixture(context);
      await blocker.evaluate(async () => {
        const request = indexedDB.open("mu-connect-prototype", 20);
        request.onupgradeneeded = () => {
          const schema = {
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
          for (const [name, indexes] of Object.entries(schema)) {
            const table = request.result.createObjectStore(name, {
              keyPath: "id",
            });
            for (const index of indexes) table.createIndex(index, index);
          }
        };
        window.blockingConnection = await new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        const tx = window.blockingConnection.transaction("drafts", "readwrite");
        tx.objectStore("drafts").put({
          id: "auth-preserved-draft",
          content: "Keep this unfinished work",
          updatedAt: "2026-10-15T00:00:00Z",
        });
        await new Promise((resolve, reject) => {
          tx.oncomplete = resolve;
          tx.onabort = () => reject(tx.error);
        });
      });
      const page = await context.newPage();
      await login(page);
      await page.getByText(/Another MU Connect tab is preventing/).waitFor();
      assert.equal(
        await page
          .getByRole("button", {
            name: "Continue as demo student",
            exact: true,
          })
          .isEnabled(),
        true,
      );
      await page
        .getByRole("button", { name: "Retry campus data", exact: true })
        .click();
      await page.locator('[data-mock-ready="true"]').waitFor();
      await page.getByText(/Another MU Connect tab is preventing/).waitFor();
      await blocker.evaluate(() => window.blockingConnection.close());
      await page
        .getByRole("button", { name: "Retry campus data", exact: true })
        .click();
      await dataReady(page);
      assert.equal(
        await page.evaluate(
          () =>
            window.databaseEvents.filter(
              (event) => event === "open(mu-connect-prototype,30)",
            ).length,
        ),
        1,
        "Blocked retries must reuse one physical open request",
      );
      const preserved = await page.evaluate(async () => {
        const request = indexedDB.open("mu-connect-prototype");
        const db = await new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
        try {
          const read = db
            .transaction("drafts")
            .objectStore("drafts")
            .get("auth-preserved-draft");
          return await new Promise((resolve, reject) => {
            read.onsuccess = () => resolve(read.result);
            read.onerror = () => reject(read.error);
          });
        } finally {
          db.close();
        }
      });
      assert.equal(preserved.content, "Keep this unfinished work");
    },
  );

  await scenario(
    "IndexedDB unavailable settles into a recoverable error without blocking demo profile entry",
    async (context) => {
      await context.addInitScript(() => {
        const open = IDBFactory.prototype.open;
        window.failDatabase = true;
        IDBFactory.prototype.open = function (...args) {
          if (args[0] === "mu-connect-prototype" && window.failDatabase)
            throw new DOMException("Fixture storage denied", "SecurityError");
          return open.apply(this, args);
        };
      });
      const page = await context.newPage();
      await login(page);
      await page.getByText(/Your local database could not be opened/).waitFor();
      await page
        .getByRole("button", { name: "Continue as demo student", exact: true })
        .click();
      await page.waitForURL("**/onboarding");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page
        .getByRole("button", { name: "Enter the community", exact: true })
        .click();
      await page.waitForURL("**/home");
      await page
        .getByRole("heading", { name: "Could not load the demo", exact: true })
        .waitFor();
      await page.evaluate(() => {
        window.failDatabase = false;
      });
      await page
        .getByRole("button", { name: "Try again", exact: true })
        .click();
      await page.locator("main h1").first().waitFor();
    },
  );

  await scenario(
    "MSW registration rejection is retryable instead of retaining a rejected startup promise",
    async (context) => {
      await context.addInitScript(() => {
        if (!("ServiceWorkerContainer" in window)) return;
        const register = ServiceWorkerContainer.prototype.register;
        window.failWorker = true;
        ServiceWorkerContainer.prototype.register = function (...args) {
          if (window.failWorker)
            return Promise.reject(
              new DOMException("Fixture registration denied", "SecurityError"),
            );
          return register.apply(this, args);
        };
      });
      const page = await context.newPage();
      await login(page);
      await page.getByText(/The local demo API could not start/).waitFor();
      await page.evaluate(() => {
        window.failWorker = false;
      });
      await page
        .getByRole("button", { name: "Retry campus data", exact: true })
        .click();
      await dataReady(page);
    },
  );

  await scenario(
    "Profile storage error has Retry; custom profile is not overwritten on recovery",
    async (context) => {
      const seed = await fixture(context);
      const custom = {
        id: "u0",
        name: "My own name",
        username: "campus-tester",
        bio: "Keep my customized profile",
        email: "custom@example.com",
        skills: ["Figma"],
        interests: ["Research", "Music", "Photography"],
        role: "student",
      };
      await seed.evaluate(
        (profile) =>
          localStorage.setItem("mu-connect-user", JSON.stringify(profile)),
        custom,
      );
      await context.addInitScript(() => {
        const get = Storage.prototype.getItem;
        window.failProfile = true;
        Storage.prototype.getItem = function (key) {
          if (key === "mu-connect-user" && window.failProfile)
            throw new DOMException("Fixture storage denied", "SecurityError");
          return get.call(this, key);
        };
      });
      const page = await context.newPage();
      await page.goto(`${base}/login`);
      await page
        .getByRole("heading", {
          name: "Could not restore your demo profile",
          exact: true,
        })
        .waitFor();
      assert.equal(
        await page
          .getByRole("heading", { name: "Enter the demo", exact: true })
          .count(),
        0,
      );
      await page.evaluate(() => {
        window.failProfile = false;
      });
      await page
        .getByRole("button", { name: "Try again", exact: true })
        .click();
      await page
        .getByRole("heading", { name: "Enter the demo", exact: true })
        .waitFor();
      assert.equal(
        await page.locator('input[type="email"]').inputValue(),
        custom.email,
      );
      assert.deepEqual(
        await page.evaluate(() =>
          JSON.parse(localStorage.getItem("mu-connect-user")),
        ),
        custom,
      );
    },
  );

  await scenario(
    "Refresh during MSW startup and entering before data resolves preserve newer role and onboarding",
    async (context) => {
      await context.addInitScript(() => {
        if (!("ServiceWorkerContainer" in window)) return;
        const register = ServiceWorkerContainer.prototype.register;
        window.registerCalls = 0;
        ServiceWorkerContainer.prototype.register = function (...args) {
          window.registerCalls++;
          return new Promise((resolve, reject) => {
            window.releaseWorker = () =>
              register.apply(this, args).then(resolve, reject);
          });
        };
      });
      const page = await context.newPage();
      await login(page);
      await page.waitForFunction(
        () => typeof window.releaseWorker === "function",
      );
      await page.reload();
      await page
        .getByRole("heading", { name: "Enter the demo", exact: true })
        .waitFor();
      await page.waitForFunction(
        () => typeof window.releaseWorker === "function",
      );
      assert.equal(await page.evaluate(() => window.registerCalls), 1);
      await page.getByRole("button", { name: "Admin", exact: true }).click();
      await page
        .getByRole("button", { name: "Continue as demo admin", exact: true })
        .click();
      await page.waitForURL("**/onboarding");
      await page.getByRole("button", { name: "Continue", exact: true }).click();
      await page
        .getByRole("button", { name: "Enter the community", exact: true })
        .click();
      await page.waitForURL("**/home");
      await page.evaluate(() => window.releaseWorker());
      await page.locator("main h1").first().waitFor();
      const profile = await page.evaluate(() =>
        JSON.parse(localStorage.getItem("mu-connect-user")),
      );
      assert.equal(profile.role, "admin");
      assert.equal(
        await page.evaluate(() => localStorage.getItem("mu-connect-onboarded")),
        "true",
      );
      await page.locator('a[href="/profile/tester"]').first().click();
      await page
        .getByRole("heading", { name: "Tester", exact: true })
        .waitFor();
    },
  );
  assert.deepEqual(
    unexpected,
    [],
    "No browser uncaught exceptions, including failure scenarios",
  );
  console.log(
    "PASS no uncaught exceptions in authentication browser regressions",
  );
} finally {
  await browser.close();
}
