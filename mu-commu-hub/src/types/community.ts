export interface Club {
  id: string;
  slug: string;
  name: string;
  description: string;
  members: number;
  activePosts: number;
  tags: string[];
  icon: string;
  color: string;
}
