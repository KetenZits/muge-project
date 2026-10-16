import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

// Run the actual store and migration code with deterministic I/O. This follows
// the existing discovery tests' TypeScript transpilation without adding a runner.
const moduleUrl = (source, imports = {}) => {
  let code = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  for (const [specifier, url] of Object.entries(imports))
    code = code.replaceAll(JSON.stringify(specifier), JSON.stringify(url));
  return `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
};
const usersSource = ts.createSourceFile(
  "users.ts",
  await readFile("src/lib/mock/users.ts", "utf8"),
  ts.ScriptTarget.Latest,
);
const seed = usersSource.statements
  .flatMap((statement) =>
    ts.isVariableStatement(statement)
      ? Array.from(statement.declarationList.declarations)
      : [],
  )
  .find((declaration) => declaration.name.getText(usersSource) === "demoUser");
assert.ok(seed?.initializer, "Read the actual neutral demo seed");
const seedUrl = moduleUrl(
  `export const demoUser = ${seed.initializer.getText(usersSource)};`,
);
const { demoUser } = await import(seedUrl);
const profileUrl = moduleUrl(
  `${await readFile("src/lib/demo-profile.ts", "utf8")}\nexport { legacySeed };`,
  { "@/lib/mock/users": seedUrl },
);
const { restoreDemoProfile, legacySeed } = await import(profileUrl);
const records = new Map();
let storageBlocked = false;
let writesBlocked = false;
let writes = 0;
globalThis.localStorage = {
  getItem: (key) => {
    if (storageBlocked)
      throw new DOMException("Storage denied", "SecurityError");
    return records.get(key) ?? null;
  },
  setItem: (key, value) => {
    if (storageBlocked || writesBlocked)
      throw new DOMException("Storage denied", "SecurityError");
    writes++;
    records.set(key, value);
  },
};
const io = (globalThis.__authTestIO = {
  worker: async () => {},
  database: async () => {},
  request: async (name) => (name === "getUsers" ? [demoUser] : []),
});
const apiUrl = moduleUrl(`
  const call = (name) => (signal) => globalThis.__authTestIO.request(name, signal);
  export const userService = { getUsers: call("getUsers") };
  export const postService = { getPosts: call("getPosts") };
  export const teamService = { getTeams: call("getTeams") };
  export const competitionService = { getCompetitions: call("getCompetitions") };
  export const eventService = { getEvents: call("getEvents") };
  export const communityService = { getCommunities: call("getCommunities") };
  export const notificationService = { getNotifications: call("getNotifications") };
  export const messageService = { getConversations: call("getConversations"), getMessages: call("getMessages") };
  export const interactionService = { getBookmarks: call("getBookmarks"), getInteractions: call("getInteractions"), getFollows: call("getFollows") };
`);
const storeUrl = moduleUrl(await readFile("src/stores/app.ts", "utf8"), {
  zustand: import.meta.resolve("zustand"),
  "@/lib/mock/data": seedUrl,
  "@/lib/demo-profile": profileUrl,
  "@/lib/api/client": apiUrl,
  "@/lib/events": moduleUrl("export const eventFromPost = () => null;"),
  "@/lib/demo-startup": moduleUrl(
    "export const startMockApi = () => globalThis.__authTestIO.worker();",
  ),
  "@/lib/db": moduleUrl(
    "export const openDemoDatabase = () => globalThis.__authTestIO.database();",
  ),
});
const { useApp } = await import(storeUrl);
const reset = () => useApp.setState(useApp.getInitialState(), true);
const check = (name) => console.log("PASS", name);

assert.deepEqual(
  [
    demoUser.name,
    demoUser.username,
    demoUser.email,
    demoUser.displayRole,
    demoUser.faculty,
    demoUser.year,
  ],
  [
    "Tester",
    "tester",
    "user@gmail.com",
    "Demo Student",
    "Information Technology",
    1,
  ],
);
useApp.getState().initializeSession();
assert.equal(useApp.getState().sessionStatus, "ready");
assert.equal(useApp.getState().user.username, "tester");
assert.equal(writes, 0);
check(
  "Fresh/no saved session restores Tester without writing storage or waiting for API/IndexedDB",
);

records.set("mu-connect-user", "invalid saved JSON");
reset();
useApp.getState().initializeSession();
assert.equal(useApp.getState().sessionStatus, "ready");
assert.equal(records.get("mu-connect-user"), "invalid saved JSON");
check("Invalid saved JSON reaches ready without deleting the original value");

const customized = {
  ...legacySeed,
  name: "My campus name",
  bio: "Keep my own biography",
  skills: ["Figma"],
  email: "my.profile@example.com",
};
const original = JSON.stringify(customized);
records.set("mu-connect-user", original);
storageBlocked = true;
reset();
useApp.getState().initializeSession();
assert.equal(useApp.getState().sessionStatus, "error");
assert.match(useApp.getState().sessionError, /Allow browser storage/);
assert.equal(records.get("mu-connect-user"), original);
storageBlocked = false;
useApp.getState().initializeSession();
assert.equal(useApp.getState().sessionStatus, "ready");
assert.equal(useApp.getState().user.bio, customized.bio);
assert.equal(records.get("mu-connect-user"), original);
check(
  "Storage failure exits initializing and retry restores the untouched customized profile",
);

const migrated = restoreDemoProfile(JSON.stringify(legacySeed));
assert.equal(migrated.migrated, true);
assert.equal(migrated.user.id, legacySeed.id);
assert.equal(migrated.user.username, "tester");
assert.equal(restoreDemoProfile(original).migrated, false);
const emailOnly = JSON.stringify({
  ...legacySeed,
  email: "my.email@example.com",
});
assert.equal(restoreDemoProfile(emailOnly).migrated, false);
records.set("mu-connect-user", emailOnly);
reset();
useApp.getState().initializeSession();
assert.equal(records.get("mu-connect-user"), emailOnly);
assert.equal(useApp.getState().user.email, "my.email@example.com");
check(
  "An email-only customization prevents default identity migration and remains byte-for-byte intact",
);
records.set("mu-connect-user", JSON.stringify(legacySeed));
records.set("mu-connect-onboarded", "true");
const beforeMigration = records.get("mu-connect-user");
reset();
writesBlocked = true;
useApp.getState().initializeSession();
assert.equal(useApp.getState().sessionStatus, "error");
assert.equal(records.get("mu-connect-user"), beforeMigration);
writesBlocked = false;
useApp.getState().initializeSession();
assert.equal(useApp.getState().sessionStatus, "ready");
assert.equal(JSON.parse(records.get("mu-connect-user")).username, "tester");
check(
  "A migration write failure is recoverable and leaves the original profile untouched",
);
records.set("mu-connect-user", JSON.stringify(legacySeed));
reset();
const beforeWrites = writes;
useApp.getState().initializeSession();
useApp.getState().initializeSession(); // React Strict Mode replay
assert.equal(writes, beforeWrites + 1);
assert.equal(JSON.parse(records.get("mu-connect-user")).username, "tester");
assert.equal(records.get("mu-connect-onboarded"), "true");
check(
  "Legacy migration runs once across effect replays, retains stable ID and onboarding completion",
);

let release;
let workerStarts = 0;
let databaseOpens = 0;
io.worker = () => {
  workerStarts++;
  return new Promise((resolve) => {
    release = resolve;
  });
};
io.database = async () => {
  databaseOpens++;
};
const pending = useApp.getState().load();
assert.equal(useApp.getState().load(), pending);
assert.equal(workerStarts, 1);
const newer = {
  ...useApp.getState().user,
  name: "My updated name",
  bio: "Changed during startup",
  role: "admin",
};
useApp.getState().setUser(newer);
useApp.getState().initializeSession();
assert.equal(useApp.getState().user.bio, newer.bio);
release();
await pending;
assert.equal(databaseOpens, 1);
assert.equal(useApp.getState().ready, true);
assert.equal(useApp.getState().error, null);
assert.deepEqual(useApp.getState().user, newer);
assert.deepEqual(
  useApp.getState().users.find((user) => user.id === newer.id),
  newer,
);
check(
  "Concurrent initialization shares one attempt and never overwrites newer profile/role changes",
);

io.worker = async () => {
  throw new Error("Worker registration rejected");
};
await useApp.getState().load();
assert.equal(useApp.getState().ready, true);
assert.match(useApp.getState().error, /Worker registration rejected/);
assert.equal(useApp.getState().sessionStatus, "ready");
io.worker = async () => {};
await useApp.getState().load();
assert.equal(useApp.getState().error, null);
check(
  "Startup rejection reaches error and a new attempt can recover without resetting the profile",
);

let signal;
io.request = async (name, currentSignal) => {
  signal = currentSignal;
  if (name === "getPosts") throw new Error("Local query failed");
  return name === "getUsers" ? [demoUser] : [];
};
await useApp.getState().load();
assert.equal(useApp.getState().ready, true);
assert.match(useApp.getState().error, /Local query failed/);
assert.equal(signal.aborted, true);
io.request = async (name) => (name === "getUsers" ? [demoUser] : []);
await useApp.getState().load();
assert.equal(useApp.getState().error, null);
assert.deepEqual(useApp.getState().user, newer);
check(
  "Rejected data request aborts sibling requests, settles loading, and remains retryable",
);
delete globalThis.__authTestIO;
delete globalThis.localStorage;
