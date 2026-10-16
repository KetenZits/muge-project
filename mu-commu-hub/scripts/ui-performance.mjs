import { chromium } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] ?? "after";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const measurements = [];
try {
  for (const route of ["/home", "/discover", "/teams"]) {
    // Warm up route compilation and the service worker before the measured reload.
    await page.goto(`http://localhost:3000${route}`);
    await page.locator("[data-mock-ready=true]").waitFor();
    await page.locator("article").first().waitFor();
    for (let run = 0; run < 3; run++) {
      const start = performance.now();
      await page.reload();
      await page.locator("article").first().waitFor();
      measurements.push({
        route,
        run: run + 1,
        readyMs: Math.round(performance.now() - start),
        ...(await page.evaluate(() => ({
          elements: document.querySelectorAll("*").length,
          articles: document.querySelectorAll("article").length,
          scriptBytes: performance
            .getEntriesByType("resource")
            .filter((r) => /\.js(?:\?|$)/.test(r.name))
            .reduce((total, r) => total + r.transferSize, 0),
        }))),
      });
    }
  }
  await mkdir(".impeccable/implementation", { recursive: true });
  await writeFile(
    `.impeccable/implementation/performance-${label}.json`,
    JSON.stringify(
      {
        environment:
          "Local Next.js development server; headless Chrome; warm routes; reduced motion; 1440x900. Reload timing includes browser automation and is not a Core Web Vitals benchmark.",
        measurements,
      },
      null,
      2,
    ),
  );
  console.log(JSON.stringify({ label, measurements }));
} finally {
  await browser.close();
}
