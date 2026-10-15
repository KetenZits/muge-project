import { db } from "./index";
import type { Draft, PreparedPostImage } from "@/types";
import { draftImageOwner, imageRepository } from "./image-repository";
import { validatePreparedImages } from "@/lib/images/prepare-image";

export const draftService = {
  getCurrent: () => db.drafts.get("current"),
  getImages: (draft: Draft) =>
    imageRepository.resolve(draft.imageIds ?? [], draftImageOwner(draft.id)),
  async save(draft: Draft, images: PreparedPostImage[] = []) {
    await validatePreparedImages(images);
    return db.transaction("rw", db.drafts, db.postImages, async () => {
      const owner = draftImageOwner(draft.id);
      await imageRepository.assertOwnership(images, [owner]);
      await imageRepository.removeOwner(owner);
      await imageRepository.replace(owner, images);
      return db.drafts.put({
        ...draft,
        imageIds: images.map((image) => image.id),
      });
    });
  },
  clear: () =>
    db.transaction("rw", db.drafts, db.postImages, async () => {
      await imageRepository.removeOwner(draftImageOwner("current"));
      await db.drafts.delete("current");
    }),
};
