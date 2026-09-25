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
await page
  .getByText("Looking for teammates to build a campus app")
  .first()
  .click();
await page
  .getByRole("textbox", { name: "Comment" })
  .fill("I can help with the interface and test it with students.");
await page
  .locator("form")
  .filter({ has: page.getByRole("textbox", { name: "Comment" }) })
  .locator('button[type="submit"]')
  .click();
await page
  .getByText("I can help with the interface and test it with students.")
  .waitFor();
await page.reload();
await page
  .getByText("I can help with the interface and test it with students.")
  .waitFor();
console.log("comment persists");
await page.goto("http://localhost:3000/home");
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
await dialog
  .locator('input[name="deadline"]')
  .fill(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
await dialog.getByRole("button", { name: "Publish post" }).click();
await page.goto("http://localhost:3000/teams");
await page.getByText("Campus map makers").first().waitFor();
console.log("recruitment appears in Team Finder");
await page
  .locator("article")
  .filter({ hasText: "Campus map makers" })
  .getByRole("button", { name: "Save team" })
  .click();
await page.goto("http://localhost:3000/saved");
await page.getByRole("button", { name: "Teams", exact: true }).click();
await page.getByText("Campus map makers").first().waitFor();
console.log("team bookmark persists");
await page.goto("http://localhost:3000/teams/t1");
await page.getByRole("button", { name: "Request to join" }).click();
await page.reload();
await page.getByRole("button", { name: "Request sent" }).waitFor();
console.log("team request persists");
await page.goto("http://localhost:3000/people");
await page.getByPlaceholder("Name, skill, or interest").fill("Pimchanok");
const person = page
  .locator("article")
  .filter({ hasText: "Pimchanok Srisuwan" });
await person.getByRole("button", { name: "Follow", exact: true }).click();
await page.reload();
await page.getByPlaceholder("Name, skill, or interest").fill("Pimchanok");
await person.getByRole("button", { name: "Following" }).waitFor();
console.log("follow persists");
await person.getByRole("button", { name: "Message" }).click();
await page
  .getByRole("textbox", { name: "Message", exact: true })
  .fill("Would you like to collaborate on a campus project this week?");
await page.getByRole("button", { name: "Send message" }).click();
await page.reload();
await page
  .getByText("Would you like to collaborate on a campus project this week?")
  .first()
  .waitFor();
console.log("message persists");
await page.goto("http://localhost:3000/home");
await page.getByRole("button", { name: "Create post" }).first().click();
await dialog.locator('select[name="category"]').selectOption("Event");
await dialog.locator('input[name="title"]').fill("Open source campus night");
await dialog
  .locator('textarea[name="content"]')
  .fill(
    "Join students from across campus to share small open source projects and find collaborators.",
  );
await dialog
  .locator('input[name="eventDate"]')
  .fill(new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10));
await dialog.locator('input[name="eventTime"]').fill("17:00");
await dialog.locator('input[name="eventLocation"]').fill("Innovation Hub");
await dialog.getByRole("button", { name: "Publish post" }).click();
await page.getByText("Open source campus night").first().waitFor();
await page.reload();
await page.getByText("Open source campus night").first().waitFor();
console.log("event announcement persists");
await page.goto("http://localhost:3000/events");
await page.getByText("Open source campus night").first().waitFor();
console.log("event appears on Events board");
await page.goto("http://localhost:3000/home");
await page.getByRole("button", { name: "Create post" }).first().click();
await dialog.locator('select[name="category"]').selectOption("Team");
await dialog.locator('input[name="title"]').fill("Draft campus research group");
await dialog.locator('input[name="roles"]').fill("Research Lead, Designer");
await dialog.locator('input[name="teamSize"]').fill("2 of 5");
await dialog.getByRole("button", { name: "Save draft" }).click();
await page.getByRole("button", { name: "Create post" }).first().click();
if (
  (await dialog.locator('input[name="title"]').inputValue()) !==
    "Draft campus research group" ||
  (await dialog.locator('input[name="roles"]').inputValue()) !==
    "Research Lead, Designer" ||
  (await dialog.locator('input[name="teamSize"]').inputValue()) !== "2 of 5"
) {
  errors.push("Recruitment draft did not restore its fields");
}
console.log("recruitment draft persists");
await page.goto("http://localhost:3000/profile/thanapon.dev");
await page.locator("[data-mock-ready=true]").waitFor();
await page.getByRole("button", { name: "Edit profile" }).click();
await page
  .getByRole("dialog")
  .locator('textarea[name="bio"]')
  .fill("Building useful campus tools with students from different faculties.");
await page.getByRole("button", { name: "Save changes" }).click();
await page.reload();
await page
  .getByText(
    "Building useful campus tools with students from different faculties.",
  )
  .first()
  .waitFor();
console.log("profile edit persists");
console.log("browser errors", errors);
await browser.close();
if (errors.length) process.exitCode = 1;
