import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", error => errors.push(error.message));
page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
for (const route of ["/", "/home", "/discover", "/people", "/teams", "/competitions", "/events", "/communities", "/saved", "/notifications", "/messages", "/me"]) {
  await page.goto("http://localhost:3000" + route);
  if (route !== "/") await page.locator("[data-mock-ready=true]").waitFor({ timeout: 20000 });
  const heading = await page.locator("h1").first().textContent({ timeout: 5000 }).catch(() => null);
  console.log(route, heading ?? "(no h1)");
  if (!heading) console.log((await page.locator("body").innerText()).slice(0, 700));
  if (route === "/home") await page.screenshot({ path: process.env.TEMP + "/mu-connect-desktop.png", fullPage: true });
}
for (const width of [375, 430, 768, 1024, 1440]) {
  await page.setViewportSize({ width, height: 812 });
  await page.goto("http://localhost:3000/home");
  await page.locator("[data-mock-ready=true]").waitFor({ timeout: 20000 });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  console.log(width + "px horizontal overflow", overflow);
  if (overflow) errors.push("Horizontal overflow at " + width + "px");
  if (width === 375) await page.screenshot({ path: process.env.TEMP + "/mu-connect-mobile.png", fullPage: true });
}
console.log("browser errors", errors);
await browser.close();
if (errors.length) process.exitCode = 1;
