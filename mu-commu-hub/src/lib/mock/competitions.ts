import { faker } from "@faker-js/faker";
import type { Competition } from "@/types";
import { skills } from "./users";

faker.seed(231105);

const competitionSeed = [
  "Campus AI Challenge 2026",
  "MU Innovation Hackathon",
  "Thailand Startup League",
  "Cybersecurity CTF Weekend",
  "Sustainable Campus Design Sprint",
  "National Data Science Cup",
  "Robotics Open Challenge",
  "Student Social Impact Awards",
  "Code for Community",
  "Digital Product Jam",
  "Future Founders Pitch",
  "Creative Media Festival",
];

export const competitions: Competition[] = competitionSeed.map((title, i) => ({
  id: `c${i + 1}`,
  title,
  organizer: [
    "MU Innovation Hub",
    "Faculty of ICT",
    "Student Innovation Network",
    "National Student Council",
  ][i % 4],
  description: [
    "Turn a bold idea into a working solution with students from every faculty. Meet mentors, build a team, and present your work.",
    "A hands-on challenge for curious students ready to solve real-world problems together.",
  ][i % 2],
  categories: faker.helpers.arrayElements(
    ["Technology", "Innovation", "Design", "Business", "Social Impact"],
    { min: 1, max: 2 },
  ),
  deadline: new Date(Date.now() + (i + 2) * 86400000).toISOString(),
  date: new Date(Date.now() + (i + 12) * 86400000).toISOString(),
  location: i % 3 === 0 ? "Online" : "Innovation Hub, Main Campus",
  prize: ["฿50,000", "฿30,000", "Mentorship + grants", "฿15,000"][i % 4],
  teamSize: ["2–5 people", "3–4 people", "Individual or team"][i % 3],
  skills: faker.helpers.arrayElements(skills, { min: 2, max: 4 }),
  requirements: [
    "Register before the deadline.",
    i % 3 === 2
      ? "Apply individually or with a student team."
      : "Form a team within the stated size limit.",
    "Prepare a short presentation of your idea or prototype.",
  ],
  eligibility:
    "Open to currently enrolled university students from any faculty.",
  status: i < 6 ? "Open" : i < 9 ? "Closing Soon" : "Upcoming",
  featured: i === 0,
}));
