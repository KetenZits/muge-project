import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const errors = [];
const widths = [
  { width: 375, height: 812 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
];

for (const viewport of widths) {
  const page = await browser.newPage({ viewport });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("http://localhost:3000/");
  const visual = page.locator("[data-scene-state]");
  await visual.waitFor();
  await page.waitForTimeout(900);
  const result = await page.evaluate(() => {
    const visual = document.querySelector("[data-scene-state]");
    const bounds = visual.getBoundingClientRect();
    const canvas = visual.querySelector("canvas");
    return {
      overflow: document.documentElement.scrollWidth > innerWidth,
      scene: visual.getAttribute("data-scene-state"),
      canvas: canvas ? 1 : 0,
      dpr: canvas ? canvas.width / bounds.width : null,
      contained: bounds.left >= -1 && bounds.right <= innerWidth + 1,
    };
  });
  if (result.overflow || !result.contained) {
    errors.push(
      `Landing layout at ${viewport.width}px: ${JSON.stringify(result)}`,
    );
  }
  if (result.scene === "webgl" && !result.canvas) {
    errors.push(`WebGL scene has no Canvas at ${viewport.width}px`);
  }
  if (result.dpr && result.dpr > (viewport.width < 640 ? 1.05 : 1.5)) {
    errors.push(`Canvas DPR is too high at ${viewport.width}px: ${result.dpr}`);
  }
  if (viewport.width === 375 || viewport.width === 1440) {
    await page.screenshot({
      path: `${process.env.TEMP}/mu-motion-${viewport.width}.png`,
      fullPage: false,
    });
    await visual.screenshot({
      path: `${process.env.TEMP}/mu-motion-scene-${viewport.width}.png`,
    });
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  if (result.scene === "webgl") {
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-scene-active]")
          ?.getAttribute("data-scene-active") === "false",
    );
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(
      () =>
        document
          .querySelector("[data-scene-active]")
          ?.getAttribute("data-scene-active") === "true",
    );
  }
  await page.getByRole("link", { name: /Start exploring/ }).click();
  await page.waitForURL("**/login");
  console.log(`${viewport.width}px landing: ${result.scene}`);
  await page.close();
}

const reduced = await browser.newPage({ reducedMotion: "reduce" });
reduced.on("pageerror", (error) => errors.push(error.message));
await reduced.goto("http://localhost:3000/");
await reduced.locator('[data-scene-state="reduced"]').waitFor();
if (await reduced.locator("[data-scene-state] canvas").count()) {
  errors.push("Reduced motion loaded the WebGL Canvas");
}
await reduced.getByRole("link", { name: /Start exploring/ }).click();
await reduced.waitForURL("**/login");
await reduced.goto("http://localhost:3000/home");
await reduced.locator("[data-mock-ready=true]").waitFor();
const reducedPostOpacity = await reduced
  .locator("main article")
  .last()
  .evaluate((element) => getComputedStyle(element).opacity);
if (reducedPostOpacity !== "1") {
  errors.push("Reduced motion left a feed card hidden");
}
await reduced.close();

const fallback = await browser.newPage();
await fallback.addInitScript(() => {
  const original = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (kind, ...args) {
    if (kind === "webgl2") return null;
    return original.call(this, kind, ...args);
  };
});
await fallback.goto("http://localhost:3000/");
await fallback.locator("[data-scene-state]").waitFor();
await fallback.waitForTimeout(500);
if (await fallback.locator("[data-scene-state] canvas").count()) {
  errors.push("Unavailable WebGL loaded the Canvas");
}
await fallback.close();

await browser.close();
console.log("motion browser errors", errors);
if (errors.length) process.exitCode = 1;
