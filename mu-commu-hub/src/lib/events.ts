import type { Event, Post } from "@/types";

export function eventFromPost(post: Post): Event | null {
  if (
    post.category !== "Event" ||
    !post.eventDate ||
    !post.eventTime ||
    !post.eventLocation
  ) {
    return null;
  }
  return {
    id: `post-event-${post.id}`,
    postId: post.id,
    title: post.title,
    category: "Campus Activity",
    description: post.content,
    date: post.eventDate,
    time: post.eventTime,
    location: post.eventLocation,
    host: post.eventHost ?? "Campus community",
    attendees: 0,
  };
}
