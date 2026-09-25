import type { Comment, Post } from "@/types";

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
