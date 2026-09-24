export interface Competition {
  id: string;
  title: string;
  organizer: string;
  description: string;
  categories: string[];
  deadline: string;
  date: string;
  location: string;
  prize: string;
  teamSize: string;
  skills: string[];
  status: "Open" | "Closing Soon" | "Upcoming" | "Closed";
  featured?: boolean;
}
