import type { Event } from "@/types";

const eventNames = [
  "Build Night: From Idea to Prototype",
  "Figma for Beginners",
  "Founders Coffee Chat",
  "AI Research Showcase",
  "Campus Photography Walk",
  "Women in Tech Meetup",
  "Robotics Open Lab",
  "Career Stories: Product Design",
  "Data Science Study Jam",
  "Startup Pitch Practice",
  "Cybersecurity Workshop",
  "Film Club Screening",
  "Community Game Night",
  "Sustainability Forum",
  "Open Source Saturday",
];

export const events: Event[] = eventNames.map((title, i) => ({
  id: `e${i + 1}`,
  title,
  category: ["Workshop", "Meetup", "Career", "Hackathon", "Club Activity"][
    i % 5
  ],
  description:
    "Meet students from across campus, learn something new, and leave with a few new connections.",
  date: new Date(Date.now() + (i + 2) * 86400000).toISOString(),
  time: ["10:00–12:00", "13:00–16:00", "17:00–19:00"][i % 3],
  location: ["Innovation Hub", "ICT Building", "University Library"][i % 3],
  host: ["MU Innovation Hub", "Student Tech Club", "Campus Community"][i % 3],
  attendees: 18 + i * 7,
}));
