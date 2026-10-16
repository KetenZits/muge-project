import { chromium } from "playwright-core";
import ts from "typescript";
import { readFile, writeFile, mkdir } from "node:fs/promises";

const label = process.argv[2] ?? "after";
const source = await readFile("src/lib/discovery.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const { filterTeams } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
let data;
try {
  const page = await browser.newPage();
  await page.goto("http://localhost:3000/teams");
  await page.locator("article").first().waitFor();
  data = await page.evaluate(async () =>
    Promise.all(
      ["users", "teams", "competitions"].map(async (name) =>
        (await fetch(`/api/${name}`)).json(),
      ),
    ),
  );
} finally {
  await browser.close();
}
const [users, teams, competitions] = data;
const filters = {
  query: "",
  competitionId: "",
  role: "",
  skill: "",
  faculty: "",
  deadline: "Any deadline",
  mode: "",
  sort: "Recommended",
};
const now = new Date("2026-10-15T00:00:00Z");
const measurements = [];
for (const multiplier of [1, 100]) {
  const sample = Array.from({ length: multiplier }, (_, n) =>
    teams.map((t) => ({ ...t, id: `${t.id}-${n}` })),
  ).flat();
  const iterations = multiplier === 1 ? 1500 : 30;
  const timings = [];
  for (let run = 0; run < 7; run++) {
    const started = performance.now();
    for (let index = 0; index < iterations; index++)
      filterTeams(sample, users, competitions, users[0], filters, now);
    timings.push((performance.now() - started) / iterations);
  }
  timings.sort((a, b) => a - b);
  measurements.push({
    teams: sample.length,
    medianMsPerFilter: Number(timings[3].toFixed(4)),
    resultCount: filterTeams(
      sample,
      users,
      competitions,
      users[0],
      filters,
      now,
    ).length,
  });
}
await mkdir(".impeccable/implementation", { recursive: true });
await writeFile(
  `.impeccable/implementation/discovery-${label}.json`,
  JSON.stringify(
    {
      environment:
        "Node performance.now; current local seed data; seven rounds; median per filter-and-sort call. The 100x case is synthetic, not browser interaction latency.",
      measurements,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify({ label, measurements }));
