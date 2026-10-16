import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = ts.transpileModule(
  await readFile("src/lib/discovery.ts", "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { filterPeople, filterTeams, discoverResults } = await import(
  `data:text/javascript;base64,${Buffer.from(source).toString("base64")}`
);
const me = {
  id: "me",
  name: "Tester",
  faculty: "IT",
  major: "Software",
  year: 1,
  skills: ["React"],
  interests: ["Design"],
  availability: ["Projects"],
};
const people = [
  me,
  { ...me, id: "a", name: "Student A" },
  {
    ...me,
    id: "b",
    name: "Student B",
    faculty: "Science",
    major: "Biology",
    year: 2,
    skills: ["Python"],
    interests: ["Research"],
    availability: ["Research"],
  },
];
const peopleDefaults = {
  query: "",
  faculty: "",
  major: "",
  year: "",
  skill: "",
  interest: "",
  availability: "",
  sort: "Best match",
};
const ids = (rows) => rows.map((row) => row.id);
assert.deepEqual(ids(filterPeople(people, me, peopleDefaults)), ["a", "b"]);
for (const refinement of [
  { faculty: "Science" },
  { major: "Biology" },
  { year: "2" },
  { skill: "Python" },
  { interest: "Research" },
  { availability: "Research" },
  { query: "student b" },
])
  assert.deepEqual(
    ids(filterPeople(people, me, { ...peopleDefaults, ...refinement })),
    ["b"],
  );
assert.deepEqual(
  ids(filterPeople(people, me, { ...peopleDefaults, query: "no match" })),
  [],
);

const now = new Date("2026-10-15T00:00:00Z");
const date = (days) => new Date(now.getTime() + days * 86400000).toISOString();
const competitions = [
  {
    id: "c1",
    title: "Campus Design",
    categories: ["Design"],
    skills: ["React"],
  },
];
const base = {
  description: "A campus project",
  capacity: 5,
  createdAt: date(-2),
  roles: [{ name: "Designer", filled: false }],
  location: "Campus",
};
const teams = [
  {
    ...base,
    id: "b",
    title: "Science team",
    leaderId: "b",
    skills: ["Python"],
    mode: "Online",
    deadline: date(40),
    members: 4,
  },
  {
    ...base,
    id: "a",
    title: "Campus design",
    leaderId: "a",
    competitionId: "c1",
    skills: ["React"],
    mode: "Hybrid",
    deadline: date(3),
    members: 2,
    createdAt: date(-1),
  },
  {
    ...base,
    id: "d",
    title: "Field project",
    leaderId: "a",
    skills: ["React"],
    mode: "On-site",
    deadline: date(6),
    members: 1,
  },
  {
    ...base,
    id: "c",
    title: "Closed project",
    leaderId: "a",
    competitionId: "c1",
    skills: ["React"],
    mode: "Hybrid",
    deadline: date(-1),
    members: 3,
    roles: [{ name: "Designer", filled: true }],
  },
];
const defaults = {
  query: "",
  competitionId: "",
  role: "",
  skill: "",
  faculty: "",
  mode: "",
  deadline: "Any deadline",
  sort: "Recommended",
};
const find = (refinement) =>
  ids(
    filterTeams(
      teams,
      people,
      competitions,
      me,
      { ...defaults, ...refinement },
      now,
    ),
  );
assert.deepEqual(find({ competitionId: "c1" }), ["a", "c"]);
assert.deepEqual(find({ query: "campus design" }), ["a", "c"]);
assert.deepEqual(find({ faculty: "Science" }), ["b"]);
assert.deepEqual(find({ mode: "On-site" }), ["d"]);
assert.deepEqual(find({ skill: "Python" }), ["b"]);
assert.equal(find({ role: "Designer" }).includes("c"), false);
assert.deepEqual(find({ deadline: "7 days" }), ["a", "d"]);
assert.deepEqual(find({ deadline: "30 days" }), ["a", "d"]);
assert.deepEqual(find({ sort: "Newest" })[0], "a");
assert.deepEqual(find({ sort: "Most active" })[0], "b");
assert.deepEqual(find({ sort: "Deadline soon" }), ["c", "a", "d", "b"]);
const untouched = teams.map((team) => team.id);
find({ query: "none" });
assert.deepEqual(
  teams.map((team) => team.id),
  untouched,
  "Filtering must not mutate the stored source order",
);
const result = discoverResults(
  { users: people, posts: [], teams, competitions, events: [], clubs: [] },
  me,
  { ...peopleDefaults, query: "campus design", category: "", mode: "" },
);
assert.equal(result.people.length, 0);
assert.ok(result.teams.length > 0);
console.log(
  "PASS people/team filter capabilities, stable relevance order, deadline boundaries, source immutability, and cross-category results",
);
