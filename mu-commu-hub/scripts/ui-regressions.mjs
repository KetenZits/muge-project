import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "./browser.mjs";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
const passed = [];
const check = (name) => {
  passed.push(name);
  console.log("PASS", name);
};
const go = async (path) => {
  await page.goto(`http://localhost:3000${path}`);
  await page.locator("[data-mock-ready=true]").waitFor();
  await page.locator("main h1").first().waitFor();
};
const api = async (path) =>
  page.evaluate(async (path) => (await fetch(`/api/${path}`)).json(), path);
const pressScope = async (name) =>
  page
    .getByRole("group", { name: "Result type" })
    .getByRole("button", { name: new RegExp(`^${name} `) })
    .click();

try {
  await go("/discover?q=AI&scope=All");
  assert.equal(
    await page
      .getByRole("searchbox", { name: "Search campus", exact: true })
      .inputValue(),
    "AI",
  );
  const viewAll = page
    .locator("main section")
    .filter({
      has: page.getByRole("heading", { name: "Conversations", exact: true }),
    })
    .getByRole("link", { name: "View all" });
  await viewAll.click();
  await page.waitForURL((url) => url.searchParams.get("scope") === "Posts");
  assert.equal(new URL(page.url()).searchParams.get("q"), "AI");
  await pressScope("People");
  await page.goBack();
  await page.waitForURL((url) => url.searchParams.get("scope") === "Posts");
  await page.goForward();
  await page.waitForURL(
    (url) => (url.searchParams.get("scope") ?? "People") === "People",
  );
  check("Discover URL search, View all, and Back/Forward preserve scope");

  await go("/discover?q=AI+Study+Companion&scope=People");
  await page.getByRole("heading", { name: "No people match" }).waitFor();
  await page.getByRole("button", { name: /^Teams \(/ }).click();
  await page.getByRole("heading", { name: "Teams with open roles" }).waitFor();
  check(
    "Selected empty categories explain zero matches and suggest matching categories",
  );

  await go("/teams?skill=React&mode=Hybrid");
  const origin = new URL(page.url()).pathname + new URL(page.url()).search;
  await page
    .locator("main article")
    .first()
    .getByRole("link", { name: /View team/i })
    .click();
  await page.getByRole("link", { name: "Back to results" }).click();
  await page.waitForURL((url) => url.pathname + url.search === origin);
  await page.locator("main details > summary").click();
  assert.equal(
    await page.getByRole("combobox", { name: /^Skill/ }).inputValue(),
    "React",
  );
  await page.locator("main details > summary").click();
  check("Team detail returns to the originating filters");

  await page.getByRole("button", { name: /Create a Team/i }).click();
  const composer = page.getByRole("dialog", {
    name: "Create a post",
    exact: true,
  });
  await composer.waitFor();
  await page.waitForFunction(
    () => document.querySelector('select[name="category"]')?.value === "Team",
  );
  assert.ok(
    (await composer.boundingBox()).width >= 600,
    "Desktop composer must use its intended width",
  );
  await page.keyboard.press("Escape");
  check("Recruit entry reuses a wide existing composer in Team mode");

  await go("/posts/p1");
  const comment = page.getByRole("textbox", { name: "Comment", exact: true });
  await comment.fill("ก");
  const commentForm = page.locator("form").filter({ has: comment });
  assert.equal(
    await commentForm.locator('button[type="submit"]').isEnabled(),
    false,
  );
  assert.match(
    await page.locator("#comment-guidance").innerText(),
    /2 characters/,
  );
  assert.equal(await comment.inputValue(), "ก");
  await comment.fill(
    "ยินดีร่วมทำโครงการกับทุกคนในมหาวิทยาลัย — Happy to collaborate.",
  );
  await commentForm.locator('button[type="submit"]').click();
  await page
    .getByText(
      "ยินดีร่วมทำโครงการกับทุกคนในมหาวิทยาลัย — Happy to collaborate.",
      { exact: true },
    )
    .waitFor();
  check(
    "Comment validation matches the enabled state and preserves invalid text",
  );

  await go("/messages");
  const conversations = await api("conversations");
  assert.ok(conversations.length >= 2);
  await go(`/messages?conversation=${conversations[0].id}`);
  await page
    .getByRole("textbox", { name: /^Message / })
    .fill("Draft only for thread A");
  await go(`/messages?conversation=${conversations[1].id}`);
  assert.equal(
    await page.getByRole("textbox", { name: /^Message / }).inputValue(),
    "",
  );
  await page
    .getByRole("textbox", { name: /^Message / })
    .fill("Draft only for thread B");
  await go(`/messages?conversation=${conversations[0].id}`);
  assert.equal(
    await page.getByRole("textbox", { name: /^Message / }).inputValue(),
    "Draft only for thread A",
  );
  assert.equal(
    await page.getByRole("button", { name: /Attach|image/i }).count(),
    0,
  );
  await page.getByLabel("Find a conversation").fill("No such student xyz");
  await page.getByRole("button", { name: "Clear search", exact: true }).click();
  check(
    "Message drafts stay with their conversations across navigation and reloads",
  );

  await go("/teams/t1");
  await page
    .getByRole("button", { name: "Request to join", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Withdraw request", exact: true })
    .waitFor();
  await page.reload();
  await page
    .getByRole("button", { name: "Withdraw request", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Request to join", exact: true })
    .waitFor();
  check("Team requests persist and can be explicitly withdrawn");

  await go("/competitions?q=NoSuchCompetition");
  assert.equal(await page.locator("main article").count(), 0);
  assert.equal(
    await page.locator('main a[href="/competitions/c1"]').count(),
    0,
  );
  await go("/profile/tester?tab=Posts");
  assert.equal(
    await page
      .getByRole("tab", { name: /^Posts\b/ })
      .getAttribute("aria-selected"),
    "true",
  );
  check("Filtered competitions and requested profile panels match their URLs");

  await go("/saved?tab=events");
  assert.equal(
    await page
      .getByRole("tab", { name: /^Events\b/ })
      .getAttribute("aria-selected"),
    "true",
  );
  await page.evaluate(async () => {
    await fetch("/api/bookmarks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: "teams:t2", kind: "teams", itemId: "t2" }),
    });
  });
  await go("/saved");
  assert.equal(
    await page
      .getByRole("tab", { name: /^Teams\b/ })
      .getAttribute("aria-selected"),
    "true",
  );
  check(
    "Saved honors an explicit category and defaults to an existing saved collection",
  );

  const events = await api("events");
  await go(`/events?event=${events[0].id}`);
  assert.equal(await page.locator("main article").count(), 1);
  await page.getByRole("button", { name: "I'm going", exact: true }).click();
  await page
    .getByRole("button", { name: "Cancel RSVP", exact: true })
    .waitFor();
  await page.reload();
  await page.getByRole("button", { name: "Cancel RSVP", exact: true }).click();
  await page.getByRole("button", { name: "I'm going", exact: true }).waitFor();
  check(
    "Event handoffs identify the selected event and RSVPs persist and reverse",
  );

  await go("/notifications");
  await page
    .locator("main article")
    .first()
    .getByRole("link", { name: "Open update", exact: true })
    .click();
  await page.waitForURL((url) => url.pathname === "/teams/t1");
  await page.getByRole("link", { name: "Back to results" }).click();
  await page.waitForURL((url) => url.pathname === "/notifications");
  check("Notifications open real sample destinations with a contextual return");

  const users = await api("users");
  await page.keyboard.press("Control+k");
  const palette = page.getByRole("dialog", {
    name: "Search campus",
    exact: true,
  });
  await palette
    .getByRole("combobox", { name: "Search all campus content", exact: true })
    .fill(users.at(-1).name);
  await palette
    .getByRole("option")
    .filter({ hasText: users.at(-1).name })
    .first()
    .waitFor();
  await page.keyboard.press("Escape");
  check("Keyboard search covers students beyond the former preview cutoff");

  await go("/people");
  const messageLink = page
    .locator("main article")
    .first()
    .getByRole("link", { name: /View profile/, exact: true });
  const contrast = await messageLink.evaluate((element) => {
    const rgb = (value) =>
      value
        .match(/[\d.]+/g)
        .slice(0, 3)
        .map(Number);
    const luminance = (color) =>
      rgb(color)
        .map((value) => value / 255)
        .map((value) =>
          value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
        )
        .reduce(
          (total, value, index) =>
            total + value * [0.2126, 0.7152, 0.0722][index],
          0,
        );
    const ratio = (foreground, background) =>
      (Math.max(luminance(foreground), luminance(background)) + 0.05) /
      (Math.min(luminance(foreground), luminance(background)) + 0.05);
    const style = getComputedStyle(element);
    const input = document.querySelector('main input[type="search"]');
    const inputStyle = getComputedStyle(input);
    const placeholder = getComputedStyle(input, "::placeholder");
    const muted = document.querySelector("main article .text-muted");
    return {
      action: ratio(style.color, style.backgroundColor),
      placeholder: ratio(placeholder.color, inputStyle.backgroundColor),
      boundary: ratio(inputStyle.borderColor, inputStyle.backgroundColor),
      caption: ratio(getComputedStyle(muted).color, "rgb(255,255,255)"),
    };
  });
  for (const key of ["action", "placeholder", "caption"])
    assert.ok(contrast[key] >= 4.5, `${key} contrast: ${contrast[key]}`);
  assert.ok(
    contrast.boundary >= 3,
    `Field boundary contrast: ${contrast.boundary}`,
  );
  assert.ok((await messageLink.boundingBox()).height >= 44);
  check(
    "Rendered primary links, captions, placeholders, and field boundaries meet their tested contrast targets",
  );

  await page.setViewportSize({ width: 375, height: 812 });
  await go("/home");
  const nav = page.getByRole("navigation", {
    name: "Mobile navigation",
    exact: true,
  });
  for (const name of ["Home", "Discover", "Teams", "Messages", "Profile"])
    await nav.getByRole("link", { name, exact: true }).waitFor();
  const explore = page.getByRole("button", {
    name: "Explore campus",
    exact: true,
  });
  await explore.click();
  const more = page.getByRole("dialog", {
    name: "Explore campus",
    exact: true,
  });
  for (const name of [
    "Communities",
    "Competitions",
    "Events & gatherings",
    "Saved for later",
    "My Activity",
  ])
    await more.getByRole("link", { name: new RegExp(`^${name}`) }).waitFor();
  await page.keyboard.press("Escape");
  assert.equal(
    await nav
      .getByRole("link", { name: "Profile", exact: true })
      .getAttribute("href"),
    "/profile/tester",
  );
  await page.waitForFunction(
    () =>
      document.activeElement?.getAttribute("aria-label") === "Explore campus",
  );
  const focus = await explore.evaluate((element) => ({
    width: parseFloat(getComputedStyle(element).outlineWidth),
    color: getComputedStyle(element).outlineColor,
  }));
  assert.ok(focus.width >= 3);
  assert.equal(focus.color, "rgb(23, 70, 140)");
  check(
    "Five mobile destinations and the campus Sheet expose every secondary route and restore focus",
  );

  const responsive = [];
  await mkdir(".impeccable/implementation/screenshots", { recursive: true });
  for (const width of [375, 430, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width < 768 ? 900 : 1000 });
    for (const route of [
      "home",
      "discover",
      "teams",
      "competitions",
      "communities",
      "profile/tester",
      "messages",
    ]) {
      await go(`/${route}`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      assert.equal(overflow, false, `${route} must fit ${width}px`);
      const unnamedSearches = await page
        .getByRole("searchbox")
        .evaluateAll(
          (inputs) =>
            inputs.filter(
              (input) =>
                !input.labels?.length &&
                !input.getAttribute("aria-label") &&
                !input.getAttribute("aria-labelledby"),
            ).length,
        );
      assert.equal(unnamedSearches, 0, `${route} search must be named`);
      responsive.push({ width, route, overflow });
      if (width === 375 || width === 1440)
        await page.screenshot({
          path: `.impeccable/implementation/screenshots/${route.replaceAll("/", "-")}-${width}.png`,
        });
    }
    await go("/home");
    await page
      .getByRole("button", { name: "Create post", exact: true })
      .first()
      .click();
    await composer.waitFor();
    assert.equal(
      await composer.evaluate((el) => el.scrollWidth > el.clientWidth + 1),
      false,
      `Composer must fit ${width}px`,
    );
    if (width === 375 || width === 1440)
      await page.screenshot({
        path: `.impeccable/implementation/screenshots/composer-${width}.png`,
      });
    await page.keyboard.press("Escape");
  }
  check(
    "Seven core surfaces and the composer fit all five requested viewport widths",
  );
  assert.deepEqual(errors, []);
  await writeFile(
    ".impeccable/implementation/ui-validation.json",
    JSON.stringify(
      {
        passed,
        responsive,
        browserErrors: errors,
        environment:
          "Headless Chrome viewport emulation with reduced motion; physical devices and assistive technology are unverified.",
      },
      null,
      2,
    ),
  );
} finally {
  await browser.close();
}
