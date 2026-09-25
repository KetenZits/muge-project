import { faker } from "@faker-js/faker";
import type { User } from "@/types";

faker.seed(231104);

export const interests = [
  "Artificial Intelligence",
  "Web Development",
  "Hackathons",
  "Startup",
  "Design",
  "Robotics",
  "Cybersecurity",
  "Data Science",
  "Game Development",
  "Photography",
  "Research",
  "Sports",
  "Music",
  "Business",
  "Mobile Development",
  "Engineering",
  "Gaming",
  "Marketing",
  "Film",
  "IoT",
];

export const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Python",
  "Figma",
  "Machine Learning",
  "Java",
  "C++",
  "UI Design",
  "Public Speaking",
  "Data Analysis",
  "Node.js",
  "Blender",
  "Video Editing",
  "Marketing",
  "Business Strategy",
  "Flutter",
  "Arduino",
];

const faculties = [
  "Information Technology",
  "Engineering",
  "Science",
  "Business Administration",
  "Communication Arts",
  "Architecture",
  "Medicine",
  "Social Sciences",
];

const majors = [
  "Computer Science",
  "Software Engineering",
  "Digital Media",
  "Data Science",
  "Electrical Engineering",
  "Marketing",
  "Product Design",
  "Biomedical Science",
];

const thaiNames = [
  "Thanapon Chaiyasit",
  "Pimchanok Srisuwan",
  "Nattapong Wongsa",
  "Sirinya Kanjana",
  "Kritsada Boonmee",
  "Pattarawadee Saengchai",
  "Anan Rattanakul",
  "Nicha Preecha",
  "Tawan Phromdee",
  "Kanya Theerakul",
  "Punnawat Jirawat",
  "Sasithorn Narin",
];

export const colors = [
  "#DDE9FA",
  "#F7EAD3",
  "#E5E9FA",
  "#DFF2EB",
  "#FBE3DC",
  "#E8E1F5",
];

export const demoUser: User = {
  id: "u0",
  username: "thanapon.dev",
  name: "Thanapon Chaiyasit",
  initials: "TC",
  faculty: "Information Technology",
  major: "Software Engineering",
  year: 1,
  bio: "Building useful things with code. Always up for a hackathon, a new idea, or a good cup of coffee.",
  skills: ["Next.js", "TypeScript", "React", "Python", "UI Design"],
  interests: [
    "Artificial Intelligence",
    "Web Development",
    "Startup",
    "Hackathons",
    "Design",
  ],
  availability: ["Hackathons", "Projects", "Startups"],
  avatarColor: "#DDE9FA",
  followersCount: 12,
  followingCount: 0,
  achievements: ["MU Innovation Hackathon 2025 finalist"],
  role: "student",
};

export const users: User[] = [
  demoUser,
  ...Array.from({ length: 39 }, (_, i) => {
    const name =
      i < thaiNames.length - 1 ? thaiNames[i + 1] : faker.person.fullName();
    return {
      id: `u${i + 1}`,
      username: `${name
        .toLowerCase()
        .replace(/[^a-z\s]/g, "")
        .trim()
        .replace(/\s+/g, ".")}.${i + 1}`,
      name,
      initials: name
        .split(" ")
        .map((x) => x[0])
        .slice(0, 2)
        .join(""),
      faculty: faculties[i % faculties.length],
      major: majors[i % majors.length],
      year: 1 + (i % 4),
      bio: [
        "Curious maker who loves turning ideas into real projects.",
        "Looking for thoughtful teammates and the next big challenge.",
        "Learning every day, sharing what I build along the way.",
        "Interested in cross-disciplinary projects and campus life.",
      ][i % 4],
      skills: faker.helpers.arrayElements(skills, { min: 3, max: 6 }),
      interests: faker.helpers.arrayElements(interests, { min: 3, max: 6 }),
      availability: faker.helpers.arrayElements(
        ["Hackathons", "Projects", "Research", "Study groups", "Startups"],
        { min: 1, max: 3 },
      ),
      avatarColor: colors[i % colors.length],
      followersCount: 18 + ((i * 17) % 124),
      followingCount: 9 + ((i * 11) % 62),
      achievements:
        i % 6 === 0 ? ["Faculty Innovation Showcase participant"] : [],
    };
  }),
];
