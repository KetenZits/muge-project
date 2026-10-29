import { chromium } from "./browser.mjs";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] ?? "after";
const base = process.env.BASE_URL ?? "http://localhost:3000";
const browser = await chromium.launch({
  headless: true,
});
const results = [];
await mkdir(".impeccable/review", { recursive: true });
try {
  for (const { width, height, cpu } of [
    { width: 390, height: 844, cpu: 4 },
    { width: 768, height: 1024, cpu: 4 },
    { width: 1440, height: 900, cpu: 1 },
  ]) {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
      isMobile: width < 900,
      hasTouch: width < 900,
    });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.locator("#welcome-final").waitFor({ state: "attached" });
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
    );
    await page.waitForTimeout(2500);
    await page.locator(".welcome-nav-wall img").first().waitFor();
    await page.evaluate(() =>
      Promise.race([
        Promise.all(
          [...document.querySelectorAll(".welcome-nav-wall img")].map((img) =>
            img.decode().catch(() => {}),
          ),
        ),
        new Promise((resolve) => setTimeout(resolve, 8000)),
      ]),
    );
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: cpu });
    for (let run = 1; run <= 3; run++) {
      const target = await page
        .locator("#welcome-final")
        .evaluate((node) => node.getBoundingClientRect().top + scrollY);
      await page.evaluate(
        (y) => window.scrollTo({ top: y, behavior: "instant" }),
        target - height * 1.1,
      );
      await page.waitForTimeout(1400);
      const events = [];
      const collect = ({ value }) => events.push(...value);
      cdp.on("Tracing.dataCollected", collect);
      await cdp.send("Tracing.start", {
        categories: "devtools.timeline",
        transferMode: "ReportEvents",
      });
      const timing = await page.evaluate(
        async ({ target, height }) => {
          const frames = [],
            tasks = [];
          const observer = new PerformanceObserver((list) =>
            tasks.push(...list.getEntries().map((e) => e.duration)),
          );
          observer.observe({ type: "longtask" });
          let last = 0;
          await new Promise((resolve) => {
            const start = performance.now();
            function frame(now) {
              if (last) frames.push(now - last);
              last = now;
              const progress = Math.min(1, (now - start) / 2400);
              window.scrollTo({
                top: target - height * 1.1 + height * 1.15 * progress,
                behavior: "instant",
              });
              if (progress < 1) requestAnimationFrame(frame);
              else resolve();
            }
            requestAnimationFrame(frame);
          });
          await new Promise((resolve) => setTimeout(resolve, 100));
          observer.disconnect();
          const sorted = frames.toSorted((a, b) => a - b);
          return {
            fps: +(
              1000 /
              (frames.reduce((a, b) => a + b, 0) / frames.length)
            ).toFixed(1),
            p95Ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(1),
            maxFrameMs: +Math.max(...frames).toFixed(1),
            framesOver34Ms: frames.filter((n) => n > 34).length,
            longTasks: tasks.length,
            longTaskMs: Math.round(tasks.reduce((a, b) => a + b, 0)),
            images: document.querySelectorAll(".welcome-nav-wall img").length,
          };
        },
        { target, height },
      );
      const complete = new Promise((resolve) =>
        cdp.once("Tracing.tracingComplete", resolve),
      );
      await cdp.send("Tracing.end");
      await complete;
      cdp.off("Tracing.dataCollected", collect);
      const cost = (name) =>
        events.filter((e) => e.name === name && e.ph === "X");
      const duration = (name) =>
        +cost(name)
          .reduce((sum, e) => sum + (e.dur ?? 0) / 1000, 0)
          .toFixed(1);
      results.push({
        width,
        height,
        cpu,
        run,
        ...timing,
        layoutCount: cost("Layout").length,
        layoutMs: duration("Layout"),
        paintCount: cost("Paint").length,
        paintMs: duration("Paint"),
        styleMs: duration("UpdateLayoutTree"),
      });
      console.log(JSON.stringify(results.at(-1)));
      await writeFile(
        `.impeccable/review/cta-${label}.json`,
        JSON.stringify(
          {
            environment:
              "Headless Linux Chromium, dev server, warm images, DPR 1; phone/tablet 4x CPU. Emulation is not a physical GPU benchmark.",
            results,
          },
          null,
          2,
        ),
      );
    }
    await page.waitForTimeout(2500);
    await page.screenshot({
      path: `.impeccable/review/cta-${label}-${width}.png`,
    });
    await page.close();
  }
} finally {
  await browser.close();
}
await writeFile(
  `.impeccable/review/cta-${label}.json`,
  JSON.stringify(
    {
      environment:
        "Headless Linux Chromium, development server, warm images with an 8s bounded decode wait, DPR 1; three 2.4s expansion runs per viewport. Mobile/tablet use 4x CPU throttling. Software rendering and emulation do not represent physical mobile GPUs.",
      results,
    },
    null,
    2,
  ),
);
