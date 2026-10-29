import assert from "node:assert/strict";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "./browser.mjs";

const widths = process.argv.slice(2).filter((value) => /^\d+$/.test(value)).map(Number);
const label = process.argv.includes("--before") ? "before" : "after";
const browser = await chromium.launch({
  headless: true,
  args: ["--enable-webgl", "--use-gl=angle", "--use-angle=swiftshader"],
});

try {
  for (const width of widths.length ? widths : [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width < 700 ? 844 : 900 }, deviceScaleFactor: 1 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.__navLongTasks = [];
      new PerformanceObserver((entries) => {
        window.__navLongTasks.push(...entries.getEntries().map((entry) => entry.duration));
      }).observe({ entryTypes: ["longtask"] });
    });
    await page.goto("http://localhost:3000/", { waitUntil: "domcontentloaded" });
    await page.locator(".welcome-navbar-brand").waitFor();
    await page.waitForTimeout(1400);
    const compact = await page.evaluate(() => {
      const nav = document.querySelector(".welcome-navbar");
      const compact = document.querySelector(".welcome-nav-compact");
      const glass = document.querySelector(".welcome-nav-glass");
      const brand = document.querySelector(".welcome-navbar-brand");
      const box = (node) => {
        const rect = node.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      };
      return {
        nav: box(nav), glass: box(glass), brand: box(brand),
        clip: getComputedStyle(nav).clipPath,
        entrance: getComputedStyle(compact).animationName,
        blur: getComputedStyle(glass).backdropFilter,
        supportsBlur: CSS.supports("backdrop-filter", "blur(14px) saturate(145%)"),
        borderAnimation: getComputedStyle(document.querySelector(".welcome-nav-rim-glint")).animationName,
        brandFontSize: getComputedStyle(brand).fontSize,
        documentWidth: document.documentElement.scrollWidth,
      };
    });
    assert.ok(Math.abs(compact.nav.x + compact.nav.width / 2 - width / 2) <= 1, `${width}px navbar is off center`);
    const expectedWidth = width < 700 ? width - 24 : Math.min(1020, width - 32, width * 0.25 + 620);
    assert.ok(Math.abs(compact.nav.width - expectedWidth) <= 1, `${width}px navbar width ${compact.nav.width} differs from ${expectedWidth}`);
    assert.equal(compact.documentWidth, width, `${width}px compact navbar overflows`);
    assert.equal(compact.entrance, "welcome-nav-intro", `${width}px navbar entrance is missing`);
    assert.match(compact.blur, /blur\(14px\)/, `${width}px compact glass lost its blur`);
    assert.equal(compact.borderAnimation, "welcome-nav-rim", `${width}px animated glass rim is missing`);
    const borderAtStart = await page.locator(".welcome-nav-rim-glint").evaluate((node) => getComputedStyle(node).transform);
    await page.waitForTimeout(180);
    const borderAfterWait = await page.locator(".welcome-nav-rim-glint").evaluate((node) => getComputedStyle(node).transform);
    assert.notEqual(borderAtStart, borderAfterWait, `${width}px glass rim is not moving`);
    await page.screenshot({ path: join(tmpdir(), `mu-nav-${label}-${width}-compact.png`) });
    const markerTop = await page.locator("#welcome-final").evaluate((node) => node.getBoundingClientRect().top + scrollY);
    const viewportHeight = width < 700 ? 844 : 900;
    const start = markerTop - viewportHeight * (width >= 900 ? 0.5 : 0.85);
    const end = markerTop - viewportHeight * 0.03;
    await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), start - 70);
    await page.waitForTimeout(500);
    await page.evaluate(() => { window.__navLongTasks = []; });
    const client = await page.context().newCDPSession(page);
    await client.send("Performance.enable");
    const metrics = async () => Object.fromEntries((await client.send("Performance.getMetrics")).metrics.map(({ name, value }) => [name, value]));
    const before = await metrics();
    const frames = await page.evaluate(async ({ start, end }) => {
      const durations = [];
      let last = performance.now();
      const begun = last;
      await new Promise((resolve) => {
        const step = (now) => {
          durations.push(now - last);
          last = now;
          const progress = Math.min(1, (now - begun) / 1200);
          scrollTo({ top: start + (end - start) * progress, behavior: "instant" });
          if (progress < 1) requestAnimationFrame(step);
          else resolve();
        };
        requestAnimationFrame(step);
      });
      return durations;
    }, { start, end });
    await page.waitForTimeout(1100);
    const after = await metrics();
    const expanded = await page.evaluate(() => {
      const nav = document.querySelector(".welcome-navbar");
      const surface = document.querySelector(".welcome-nav-surface");
      const wall = document.querySelector(".welcome-nav-wall");
      const panel = document.querySelector(".welcome-nav-panel");
      const box = nav.getBoundingClientRect();
      const panelBox = panel.getBoundingClientRect();
      return {
        x: box.x, y: box.y, width: box.width, height: box.height,
        panel: { x: panelBox.x, y: panelBox.y, width: panelBox.width, height: panelBox.height },
        clip: getComputedStyle(nav).clipPath,
        surfaceTransform: surface ? getComputedStyle(surface).transform : null,
        surfaceOpacity: getComputedStyle(surface).opacity,
        wallOpacity: getComputedStyle(wall).opacity,
        running: document.querySelector(".drift-wall-decorative")?.getAttribute("data-running"),
        documentWidth: document.documentElement.scrollWidth,
      };
    });
    await page.screenshot({ path: join(tmpdir(), `mu-nav-${label}-${width}-expanded.png`) });
    const sorted = frames.slice(1).sort((a, b) => a - b);
    const result = {
      label, width, compact, expanded,
      frames: sorted.length,
      p95FrameMs: Math.round(sorted[Math.floor(sorted.length * 0.95)] * 10) / 10,
      over33Ms: sorted.filter((value) => value > 33).length,
      layoutMs: Math.round(((after.LayoutDuration ?? 0) - (before.LayoutDuration ?? 0)) * 1000),
      styleMs: Math.round(((after.RecalcStyleDuration ?? 0) - (before.RecalcStyleDuration ?? 0)) * 1000),
      longTasks: await page.evaluate(() => window.__navLongTasks),
      errors,
    };
    assert.ok(!errors.length, errors.join("; "));
    assert.ok(expanded.panel.width <= width - 23 && expanded.panel.height > 600, `${width}px expanded CTA escaped safe bounds`);
    assert.ok(Number(expanded.surfaceOpacity) > 0.95, `${width}px expanded surface is hidden`);
    assert.equal(await page.getByRole("link", { name: "Start", exact: true }).getAttribute("href"), "/login");
    await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), (start + end) / 2);
    await page.waitForTimeout(1100);
    result.midpoint = await page.evaluate(() => ({
      surfaceOpacity: Number(getComputedStyle(document.querySelector(".welcome-nav-surface")).opacity),
      surfaceTransform: getComputedStyle(document.querySelector(".welcome-nav-surface")).transform,
      documentWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(result.midpoint.surfaceOpacity > 0.95, `${width}px expansion midpoint is translucent`);
    assert.notEqual(result.midpoint.surfaceTransform, "matrix(1, 0, 0, 1, 0, 0)", `${width}px expansion midpoint snapped to the end`);
    assert.equal(result.midpoint.documentWidth, width, `${width}px expansion midpoint introduced overflow`);
    await page.screenshot({ path: join(tmpdir(), `mu-nav-${label}-${width}-midpoint.png`) });
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(1100);
    const collapsed = await page.evaluate(() => ({
      glass: Number(getComputedStyle(document.querySelector(".welcome-nav-glass")).opacity),
      surface: Number(getComputedStyle(document.querySelector(".welcome-nav-surface")).opacity),
      wallRunning: document.querySelector(".drift-wall-decorative")?.getAttribute("data-running"),
      documentWidth: document.documentElement.scrollWidth,
    }));
    assert.ok(collapsed.glass > 0.95 && collapsed.surface < 0.05, `${width}px reverse scroll did not restore the compact glass pill`);
    assert.equal(collapsed.wallRunning, "false", `${width}px Drift Wall kept running offscreen`);
    assert.equal(collapsed.documentWidth, width, `${width}px reverse scroll introduced overflow`);
    await page.screenshot({ path: join(tmpdir(), `mu-nav-${label}-${width}-reversed.png`) });
    result.collapsed = collapsed;
    console.log(JSON.stringify(result));
    await page.close();
  }
} finally {
  await browser.close();
}
