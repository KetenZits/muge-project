import { chromium } from "playwright-core";
import fs from "fs";
import path from "path";

const routes = [
  { id: "landing", route: "/", name: "Landing Page" },
  { id: "login", route: "/login", name: "Demo Login" },
  { id: "onboarding", route: "/onboarding", name: "Onboarding" },
  { id: "home", route: "/home", name: "Home Feed" },
  { id: "post_detail", route: "/posts/p1", name: "Post Detail" },
  { id: "discover", route: "/discover", name: "Discover" },
  { id: "people", route: "/people", name: "People Directory" },
  { id: "profile", route: "/profile/thanapon.dev", fallback: "/profile/tester", name: "Student Profile" },
  { id: "teams", route: "/teams", name: "Teams Board" },
  { id: "team_detail", route: "/teams/t1", name: "Team Detail" },
  { id: "competitions", route: "/competitions", name: "Competitions" },
  { id: "competition_detail", route: "/competitions/c1", name: "Competition Detail" },
  { id: "events", route: "/events", name: "Campus Events" },
  { id: "communities", route: "/communities", name: "Communities" },
  { id: "community_detail", route: "/communities/ai-collective", name: "Community Detail" },
  { id: "saved", route: "/saved", name: "Saved Bookmarks" },
  { id: "notifications", route: "/notifications", name: "Notifications" },
  { id: "messages", route: "/messages", name: "Messages" },
  { id: "me", route: "/me", name: "My Dashboard" },
];

async function capture() {
  const screenshotDir = path.resolve("public", "doc-screenshots");
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  const browser = await chromium.launch({
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 780 },
    deviceScaleFactor: 1.5, // Crisp high-DPI screenshots
  });

  const page = await context.newPage();

  console.log("Starting screenshot capture...");
  for (const item of routes) {
    console.log(`Navigating to ${item.route}...`);
    try {
      await page.goto("http://localhost:3000" + item.route, { waitUntil: "networkidle" });
      if (item.route !== "/") {
        await page.locator("[data-mock-ready=true]").waitFor({ timeout: 15000 }).catch(() => {});
      }
      // Wait a moment for any CSS animations or renders
      await page.waitForTimeout(600);

      const filePath = path.join(screenshotDir, `${item.id}.jpg`);
      // Capture viewport or clipped screenshot in JPEG format for efficient PDF embedding
      await page.screenshot({
        path: filePath,
        type: "jpeg",
        quality: 85,
      });
      console.log(`  ✓ Saved ${item.id}.jpg`);
    } catch (err) {
      console.warn(`  ✕ Error capturing ${item.route}: ${err.message}`);
    }
  }

  await browser.close();
  console.log("All screenshots captured in:", screenshotDir);
}

capture().catch(console.error);
