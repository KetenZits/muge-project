import { faker } from "@faker-js/faker";
import type {
  Club,
  Comment,
  Competition,
  Conversation,
  Event,
  Message,
  Notification,
  Post,
  TeamRecruitment,
  User,
} from "@/types";

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
const colors = [
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
        i % 6 === 0
          ? ["Faculty Innovation Showcase participant"]
          : [],
    };
  }),
];
const postSeeds: Array<[string, string, Post["category"], string[]]> = [
  [
    "Looking for 2 teammates for AI Hackathon",
    "We are building an AI study companion that helps students plan revision. Looking for a frontend developer and a product designer. Beginners welcome if you're excited to learn together!",
    "Team",
    ["Hackathons", "Artificial Intelligence", "React"],
  ],
  [
    "Need a UI/UX designer for startup competition",
    "Our team has a working prototype for a campus food waste platform. We need someone who loves research, flows, and clean interfaces.",
    "Startup",
    ["Design", "Startup", "Figma"],
  ],
  [
    "Anyone interested in building a robotics project?",
    "Thinking about a low-cost campus delivery robot. If you enjoy Arduino, computer vision, or just experimenting, let's connect.",
    "Project",
    ["Robotics", "Engineering", "Python"],
  ],
  [
    "Looking for friends to practice LeetCode together",
    "Planning a friendly weekly problem-solving circle. All levels are welcome. We can meet at the library or online.",
    "Friends",
    ["Web Development", "Python"],
  ],
  [
    "Frontend developer wanted for university startup competition",
    "We have a clear idea and a small design system. Help us bring the student marketplace MVP to life.",
    "Team",
    ["Next.js", "Startup", "React"],
  ],
  [
    "Anyone joining the cybersecurity CTF this weekend?",
    "Looking for a couple of people to form a team. I'm comfortable with web challenges and would love to learn reversing.",
    "Competition",
    ["Cybersecurity", "Hackathons"],
  ],
  [
    "แชร์ workshop Figma ฟรีวันศุกร์นี้",
    "ชวนเพื่อน ๆ ที่สนใจ UX/UI มาลองออกแบบแอปด้วยกันที่ห้อง Innovation Lab ไม่ต้องมีพื้นฐานก็มาได้!",
    "Design",
    ["Design", "Figma"],
  ],
  [
    "What are you building this semester?",
    "Share your side project below. I'd love to see what everyone is making and maybe find people to collaborate with.",
    "General",
    ["Startup", "Web Development"],
  ],
  [
    "Finding a data science research partner",
    "I am exploring air-quality prediction with open datasets. Looking for someone interested in data cleaning and model evaluation.",
    "Research",
    ["Data Science", "Python", "Research"],
  ],
  [
    "Weekend photo walk around campus",
    "ชวนเพื่อนที่ชอบถ่ายรูปมาเดินถ่ายภาพรอบมหาวิทยาลัย เสาร์นี้ตอนเย็น เจอกันที่หอสมุด!",
    "Activity",
    ["Photography"],
  ],
];
export const posts: Post[] = Array.from({ length: 60 }, (_, i) => {
  const seed = postSeeds[i % postSeeds.length];
  return {
    id: `p${i + 1}`,
    authorId: `u${(i * 7 + 1) % 40}`,
    title: seed[0],
    content: seed[1],
    category: seed[2],
    tags: seed[3],
    createdAt: new Date(Date.now() - i * 3900000).toISOString(),
    likes: 8 + ((i * 13) % 144),
    comments: 2 + ((i * 3) % 28),
    recruitmentId: i % 10 < 3 ? `t${(i % 15) + 1}` : undefined,
  };
});
const commentBodies = [
  "This sounds like a great idea. I'd love to hear more!",
  "I am interested — is there still room on the team?",
  "Thanks for sharing this with the community.",
  "I have worked with this stack before. Happy to help!",
  "Count me in! Let's connect after class.",
  "ชอบไอเดียนี้มาก สนใจเข้าร่วมด้วยครับ",
];
export const comments: Comment[] = Array.from({ length: 60 }, (_, i) => ({
  id: `seed-comment-${i + 1}`,
  postId: `p${Math.floor(i / 3) + 1}`,
  userId: `u${((i * 5 + 2) % 39) + 1}`,
  content: commentBodies[i % commentBodies.length],
  createdAt: new Date(Date.now() - (i + 1) * 1800000).toISOString(),
}));
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
  status: i < 6 ? "Open" : i < 9 ? "Closing Soon" : "Upcoming",
  featured: i === 0,
}));
const teamNames = [
  "AI Study Companion",
  "Campus Food Rescue",
  "Robotics Lab Crew",
  "Digital Health Builders",
  "Cyber CTF Squad",
  "Green Mobility Team",
  "Student Marketplace",
  "Open Data Collective",
  "Design for Good",
  "Smart Farming Lab",
  "Game Jam Guild",
  "Future Founders",
  "Climate Tech Team",
  "AR Campus Guide",
  "Wellness App Crew",
];
export const teams: TeamRecruitment[] = teamNames.map((title, i) => ({
  id: `t${i + 1}`,
  title,
  leaderId: `u${i + 1}`,
  competitionId: `c${(i % 12) + 1}`,
  description: [
    "We have a clear direction and are looking for teammates who want to build, learn, and present something meaningful.",
    "A friendly cross-faculty team turning an idea into a real prototype. Come bring your perspective.",
  ][i % 2],
  roles: [
    { name: "Frontend Developer", filled: i % 2 === 0 },
    { name: "Backend Developer", filled: i % 3 === 0 },
    { name: "UI/UX Designer", filled: false },
    { name: "Pitch Lead", filled: i % 4 === 0 },
  ],
  skills: faker.helpers.arrayElements(skills, { min: 2, max: 4 }),
  members: 2 + (i % 3),
  memberIds: Array.from(
    { length: 2 + (i % 3) },
    (_, memberIndex) => `u${((i + memberIndex) % 39) + 1}`,
  ),
  capacity: 5,
  deadline: new Date(Date.now() + (i + 3) * 86400000).toISOString(),
  mode: (["Hybrid", "Online", "On-site"] as const)[i % 3],
  location: i % 3 === 1 ? "Online" : "Main Campus",
  contactMethod: "MU Connect messages",
  objectives: [
    `Build and test an initial ${title.toLowerCase()} prototype.`,
    "Present the team's work at the linked competition.",
  ],
  createdAt: new Date(Date.now() - i * 7200000).toISOString(),
}));
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
export const clubs: Club[] = [
  "AI Collective",
  "Web Builders",
  "Game Dev Society",
  "Startup Circle",
  "Design Studio",
  "Photography Walks",
  "Robotics Lab",
  "Cyber Crew",
  "Data Lab",
].map((name, i) => ({
  id: `club${i + 1}`,
  slug: name.toLowerCase().replace(/\s+/g, "-"),
  name,
  description: [
    "A place to learn, share projects, and meet your next collaborator.",
    "Meet curious students, exchange ideas, and build something together.",
  ][i % 2],
  members: 120 + i * 67,
  activePosts: 12 + i * 5,
  tags: [
    interests[i % interests.length],
    interests[(i + 2) % interests.length],
  ],
  icon: ["✦", "⌘", "◈", "✳", "◐", "◉", "⬡", "◇", "▦"][i],
  color: colors[i % colors.length],
}));
export const notifications: Notification[] = Array.from(
  { length: 30 },
  (_, i) => ({
    id: `n${i + 1}`,
    category: (
      ["Teams", "Follows", "Mentions", "Competitions", "System"] as const
    )[i % 5],
    title: [
      "New team invitation",
      "You have a new follower",
      "You were mentioned",
      "Deadline coming up",
      "Welcome to MU Connect",
    ][i % 5],
    body: [
      "Pimchanok invited you to join AI Study Companion.",
      "Nicha started following your projects.",
      "Someone mentioned you in a discussion.",
      "Campus AI Challenge closes soon.",
      "Make your profile shine and find your people.",
    ][i % 5],
    createdAt: new Date(Date.now() - i * 1900000).toISOString(),
    read: i > 4,
    userId: `u${(i % 39) + 1}`,
  }),
);
export const conversations: Conversation[] = Array.from(
  { length: 10 },
  (_, i) => ({
    id: `cv${i + 1}`,
    participantIds: ["u0", `u${i + 1}`],
    updatedAt: new Date(Date.now() - i * 1800000).toISOString(),
    unread: i < 3 ? 1 : 0,
  }),
);
export const messages: Message[] = conversations.flatMap((c, i) => [
  {
    id: `m${i * 2 + 1}`,
    conversationId: c.id,
    senderId: `u${i + 1}`,
    content: [
      "Hey! I saw your profile and thought you might be interested in our project.",
      "Are you still looking for a teammate for the hackathon?",
      "Loved your post. Would you be up for a quick chat this week?",
    ][i % 3],
    createdAt: new Date(Date.now() - i * 1800000 - 600000).toISOString(),
  },
  {
    id: `m${i * 2 + 2}`,
    conversationId: c.id,
    senderId: "u0",
    content: "That sounds great! Tell me a little more about the idea.",
    createdAt: c.updatedAt,
  },
]);
