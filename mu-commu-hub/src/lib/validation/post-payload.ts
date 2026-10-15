import { z } from "zod";
import { postCategories } from "./create-post";
import { MAX_POST_IMAGES } from "./post-images";

// The mock HTTP contract stays serializable and accepts older posts without imageIds.
export const postPayloadSchema = z.object({
  id: z.string().min(1),
  authorId: z.string().min(1),
  category: z.enum(postCategories),
  title: z.string().max(120),
  content: z.string().max(2000),
  tags: z.array(z.string()),
  createdAt: z.iso.datetime(),
  likes: z.number().nonnegative(),
  comments: z.number().nonnegative(),
  image: z.string().optional(),
  imageIds: z.array(z.string().min(1)).max(MAX_POST_IMAGES).optional(),
  recruitmentId: z.string().optional(),
  eventDate: z.string().optional(),
  eventTime: z.string().optional(),
  eventLocation: z.string().optional(),
  eventHost: z.string().optional(),
});

export const teamPayloadSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  leaderId: z.string().min(1),
  competitionId: z.string().optional(),
  description: z.string(),
  roles: z.array(z.object({ name: z.string(), filled: z.boolean() })),
  skills: z.array(z.string()),
  members: z.number(),
  memberIds: z.array(z.string()).optional(),
  capacity: z.number(),
  deadline: z.string(),
  mode: z.enum(["Online", "On-site", "Hybrid"]),
  location: z.string(),
  faculty: z.string().optional(),
  contactMethod: z.string().optional(),
  createdAt: z.string(),
});
