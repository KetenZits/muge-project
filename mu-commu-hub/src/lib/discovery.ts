import type {
  Club,
  Competition,
  Event,
  Post,
  TeamRecruitment,
  User,
  WorkMode,
} from "@/types";

export interface PeopleFilters {
  query: string;
  faculty: string;
  major: string;
  year: string;
  skill: string;
  interest: string;
  availability: string;
  sort: "Best match" | "Name";
}

export interface TeamFilters {
  query: string;
  competitionId: string;
  role: string;
  skill: string;
  faculty: string;
  deadline: "Any deadline" | "7 days" | "30 days";
  mode: "" | WorkMode;
  sort: "Recommended" | "Newest" | "Deadline soon" | "Most active";
}

export interface DiscoverFilters {
  query: string;
  faculty: string;
  major: string;
  year: string;
  skill: string;
  interest: string;
  category: string;
  availability: string;
  mode: "" | WorkMode;
}

export interface DiscoverData {
  users: User[];
  posts: Post[];
  teams: TeamRecruitment[];
  competitions: Competition[];
  events: Event[];
  clubs: Club[];
}

export function sharedItems(first: string[], second: string[]): string[] {
  const values = new Set(first.map((item) => item.toLowerCase()));
  return second.filter((item) => values.has(item.toLowerCase()));
}

export function peopleMatchScore(current: User, person: User): number {
  const score =
    sharedItems(current.interests, person.interests).length * 3 +
    sharedItems(current.skills, person.skills).length * 2 +
    (current.faculty === person.faculty ? 2 : 0) +
    (sharedItems(current.availability, person.availability).length ? 2 : 0);

  return Math.min(98, 52 + score * 3);
}

export function filterPeople(
  users: User[],
  current: User,
  filters: PeopleFilters,
): User[] {
  const query = filters.query.trim().toLowerCase();
  const matched = users.filter(
    (person) =>
      person.id !== current.id &&
      (!query ||
        [
          person.name,
          person.faculty,
          person.major,
          ...person.skills,
          ...person.interests,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)) &&
      (!filters.faculty || person.faculty === filters.faculty) &&
      (!filters.major || person.major === filters.major) &&
      (!filters.year || person.year === Number(filters.year)) &&
      (!filters.skill || person.skills.includes(filters.skill)) &&
      (!filters.interest || person.interests.includes(filters.interest)) &&
      (!filters.availability ||
        person.availability.includes(filters.availability)),
  );
  if (filters.sort === "Name")
    return matched.sort((first, second) =>
      first.name.localeCompare(second.name),
    );
  const scores = new Map(
    matched.map((person) => [person, peopleMatchScore(current, person)]),
  );
  return matched.sort(
    (first, second) => scores.get(second)! - scores.get(first)!,
  );
}

export function teamMatchScore(
  team: TeamRecruitment,
  current: User,
  leader?: User,
  competition?: Competition,
): number {
  return (
    sharedItems(current.skills, team.skills).length * 2 +
    sharedItems(current.interests, competition?.categories ?? []).length * 3 +
    (competition ? 4 : 0) +
    (leader?.faculty === current.faculty ? 2 : 0) +
    (current.availability.length ? 2 : 0)
  );
}

export function filterTeams(
  teams: TeamRecruitment[],
  users: User[],
  competitions: Competition[],
  current: User,
  filters: TeamFilters,
  now = new Date(),
): TeamRecruitment[] {
  const query = filters.query.trim().toLowerCase();
  const deadlineDays =
    filters.deadline === "7 days"
      ? 7
      : filters.deadline === "30 days"
        ? 30
        : null;
  const cutoff = deadlineDays
    ? new Date(now.getTime() + deadlineDays * 86_400_000).getTime()
    : null;
  const usersById = new Map(users.map((person) => [person.id, person]));
  const competitionsById = new Map(
    competitions.map((competition) => [competition.id, competition]),
  );

  const matched = teams.filter((team) => {
    const leader = usersById.get(team.leaderId);
    const competition = competitionsById.get(team.competitionId ?? "");
    return (
      (!query ||
        [
          team.title,
          team.description,
          competition?.title ?? "",
          ...team.skills,
          ...team.roles.map((role) => role.name),
        ]
          .join(" ")
          .toLowerCase()
          .includes(query)) &&
      (!filters.competitionId ||
        team.competitionId === filters.competitionId) &&
      (!filters.role ||
        team.roles.some(
          (role) => !role.filled && role.name === filters.role,
        )) &&
      (!filters.skill || team.skills.includes(filters.skill)) &&
      (!filters.faculty ||
        (team.faculty || leader?.faculty) === filters.faculty) &&
      (!filters.mode || team.mode === filters.mode) &&
      (!cutoff ||
        (new Date(team.deadline).getTime() >= now.getTime() &&
          new Date(team.deadline).getTime() <= cutoff))
    );
  });
  const scores =
    filters.sort === "Recommended"
      ? new Map(
          matched.map((team) => [
            team,
            teamMatchScore(
              team,
              current,
              usersById.get(team.leaderId),
              competitionsById.get(team.competitionId ?? ""),
            ),
          ]),
        )
      : null;
  return matched.sort((first, second) => {
    if (filters.sort === "Newest") {
      return second.createdAt.localeCompare(first.createdAt);
    }
    if (filters.sort === "Deadline soon") {
      return first.deadline.localeCompare(second.deadline);
    }
    if (filters.sort === "Most active") {
      return second.members - first.members;
    }
    return (scores?.get(second) ?? 0) - (scores?.get(first) ?? 0);
  });
}

export function discoverResults(
  data: DiscoverData,
  current: User,
  filters: DiscoverFilters,
) {
  const query = filters.query.trim().toLowerCase();
  const usersById = new Map(data.users.map((person) => [person.id, person]));
  const competitionsById = new Map(
    data.competitions.map((competition) => [competition.id, competition]),
  );
  const people = filterPeople(data.users, current, {
    ...filters,
    sort: "Best match",
  });
  const authorMatches = (authorId: string) => {
    const author = usersById.get(authorId);
    return (
      (!filters.faculty || author?.faculty === filters.faculty) &&
      (!filters.major || author?.major === filters.major) &&
      (!filters.year || author?.year === Number(filters.year)) &&
      (!filters.availability ||
        author?.availability.includes(filters.availability))
    );
  };
  const posts = data.posts.filter(
    (post) =>
      (!query ||
        [post.title, post.content, ...post.tags]
          .join(" ")
          .toLowerCase()
          .includes(query)) &&
      (!filters.category || post.category === filters.category) &&
      (!filters.skill || post.tags.includes(filters.skill)) &&
      (!filters.interest || post.tags.includes(filters.interest)) &&
      authorMatches(post.authorId),
  );
  const teams = filterTeams(
    data.teams,
    data.users,
    data.competitions,
    current,
    {
      query: filters.query,
      competitionId: "",
      role: "",
      skill: filters.skill,
      faculty: filters.faculty,
      deadline: "Any deadline",
      mode: filters.mode,
      sort: "Recommended",
    },
  ).filter(
    (team) =>
      !filters.category &&
      !filters.major &&
      !filters.year &&
      !filters.availability &&
      (!filters.interest ||
        competitionsById
          .get(team.competitionId ?? "")
          ?.categories.includes(filters.interest)),
  );
  const broadResultsAllowed =
    !filters.faculty &&
    !filters.major &&
    !filters.year &&
    !filters.availability &&
    !filters.category &&
    !filters.mode;
  const competitions = broadResultsAllowed
    ? data.competitions.filter(
        (competition) =>
          (!query ||
            [
              competition.title,
              competition.description,
              ...competition.categories,
            ]
              .join(" ")
              .toLowerCase()
              .includes(query)) &&
          (!filters.skill || competition.skills.includes(filters.skill)) &&
          (!filters.interest ||
            competition.categories.includes(filters.interest)),
      )
    : [];
  const events =
    broadResultsAllowed && !filters.skill && !filters.interest
      ? data.events.filter(
          (event) =>
            !query ||
            [event.title, event.category, event.description]
              .join(" ")
              .toLowerCase()
              .includes(query),
        )
      : [];
  const clubs =
    broadResultsAllowed && !filters.skill
      ? data.clubs.filter(
          (club) =>
            (!query ||
              [club.name, club.description, ...club.tags]
                .join(" ")
                .toLowerCase()
                .includes(query)) &&
            (!filters.interest || club.tags.includes(filters.interest)),
        )
      : [];
  return { people, posts, teams, competitions, events, clubs };
}

export function trendingSkills(users: User[], limit = 6): string[] {
  const counts = new Map<string, number>();
  for (const user of users) {
    for (const skill of user.skills) {
      counts.set(skill, (counts.get(skill) ?? 0) + 1);
    }
  }
  return [...counts]
    .sort((first, second) => second[1] - first[1])
    .slice(0, limit)
    .map(([skill]) => skill);
}
