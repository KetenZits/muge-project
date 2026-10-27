export interface WelcomeTalent {
  id: string;
  category: string;
  name: string;
  role: string;
  description: string;
  skills: string[];
  image: string;
  imageAlt: string;
  accent: string;
  project: string;
}

export interface WelcomeCollageImage {
  id: string;
  label: string;
  image: string;
  scatterX: number;
  scatterY: number;
  scatterRotation: number;
  baseRotation: number;
  floatDuration: number;
  mobile: boolean;
  tablet: boolean;
}

// Fictional example profiles for the frontend prototype.
export const welcomeTalents: WelcomeTalent[] = [
  {
    id: "programming",
    category: "Programming",
    name: "Narin",
    role: "Full-Stack Developer",
    description: "Turns ambitious ideas into things people can actually use. Always up for a thoughtful build session.",
    skills: ["React", "TypeScript", "Python"],
    image: "/images/welcome/photo-programming.webp",
    imageAlt: "Stock photograph of a person coding on a laptop; this does not depict Narin",
    accent: "#b8d5f2",
    project: "Building a campus collaboration tool",
  },
  {
    id: "design",
    category: "Design",
    name: "Pim",
    role: "Product Designer",
    description: "Makes complex ideas feel simple, human, and a little more delightful.",
    skills: ["UI/UX", "Figma", "Illustration"],
    image: "/images/welcome/photo-design.webp",
    imageAlt: "Stock photograph of a person working on a CAD design; this does not depict Pim",
    accent: "#eed8be",
    project: "Exploring better everyday campus experiences",
  },
  {
    id: "marketing",
    category: "Marketing",
    name: "Maya",
    role: "Digital Marketer",
    description: "Finds the message that brings people together and gives good projects their audience.",
    skills: ["Strategy", "Content", "Research"],
    image: "/images/welcome/photo-marketing.webp",
    imageAlt: "Stock photograph of a team meeting; this does not depict Maya",
    accent: "#d6e4ce",
    project: "Connecting ideas with the right community",
  },
  {
    id: "pitching",
    category: "Pitching",
    name: "Than",
    role: "Startup Pitch Specialist",
    description: "Brings clarity and energy to a room, from the first sketch to the final pitch.",
    skills: ["Public speaking", "Startup", "Teamwork"],
    image: "/images/welcome/photo-pitching.webp",
    imageAlt: "Stock photograph of a team presenting at a whiteboard; this does not depict Than",
    accent: "#e9d4c6",
    project: "Practicing for the next big presentation",
  },
  {
    id: "ai-data",
    category: "AI & Data",
    name: "Nicha",
    role: "AI / Data Enthusiast",
    description: "Finds useful patterns in messy questions and turns research into thoughtful tools.",
    skills: ["Python", "Machine learning", "Data storytelling"],
    image: "/images/welcome/photo-ai-data.webp",
    imageAlt: "Stock photograph of researchers using computers in a lab; this does not depict Nicha",
    accent: "#c6dbed",
    project: "Exploring data to improve campus mobility",
  },
  {
    id: "robotics",
    category: "Robotics",
    name: "Dao",
    role: "Robotics Developer",
    description: "Loves the moment when code, sensors, and a prototype finally move together.",
    skills: ["Embedded systems", "CAD", "Sensors"],
    image: "/images/welcome/photo-robotics.webp",
    imageAlt: "Stock photograph of hands working on a drone and laptop; this does not depict Dao",
    accent: "#cadceb",
    project: "Testing a small autonomous robot prototype",
  },
];

export const welcomeCollage: WelcomeCollageImage[] = [
  { id: "01", label: "Programming", image: "/images/welcome/photo-programming.webp", scatterX: -250, scatterY: -130, scatterRotation: -10, baseRotation: -7, floatDuration: 11.5, mobile: true, tablet: true },
  { id: "02", label: "Robotics", image: "/images/welcome/photo-robotics.webp", scatterX: -210, scatterY: 80, scatterRotation: 11, baseRotation: 5, floatDuration: 13.8, mobile: false, tablet: false },
  { id: "03", label: "Design", image: "/images/welcome/photo-design.webp", scatterX: -190, scatterY: 190, scatterRotation: -9, baseRotation: -6, floatDuration: 12.6, mobile: false, tablet: true },
  { id: "06", label: "Pitching", image: "/images/welcome/photo-pitching.webp", scatterX: 240, scatterY: -125, scatterRotation: 10, baseRotation: 6, floatDuration: 10.8, mobile: true, tablet: true },
  { id: "07", label: "Marketing", image: "/images/welcome/photo-marketing.webp", scatterX: 235, scatterY: 80, scatterRotation: -8, baseRotation: -5, floatDuration: 15.4, mobile: false, tablet: true },
  { id: "08", label: "AI & Data", image: "/images/welcome/photo-ai-data.webp", scatterX: 195, scatterY: 185, scatterRotation: 9, baseRotation: 5, floatDuration: 12.1, mobile: true, tablet: true },
];

export const welcomeBenefits = [
  {
    number: "01",
    title: "Find your team",
    description: "Meet people whose skills and interests complement your own.",
    color: "#17468c",
    items: [
      { title: "Meet collaborators", description: "Discover students across faculties who want to build together." },
      { title: "Find a role", description: "Explore teams recruiting for projects and competitions." },
    ],
    href: "/teams",
    action: "Explore teams",
  },
  {
    number: "02",
    title: "Show what you can do",
    description: "Let your skills, projects, and curiosity speak for you.",
    color: "#b38c3b",
    items: [
      { title: "Your profile", description: "Make your interests and strengths easy to discover." },
      { title: "Your work", description: "Share projects and ideas with your campus community." },
    ],
    href: "/me",
    action: "View your space",
  },
  {
    number: "03",
    title: "Build together",
    description: "Turn a conversation into a project worth sharing.",
    color: "#5386a3",
    items: [
      { title: "Start a conversation", description: "Ask a question or bring a new idea to the feed." },
      { title: "Keep moving", description: "Find collaborators for every stage of a project." },
    ],
    href: "/home",
    action: "See the community",
  },
  {
    number: "04",
    title: "Explore what's next",
    description: "Find competitions and communities that match your energy.",
    color: "#54745f",
    items: [
      { title: "Opportunities", description: "Discover competitions, events, and campus activities." },
      { title: "Your people", description: "Find communities organized around shared interests." },
    ],
    href: "/discover",
    action: "Start discovering",
  },
] as const;
