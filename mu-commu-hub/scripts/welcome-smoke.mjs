import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright-core";

const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true, args: ["--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader"] });
const failures = [];
const sizes = process.argv[2] === "reduced" ? [] : process.argv[2] ? [Number(process.argv[2])] : [1440, 1024, 768, 425, 390, 375, 360, 320];
const talents = [
  ["Programming", "Narin"], ["Design", "Pim"], ["Marketing", "Maya"],
  ["Pitching", "Than"], ["AI & Data", "Nicha"], ["Robotics", "Dao"],
];

try {
  for (const width of sizes) {
    const page = await browser.newPage({ viewport: { width, height: width <= 390 ? 844 : 900 }, deviceScaleFactor: 1 });
    page.on("pageerror", (error) => failures.push(`${width}: ${error.message}`));
    page.on("console", (message) => { if (message.type() === "error") failures.push(`${width} console: ${message.text()}`); });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.locator(".welcome-page").waitFor();
    if (width === 1440) {
      const stroke = page.locator(".welcome-wordmark-outline [data-stroke-char]").first();
      await stroke.waitFor();
      const firstOffset = await stroke.evaluate((node) => Number.parseFloat(getComputedStyle(node).strokeDashoffset));
      await page.waitForFunction((offset) => {
        const node = document.querySelector(".welcome-wordmark-outline [data-stroke-char]");
        return node && Math.abs(Number.parseFloat(getComputedStyle(node).strokeDashoffset) - offset) > 1;
      }, firstOffset, { timeout: 3500 });
      const nextOffset = await stroke.evaluate((node) => Number.parseFloat(getComputedStyle(node).strokeDashoffset));
      assert.ok(Number.isFinite(firstOffset) && Number.isFinite(nextOffset) && Math.abs(firstOffset - nextOffset) > 1, `Stroke Text outline did not draw: ${firstOffset} → ${nextOffset}`);
      await page.waitForFunction(() => document.querySelector(".welcome-wordmark-stack")?.classList.contains("is-ready"), undefined, { timeout: 6000 });
    }
    await page.waitForFunction(() => performance.getEntriesByType("resource").some((entry) => entry.name.includes("mu-emblem.glb")), undefined, { timeout: 15000 });
    await page.waitForTimeout(width === 1440 || width === 390 ? 2800 : 350);
    const metrics = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth,
      canvases: document.querySelectorAll("canvas").length,
      modelLoaded: performance.getEntriesByType("resource").some((entry) => entry.name.includes("mu-emblem.glb")),
      heading: document.querySelector(".welcome-wordmark")?.textContent,
      brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.currentSrc),
    }));
    assert.ok(metrics.documentWidth <= metrics.viewportWidth + 1, `${width}px overflow: ${JSON.stringify(metrics)}`);
    assert.equal(metrics.heading, "MU CONNECT");
    assert.ok(metrics.modelLoaded, `${width}px emblem was not requested`);
    assert.deepEqual(metrics.brokenImages, [], `${width}px broken images`);
    assert.ok(await page.locator(".welcome-navbar-brand").isVisible(), `${width}px navbar brand is hidden`);
    assert.equal((await page.locator(".welcome-navbar-brand").textContent())?.trim(), "MU CONNECT");
    const floating = await page.locator(".welcome-navbar").evaluate((node) => {
      const box = node.getBoundingClientRect();
      return { top: box.top, left: box.left, right: box.right, radius: getComputedStyle(node).borderRadius };
    });
    assert.ok(floating.top >= 11 && floating.left >= 11 && floating.right <= width - 11, `${width}px navbar not floating: ${JSON.stringify(floating)}`);
    const navBlur = await page.locator(".welcome-navbar").evaluate((node) => getComputedStyle(node).backdropFilter);
    assert.ok(navBlur.includes("blur("), `${width}px navbar lost its frosted backdrop: ${navBlur}`);
    const collage = await page.evaluate(() => {
      const title = document.querySelector(".welcome-wordmark").getBoundingClientRect();
      const cards = [...document.querySelectorAll(".welcome-collage-card")].filter(node => getComputedStyle(node).display !== "none");
      return {
        count: cards.length,
        intersections: cards.filter(node => {
          const box = node.getBoundingClientRect();
          return box.left < title.right && box.right > title.left && box.top < title.bottom && box.bottom > title.top;
        }).map(node => node.className),
      };
    });
    assert.equal(collage.count, width >= 1180 ? 6 : width >= 700 ? 5 : 3, `${width}px collage count`);
    if ([1440, 768, 390].includes(width)) await page.screenshot({ path: join(tmpdir(), `mu-welcome-${width}-hero.png`) });
    assert.deepEqual(collage.intersections, [], `${width}px collage covers the wordmark: ${collage.intersections.join(", ")}`);
    if (width === 1440) {
      for (const selector of [".welcome-galaxy canvas", ".welcome-light-rays canvas", ".welcome-emblem canvas"]) {
        const canvas = page.locator(selector);
        const before = await canvas.screenshot();
        await page.waitForTimeout(1350);
        const after = await canvas.screenshot();
        assert.ok(!before.equals(after), `${selector} is visually static`);
      }
      const ambientBefore = await page.evaluate(() => ({
        gradient: getComputedStyle(document.querySelector(".welcome-wordmark-gradient")).getPropertyValue("--gt-gradient"),
        collage: getComputedStyle(document.querySelector(".welcome-collage-float")).transform,
      }));
      await page.waitForTimeout(900);
      const ambientAfter = await page.evaluate(() => ({
        gradient: getComputedStyle(document.querySelector(".welcome-wordmark-gradient")).getPropertyValue("--gt-gradient"),
        collage: getComputedStyle(document.querySelector(".welcome-collage-float")).transform,
      }));
      assert.notEqual(ambientBefore.gradient, ambientAfter.gradient, "Wordmark gradient did not move");
      assert.notEqual(ambientBefore.collage, ambientAfter.collage, "Collage idle motion did not run");
      const benefitTop = await page.locator(".welcome-benefits").evaluate((node) => node.getBoundingClientRect().top + scrollY);
      await page.evaluate((top) => window.scrollTo({ top: top - 400, behavior: "instant" }), benefitTop);
      await page.waitForTimeout(1100);
      const faded = await page.locator(".welcome-white-hero").evaluate((node) => Number(getComputedStyle(node).opacity));
      assert.ok(faded < 0.9, `Hero did not fade while pinned: ${faded}`);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1100);
      const revived = await page.locator(".welcome-white-hero").evaluate((node) => Number(getComputedStyle(node).opacity));
      assert.ok(revived > 0.9, `Reverse scroll did not restore hero: ${revived}`);
      const whiteHeroEnd = await page.locator(".welcome-white-hero").evaluate((node) => node.getBoundingClientRect().top + scrollY + node.clientHeight - 180);
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), whiteHeroEnd);
      await page.waitForTimeout(850);
      const dispersed = await page.locator(".welcome-collage-card").first().evaluate((node) => Number(getComputedStyle(node).opacity));
      assert.ok(dispersed < 0.15, `Collage did not disperse: ${dispersed}`);
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(850);
      const restored = await page.locator(".welcome-collage-card").first().evaluate((node) => Number(getComputedStyle(node).opacity));
      assert.ok(restored > 0.85, `Collage did not restore: ${restored}`);
    }
    const folder = page.locator(".welcome-benefit-card .group\\/stage").first();
    await folder.scrollIntoViewIfNeeded();
    await folder.click();
    assert.equal(await folder.getAttribute("aria-expanded"), "true", `${width}px folder did not open`);
    if (width === 1440 || width === 1024) {
      await page.waitForTimeout(600);
      if (width === 1440) await page.screenshot({ path: join(tmpdir(), "mu-welcome-benefits.png") });
      const talent = page.locator(".welcome-talents");
      const position = await talent.evaluate((node) => ({ top: node.getBoundingClientRect().top + scrollY, travel: node.clientHeight - innerHeight }));
      const cardFrame = page.locator(".welcome-talent-card-stage");
      const frameBounds = () => cardFrame.evaluate((node) => {
        const box = node.getBoundingClientRect();
        return { left: box.left, right: box.right, width: box.width, xTransform: getComputedStyle(node).transform };
      });
      const sidebarBounds = () => page.locator(".welcome-talent-desktop-nav").evaluate((node) => {
        const box = node.getBoundingClientRect();
        return { left: box.left, right: box.right, opacity: Number(getComputedStyle(node).opacity) };
      });
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), position.top);
      await page.waitForTimeout(400);
      const centered = await frameBounds();
      const hiddenSidebar = await sidebarBounds();
      assert.ok(Math.abs((centered.left + centered.right) / 2 - width / 2) <= 3, `Profile 1 did not begin centered: ${JSON.stringify(centered)}`);
      assert.ok(hiddenSidebar.opacity < 0.05, `Sidebar appeared before the intro: ${hiddenSidebar.opacity}`);
      if (width === 1440) await page.screenshot({ path: join(tmpdir(), "mu-welcome-talent-intro.png") });
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), position.top + position.travel * 0.06);
      await page.waitForTimeout(300);
      const moving = await frameBounds();
      const emergingSidebar = await sidebarBounds();
      assert.ok(moving.left > centered.left && moving.width < centered.width, `Profile 1 did not move and shrink during intro: ${JSON.stringify({ centered, moving })}`);
      assert.ok(emergingSidebar.opacity > 0 && emergingSidebar.opacity < 1, `Sidebar did not reveal with Profile 1: ${emergingSidebar.opacity}`);
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), position.top + position.travel * 0.145);
      await page.waitForTimeout(400);
      const first = await frameBounds();
      const sidebar = await sidebarBounds();
      assert.ok((await page.locator(".welcome-talent-desktop-nav button.is-active").textContent())?.includes("Programming"), "Profile 1 was not active during introduction");
      assert.ok(sidebar.opacity > 0.95 && sidebar.right < first.left, `Sidebar did not settle beside Profile 1: ${JSON.stringify({ sidebar, first })}`);
      assert.equal(first.xTransform, "none", "Profile viewport has a horizontal transform");
      assert.ok(first.left >= 0 && first.right <= width + 1, `${width}px talent card clipped: ${JSON.stringify(first)}`);

      const secondProgress = 0.195 + 0.5 * 0.15;
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), position.top + position.travel * secondProgress);
      await page.waitForFunction(() => document.querySelector(".welcome-talent-desktop-nav button.is-active")?.textContent?.includes("Design"));
      await page.waitForTimeout(90);
      assert.ok(await page.locator(".welcome-talent-card").count() >= 2, "Profile transition did not crossfade overlapping content");
      await page.waitForTimeout(650);
      const afterSecond = await frameBounds();
      assert.ok(Math.abs(afterSecond.left - first.left) <= 1 && Math.abs(afterSecond.width - first.width) <= 1, `Profile container moved between people: ${JSON.stringify({ first, afterSecond })}`);
      assert.ok((await page.locator(".welcome-talent-card[aria-hidden='false'] h3").textContent())?.includes("Pim"), "Profile 2 did not replace Profile 1");
      assert.ok((await page.locator(".welcome-talent-desktop-nav").evaluate((node) => Number(getComputedStyle(node).opacity))) > 0.95, "Sidebar disappeared on Profile 2");

      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), position.top + position.travel * 0.55);
      await page.waitForTimeout(700);
      await page.screenshot({ path: join(tmpdir(), `mu-welcome-${width}-talent.png`) });
      const selected = await page.locator(".welcome-talent-desktop-nav button.is-active").textContent();
      assert.ok(selected?.includes("Pitching"), `Desktop scroll did not change category: ${selected}`);
      for (let index = 0; index < talents.length; index++) {
        const [category, name] = talents[index];
        const progress = index === 0 ? 0.145 : 0.195 + (index - 0.5) * 0.15;
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), position.top + position.travel * progress);
        await page.waitForTimeout(650);
        assert.ok((await page.locator(".welcome-talent-desktop-nav button.is-active").textContent())?.includes(category), `Desktop category ${category} did not activate`);
        assert.ok((await page.locator(".welcome-talent-card[aria-hidden='false'] h3").textContent())?.includes(name), `Desktop profile ${name} did not render`);
        const current = await frameBounds();
        assert.ok(Math.abs(current.left - first.left) <= 1 && Math.abs(current.width - first.width) <= 1, `Desktop ${category} moved the profile frame`);
      }
      if (width === 1440) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), position.top + position.travel * 0.82);
        await page.waitForTimeout(40);
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), position.top + position.travel * 0.2);
        await page.waitForTimeout(700);
        assert.equal(await page.locator(".welcome-talent-card").count(), 1, "Rapid reverse scroll left overlapping profile layers");
      }
      await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), position.top);
      await page.waitForTimeout(650);
      assert.ok((await page.locator(".welcome-talent-desktop-nav button.is-active").textContent())?.includes("Programming"), "Desktop reverse scroll did not restore the first category");
      const restoredCenter = await frameBounds();
      assert.ok(Math.abs((restoredCenter.left + restoredCenter.right) / 2 - width / 2) <= 3, "Reverse scroll did not restore centered Profile 1");
      assert.ok((await sidebarBounds()).opacity < 0.05, "Reverse scroll did not hide the sidebar");
      if (width === 1440) {
        await page.setViewportSize({ width: 768, height: 900 });
        await page.waitForTimeout(450);
        assert.ok(await page.locator(".welcome-talent-mobile-nav").isVisible(), "Tablet resize did not switch to the contained tabs");
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 768, "Tablet resize introduced horizontal overflow");
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForTimeout(450);
        const resizedTop = await talent.evaluate((node) => node.getBoundingClientRect().top + scrollY);
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), resizedTop);
        await page.waitForTimeout(450);
        const resizedCenter = await frameBounds();
        assert.ok(Math.abs((resizedCenter.left + resizedCenter.right) / 2 - 720) <= 3, "Desktop resize did not restore the centered introduction");
      }
    }
    if (width < 900) {
      await page.evaluate(() => {
        const section = document.querySelector(".welcome-talents");
        window.scrollTo({ top: section.getBoundingClientRect().top + scrollY - 20, behavior: "instant" });
      });
      await page.waitForTimeout(400);
      const startingY = await page.evaluate(() => scrollY);
      for (const [name, profile] of [...talents, talents[4], talents[1], talents[0]]) {
        await page.getByRole("tab", { name, exact: true }).click();
        await page.waitForTimeout(620);
        const state = await page.evaluate(() => {
          const bounds = (selector) => {
            const box = document.querySelector(selector).getBoundingClientRect();
            return { left: box.left, right: box.right };
          };
          return {
            x: scrollX, y: scrollY, width: document.documentElement.scrollWidth,
            heading: bounds(".welcome-talent-heading"),
            card: bounds(".welcome-talent-card-stage"),
            tabs: bounds(".welcome-talent-mobile-nav"),
          };
        });
        assert.equal(state.x, 0, `${width}px ${name} moved the page horizontally`);
        assert.ok(state.width <= width + 1, `${width}px ${name} overflowed document: ${state.width}`);
        assert.ok(Math.abs(state.y - startingY) <= 1, `${width}px ${name} shifted vertical scroll: ${state.y} vs ${startingY}`);
        for (const [label, box] of [["heading", state.heading], ["card", state.card]]) {
          assert.ok(box.left >= 0 && box.right <= width + 1, `${width}px ${name} clipped ${label}: ${JSON.stringify(box)}`);
        }
        assert.ok(state.tabs.left >= 0 && state.tabs.right <= width + 1, `${width}px tabs escaped viewport`);
        assert.ok((await page.locator(".welcome-talent-card[aria-hidden='false'] h3").textContent())?.includes(profile), `${width}px ${name} profile did not update`);
      }
      await page.getByRole("tab", { name: "Design", exact: true }).click();
      await page.getByText("Pim.", { exact: true }).waitFor();
      assert.equal(await page.getByRole("tab", { name: "Design", exact: true }).getAttribute("aria-selected"), "true");
      if ([768, 390, 320].includes(width)) {
        await page.waitForTimeout(650);
        await page.locator(".welcome-talent-card-stage").scrollIntoViewIfNeeded();
        await page.screenshot({ path: join(tmpdir(), `mu-welcome-${width}-mobile-talent.png`) });
      }
    }
    await page.locator("#welcome-final").scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await page.waitForTimeout(1200);
    const start = page.getByRole("link", { name: "Start", exact: true });
    await start.waitFor({ state: "visible" });
    assert.equal(await start.getAttribute("href"), "/login");
    const expandedHeight = await page.locator(".welcome-navbar").evaluate((node) => node.getBoundingClientRect().height);
    assert.ok(expandedHeight > 600, `${width}px navbar did not expand: ${expandedHeight}`);
    if (width === 1440 || width === 390) await page.screenshot({ path: join(tmpdir(), `mu-welcome-${width}-final.png`) });
    if (width === 1440) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(1100);
      const collapsedHeight = await page.locator(".welcome-navbar").evaluate((node) => node.getBoundingClientRect().height);
      assert.ok(collapsedHeight < 100, `Reverse scroll did not collapse navbar: ${collapsedHeight}`);
      await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
      await page.waitForTimeout(1300);
    }
    await page.waitForFunction(() => document.querySelector(".welcome-navbar")?.classList.contains("is-expanded"));
    await start.click();
    await page.waitForURL("**/login");
    console.log(`PASS ${width}px`, metrics);
    await page.close();
  }
  if (!process.argv[2] || process.argv[2] === "reduced") {
    const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    reduced.on("pageerror", (error) => failures.push(`reduced: ${error.message}`));
    await reduced.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await reduced.locator(".welcome-page").waitFor();
    await reduced.locator(".welcome-emblem canvas").waitFor();
    await reduced.locator(".welcome-wordmark").waitFor({ state: "visible" });
    await reduced.waitForTimeout(1000);
    assert.equal(await reduced.locator(".welcome-light-rays").count(), 0);
    assert.equal(await reduced.locator(".welcome-navbar").evaluate((node) => getComputedStyle(node).opacity), "1");
    await reduced.screenshot({ path: join(tmpdir(), "mu-welcome-reduced.png") });
    await reduced.getByRole("tab", { name: "Design", exact: true }).click();
    await reduced.getByText("Pim.", { exact: true }).waitFor();
    await reduced.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }));
    await reduced.getByRole("link", { name: "Start", exact: true }).waitFor({ state: "visible" });
    await reduced.getByRole("link", { name: "Start", exact: true }).click();
    await reduced.waitForURL("**/login");
    console.log("PASS reduced motion");
    await reduced.close();

    const reducedSmall = await browser.newPage({ viewport: { width: 320, height: 800 }, reducedMotion: "reduce" });
    await reducedSmall.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await reducedSmall.getByRole("tab", { name: "Pitching" }).click();
    await reducedSmall.getByText("Than.", { exact: true }).waitFor();
    const reducedCard = await reducedSmall.evaluate(() => {
      const anchor = document.querySelector(".welcome-talent-card-anchor");
      const card = document.querySelector(".welcome-talent-card");
      return { anchor: anchor.getBoundingClientRect().height, card: card.getBoundingClientRect().height, width: document.documentElement.scrollWidth, x: scrollX };
    });
    assert.ok(reducedCard.anchor >= reducedCard.card, `Reduced-motion card is clipped: ${JSON.stringify(reducedCard)}`);
    assert.equal(reducedCard.width, 320);
    assert.equal(reducedCard.x, 0);
    console.log("PASS reduced motion at 320px");
    await reducedSmall.close();

    const fallback = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await fallback.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
        if (kind === "webgl" || kind === "webgl2" || kind === "experimental-webgl") return null;
        return original.call(this, kind, ...args);
      };
    });
    await fallback.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await fallback.locator(".welcome-emblem").waitFor();
    await fallback.waitForTimeout(500);
    assert.equal(await fallback.locator(".welcome-emblem canvas").count(), 0);
    console.log("PASS WebGL fallback");
    await fallback.close();
  }
  assert.deepEqual(failures, [], `Browser errors: ${failures.join(" | ")}`);
  console.log("PASS no page errors");
  console.log(`Screenshots: ${tmpdir()}\\mu-welcome-*.png`);
} finally {
  await browser.close();
}
