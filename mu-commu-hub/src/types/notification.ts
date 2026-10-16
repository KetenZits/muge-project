export interface Notification {
  id: string;
  category: "Mentions" | "Teams" | "Follows" | "Competitions" | "System";
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  userId?: string;
  /** Optional destination backed by an existing item in the local demo. */
  href?: string;
}
