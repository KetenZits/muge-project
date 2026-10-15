import { db } from "./index";
import {
  draftImageOwner,
  imageRepository,
  postImageOwner,
} from "./image-repository";
import { validatePreparedImages } from "@/lib/images/prepare-image";
import type { Post, PreparedPostImage, TeamRecruitment } from "@/types";

export interface CreatePostOptions {
  images?: PreparedPostImage[];
  draftId?: string;
  team?: TeamRecruitment;
}

export const postRepository = {
  async create(
    post: Post,
    { images = [], draftId, team }: CreatePostOptions = {},
  ) {
    await validatePreparedImages(images);
    const imageIds = post.imageIds ?? [];
    if (
      imageIds.length !== images.length ||
      imageIds.some((id, index) => id !== images[index].id)
    ) {
      throw new Error(
        "The post's photo references do not match its attachments.",
      );
    }
    if (
      team &&
      (post.recruitmentId !== team.id || post.authorId !== team.leaderId)
    ) {
      throw new Error("The recruitment details do not match this post.");
    }
    return db.transaction(
      "rw",
      [db.posts, db.postImages, db.drafts, db.teams],
      async () => {
        // A retry after a lost response must never create a second post or recruitment.
        const existing = await db.posts.get(post.id);
        if (existing) return existing;
        const owner = postImageOwner(post.id);
        await imageRepository.assertOwnership(images, [
          owner,
          ...(draftId ? [draftImageOwner(draftId)] : []),
        ]);
        if (draftId) {
          await imageRepository.removeOwner(draftImageOwner(draftId));
          await db.drafts.delete(draftId);
        }
        await imageRepository.replace(owner, images);
        if (team) await db.teams.add(team);
        await db.posts.add(post);
        return post;
      },
    );
  },
};
