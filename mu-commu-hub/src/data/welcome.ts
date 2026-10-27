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

// Fictional example profiles for the frontend prototype.
export const welcomeTalents: WelcomeTalent[] = [
  {
    id: "programming",
    category: "Programming",
    name: "Narin",
    role: "Creative developer",
    description: "Turns ambitious ideas into things people can actually use. Always up for a thoughtful build session.",
    skills: ["React", "Python", "Robotics"],
    image: "/images/welcome/programming.png",
    imageAlt: "Illustrative example of a student working on a robotics project",
    accent: "#b8d5f2",
    project: "Building a campus robotics prototype",
  },
  {
    id: "design",
    category: "Design",
    name: "Pim",
    role: "Digital product designer",
    description: "Makes complex ideas feel simple, human, and a little more delightful.",
    skills: ["UI/UX", "Figma", "Illustration"],
    image: "/images/welcome/design.png",
    imageAlt: "Illustrative example of a student designing at a studio desk",
    accent: "#eed8be",
    project: "Exploring better everyday campus experiences",
  },
  {
    id: "marketing",
    category: "Marketing",
    name: "Maya",
    role: "Community storyteller",
    description: "Finds the message that brings people together and gives good projects their audience.",
    skills: ["Strategy", "Content", "Research"],
    image: "/images/welcome/collaboration.png",
    imageAlt: "Illustrative example of students collaborating around a laptop",
    accent: "#d6e4ce",
    project: "Connecting ideas with the right community",
  },
  {
    id: "pitching",
    category: "Pitching",
    name: "Than",
    role: "Ideas & presentation",
    description: "Brings clarity and energy to a room, from the first sketch to the final pitch.",
    skills: ["Public speaking", "Startup", "Teamwork"],
    image: "/images/welcome/pitching.png",
    imageAlt: "Illustrative example of students practicing a project pitch",
    accent: "#e9d4c6",
    project: "Practicing for the next big presentation",
  },
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
