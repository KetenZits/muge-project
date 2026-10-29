import { chromium as playwrightChromium } from "playwright-core";

/** Shared launch configuration; keep each test's browser profile isolated. */
export const chromium = {
  launch(options = {}) {
    const { executablePath: legacyPath, args = [], ...rest } = options;
    const executablePath =
      process.env.CHROME_PATH ??
      (process.platform === "win32"
        ? (legacyPath ??
          "C:/Program Files/Google/Chrome/Application/chrome.exe")
        : "/usr/bin/chromium");
    return playwrightChromium.launch({
      ...rest,
      executablePath,
      args: [
        ...(process.platform === "linux" ? ["--no-sandbox"] : []),
        ...args,
      ],
    });
  },
};
