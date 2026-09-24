import { chromium } from "playwright-core";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await page.goto("http://localhost:3000/home");
await page.getByRole("heading", { name: /Your next idea/ }).waitFor();
await page.getByRole("button", { name: "Create post" }).first().click();
const dialog = page.getByRole("dialog");
await dialog
  .locator('input[name="title"]')
  .fill("Looking for teammates to build a campus app");
await dialog
  .locator('textarea[name="content"]')
  .fill(
    "I have a prototype concept for helping students find study spaces on campus and would love to build it with a small team.",
  );
await dialog.locator('input[name="tags"]').fill("React, Design");
await dialog.getByRole("button", { name: "Publish post" }).click();
await page
  .getByText("Looking for teammates to build a campus app")
  .first()
  .waitFor();
await page.reload();
await page
  .getByText("Looking for teammates to build a campus app")
  .first()
  .waitFor();
console.log("post persists after refresh");
await page.getByRole("button", { name: "Create post" }).first().click();
await dialog.locator('select[name="category"]').selectOption("Team");
await dialog.locator('input[name="title"]').fill("Campus map makers");
await dialog
  .locator('textarea[name="content"]')
  .fill(
    "We are creating an accessible interactive map for campus visitors and looking for students who enjoy frontend design and mapping.",
  );
await dialog.locator('input[name="tags"]').fill("React, Figma");
await dialog
  .locator('input[name="roles"]')
  .fill("Frontend Developer, Designer");
await dialog.locator('input[name="teamSize"]').fill("1 of 4");
await dialog.getByRole("button", { name: "Publish post" }).click();
await page.goto("http://localhost:3000/teams");
await page.getByText("Campus map makers").first().waitFor();
console.log("recruitment appears in Team Finder");
await page.getByRole("button", { name: "Save team" }).first().click();
await page.goto("http://localhost:3000/saved");
await page.getByRole("button", { name: "Teams", exact: true }).click();
await page.getByText("Campus map makers").first().waitFor();
console.log("team bookmark persists");
console.log("browser errors", errors);
await browser.close();
if (errors.length) process.exitCode = 1;
