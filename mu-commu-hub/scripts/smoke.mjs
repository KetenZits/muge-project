import { chromium } from "playwright-core";

const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (error) => errors.push(error.message));
page.on("console", (message) => {
  if (message.type() === "error") errors.push(message.text());
});
for (const route of [
  "/",
  "/login",
  "/onboarding",
  "/home",
  "/posts/p1",
  "/discover",
  "/people",
  "/profile/thanapon.dev",
  "/teams",
  "/teams/t1",
  "/competitions",
  "/competitions/c1",
  "/events",
  "/communities",
  "/communities/ai-collective",
  "/saved",
  "/notifications",
  "/messages",
  "/me",
]) {
  await page.goto("http://localhost:3000" + route);
  if (route !== "/")
    await page.locator("[data-mock-ready=true]").waitFor({ timeout: 20000 });
  const heading = await page
    .locator("h1")
    .first()
    .textContent({ timeout: 5000 })
    .catch(() => null);
  console.log(route, heading ?? "(no h1)");
  if (!heading)
    console.log((await page.locator("body").innerText()).slice(0, 700));
  if (route === "/home")
    await page.screenshot({
      path: process.env.TEMP + "/mu-connect-desktop.png",
      fullPage: true,
    });
}
for (const { width, height } of [
  { width: 375, height: 812 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
]) {
  await page.setViewportSize({ width, height });
  for (const route of [
    "/home",
    "/discover",
    "/people",
    "/profile/thanapon.dev",
    "/teams",
    "/teams/t1",
    "/competitions",
    "/competitions/c1",
    "/events",
    "/messages",
    "/saved",
    "/notifications",
    "/me",
  ]) {
    await page.goto("http://localhost:3000" + route);
    await page.locator("[data-mock-ready=true]").waitFor({ timeout: 20000 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    if (overflow) {
      const offenders = await page.evaluate(() =>
        [...document.querySelectorAll("body *")]
          .filter(
            (element) => element.getBoundingClientRect().right > innerWidth + 1,
          )
          .slice(0, 5)
          .map((element) => ({
            tag: element.tagName,
            className: element.className,
            right: Math.round(element.getBoundingClientRect().right),
            text: element.textContent?.trim().slice(0, 70),
          })),
      );
      errors.push(
        `Horizontal overflow at ${width}px on ${route}: ${JSON.stringify(offenders)}`,
      );
    }
    if (route === "/events") {
      await page.getByRole("button", { name: "Calendar", exact: true }).click();
      const calendarOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      if (calendarOverflow) errors.push(`Calendar overflow at ${width}px`);
    }
    if (width === 375 && route === "/home") {
      await page.screenshot({
        path: process.env.TEMP + "/mu-connect-mobile.png",
        fullPage: true,
      });
      await page.getByRole("button", { name: "Create post" }).last().click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      const dialogOverflow = await dialog.evaluate(
        (element) => element.scrollWidth > element.clientWidth,
      );
      if (dialogOverflow) errors.push("Create dialog overflows at 375px");
    }
  }
  console.log(width + "px responsive routes checked");
}
console.log("browser errors", errors);
await browser.close();
if (errors.length) process.exitCode = 1;
