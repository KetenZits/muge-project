export type PostCategory = "General" | "Friends" | "Team" | "Competition" | "Project" | "Study" | "Research" | "Startup" | "Technology" | "Design" | "Gaming" | "Sports" | "Activity" | "Question";
export type WorkMode = "Online" | "On-site" | "Hybrid";
export type Role = "student" | "organizer" | "admin";
export interface User { id: string; username: string; name: string; initials: string; faculty: string; major: string; year: number; bio: string; skills: string[]; interests: string[]; availability: string[]; avatarColor: string; role?: Role; }
export interface Profile extends User { achievements: string[]; projects: string[]; }
export interface Interest { id: string; name: string; }
export interface Skill { id: string; name: string; }
export interface Comment { id: string; postId: string; userId: string; content: string; createdAt: string; }
export interface Post { id: string; authorId: string; category: PostCategory; title: string; content: string; tags: string[]; createdAt: string; likes: number; comments: number; image?: string; recruitmentId?: string; }
export interface TeamRole { name: string; filled: boolean; }
export interface TeamRecruitment { id: string; title: string; leaderId: string; competitionId?: string; description: string; roles: TeamRole[]; skills: string[]; members: number; capacity: number; deadline: string; mode: WorkMode; location: string; faculty?: string; createdAt: string; }
export interface Competition { id: string; title: string; organizer: string; description: string; categories: string[]; deadline: string; date: string; location: string; prize: string; teamSize: string; skills: string[]; status: "Open" | "Closing Soon" | "Upcoming" | "Closed"; featured?: boolean; }
export interface Event { id: string; title: string; category: string; description: string; date: string; time: string; location: string; host: string; attendees: number; }
export interface Club { id: string; slug: string; name: string; description: string; members: number; activePosts: number; tags: string[]; icon: string; color: string; }
export interface Notification { id: string; category: "Mentions" | "Teams" | "Follows" | "Competitions" | "System"; title: string; body: string; createdAt: string; read: boolean; userId?: string; }
export interface Message { id: string; conversationId: string; senderId: string; content: string; createdAt: string; }
export interface Conversation { id: string; participantIds: string[]; updatedAt: string; unread: number; }
export interface Bookmark { id: string; kind: "posts" | "teams" | "competitions" | "events"; itemId: string; }
export interface Follow { id: string; userId: string; targetId: string; }
export interface Draft { id: string; type: string; title: string; content: string; tags: string[]; updatedAt: string; }
