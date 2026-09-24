import type { Competition, TeamRecruitment, User, WorkMode } from "@/types";

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
  return users
    .filter(
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
    )
    .sort((first, second) =>
      filters.sort === "Name"
        ? first.name.localeCompare(second.name)
        : peopleMatchScore(current, second) -
          peopleMatchScore(current, first),
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

  return teams
    .filter((team) => {
      const leader = users.find((user) => user.id === team.leaderId);
      const competition = competitions.find(
        (item) => item.id === team.competitionId,
      );
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
    })
    .sort((first, second) => {
      if (filters.sort === "Newest") {
        return second.createdAt.localeCompare(first.createdAt);
      }
      if (filters.sort === "Deadline soon") {
        return first.deadline.localeCompare(second.deadline);
      }
      if (filters.sort === "Most active") {
        return second.members - first.members;
      }
      const firstLeader = users.find((user) => user.id === first.leaderId);
      const secondLeader = users.find((user) => user.id === second.leaderId);
      const firstCompetition = competitions.find(
        (item) => item.id === first.competitionId,
      );
      const secondCompetition = competitions.find(
        (item) => item.id === second.competitionId,
      );
      return (
        teamMatchScore(second, current, secondLeader, secondCompetition) -
        teamMatchScore(first, current, firstLeader, firstCompetition)
      );
    });
}
