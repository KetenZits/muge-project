import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "./browser.mjs";
const base = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({ headless: true });
const routes = [
  "/home",
  "/home?view=feed",
  "/discover",
  "/people",
  "/teams",
  "/teams?view=mine",
  "/teams/t1",
  "/profile/tester",
  "/messages",
  "/notifications",
  "/saved",
  "/me",
  "/competitions",
  "/competitions/c1",
  "/events",
  "/communities",
  "/communities/ai-collective",
  "/posts/p1",
  "/login",
  "/onboarding",
];
const errors = [],
  responsive = [],
  failures = [];
await mkdir(".impeccable/review", { recursive: true });
const context = await browser.newContext({ reducedMotion: "reduce" });
const page = await context.newPage();
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (
    message.type() === "error" &&
    /hydration|Hydrat|maximum update depth|too many re-renders/.test(
      message.text(),
    )
  )
    errors.push(message.text());
});
try {
  for (const width of [320, 360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 900 : 1000 });
    for (const route of routes) {
      await page.goto(base + route);
      await page.locator('[data-mock-ready="true"]').waitFor();
      await page.locator("main h1").first().waitFor({ state: "attached" });
      await page.waitForTimeout(route === "/login" ? 1000 : 120);
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth + 1,
        width: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        headings: [...document.querySelectorAll("h1")].map((e) =>
          e.textContent.trim(),
        ),
        unnamed: [
          ...document.querySelectorAll(
            "input:not([type=hidden]),textarea,select",
          ),
        ].filter(
          (e) =>
            !e.labels?.length &&
            !e.getAttribute("aria-label") &&
            !e.getAttribute("aria-labelledby"),
        ).length,
      }));
      responsive.push({ route, width, ...result });
      if (result.overflow)
        failures.push(
          `${route} overflows at ${width}px: ${result.documentWidth}`,
        );
      if (result.unnamed) failures.push(`${route} has unnamed fields`);
      if (
        [390, 1440].includes(width) &&
        [
          "/home",
          "/discover",
          "/teams",
          "/teams/t1",
          "/login",
          "/profile/tester",
          "/messages",
          "/me",
        ].includes(route)
      ) {
        await page.evaluate(() =>
          window.scrollTo({ top: 0, behavior: "instant" }),
        );
        await page.screenshot({
          path: `.impeccable/review/${route.slice(1).replaceAll("/", "-")}-${width}.png`,
          fullPage: false,
        });
      }
    }
    console.log(
      `PASS ${width}px: ${routes.length} routes, no overflow, all fields named`,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/home");
  await page.locator('[data-mock-ready="true"]').waitFor();
  const main = page.locator("main");
  assert.equal(await main.locator(".shortcut-tile").count(), 6);
  for (const [title, href] of [
    ["Discover People", "/discover?scope=People"],
    ["Find Teams", "/teams"],
    ["My Teams", "/teams?view=mine"],
    ["Messages", "/messages"],
    ["My Profile", "/profile/tester"],
  ])
    assert.equal(
      await main
        .getByRole("link", { name: new RegExp(`^${title}`) })
        .getAttribute("href"),
      href,
    );
  await main.getByRole("button", { name: /^Create a Team/ }).click();
  await page
    .getByRole("dialog", { name: "Create a post", exact: true })
    .waitFor();
  assert.equal(
    await page.locator('select[name="category"]').inputValue(),
    "Team",
  );
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Toggle Sidebar", exact: true })
    .click();
  await page.waitForFunction(() =>
    document.querySelector('[data-collapsible="icon"]'),
  );
  assert.equal(
    await page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .getByRole("link")
      .count(),
    5,
  );
  await page
    .getByRole("button", { name: "Toggle Sidebar", exact: true })
    .click();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/discover");
  await page.locator("main article").first().waitFor();
  await page.getByRole("button", { name: "More filters", exact: true }).click();
  await page
    .getByRole("dialog", { name: "Refine your search", exact: true })
    .waitFor();
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Explore campus", exact: true })
    .click();
  await page
    .getByRole("dialog", { name: "Explore campus", exact: true })
    .getByRole("link", { name: /^Competitions/ })
    .click();
  await page.waitForURL("**/competitions");
  await page.goto(base + "/profile/tester");
  await page.getByRole("button", { name: "Edit profile", exact: true }).click();
  const editor = page.getByRole("dialog", {
    name: "Edit your profile",
    exact: true,
  });
  await editor
    .getByRole("textbox", { name: "Name", exact: true })
    .fill("Storage Recovery Student");
  await page.evaluate(() => {
    window.__originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === "mu-connect-user")
        throw new DOMException(
          "Blocked for regression test",
          "QuotaExceededError",
        );
      return window.__originalSetItem.call(this, key, value);
    };
  });
  await editor
    .getByRole("button", { name: "Save changes", exact: true })
    .click();
  await editor
    .getByRole("alert")
    .filter({ hasText: "Your changes could not be saved" })
    .waitFor();
  assert.equal(
    await editor
      .getByRole("textbox", { name: "Name", exact: true })
      .inputValue(),
    "Storage Recovery Student",
  );
  await page.evaluate(() => {
    Storage.prototype.setItem = window.__originalSetItem;
  });
  await editor
    .getByRole("button", { name: "Save changes", exact: true })
    .click();
  await editor.waitFor({ state: "hidden" });
  await page.reload();
  await page
    .getByRole("heading", { name: "Storage Recovery Student", exact: true })
    .waitFor();
  console.log(
    "PASS profile storage failure retains edits and successful retry persists across reload",
  );
  assert.deepEqual(failures, []);
  assert.deepEqual(errors, []);
  console.log(
    "PASS dashboard targets, real team composer, sidebar collapse, five destinations, mobile filter Sheet and campus navigation",
  );
} finally {
  await writeFile(
    ".impeccable/review/v6-validation.json",
    JSON.stringify({ responsive, errors }, null, 2),
  );
  await browser.close();
}
