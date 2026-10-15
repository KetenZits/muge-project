import { db } from "./index";
import { imageMetadataSchema } from "@/lib/validation/post-images";
import type { PreparedPostImage, StoredPostImage } from "@/types";

export const postImageOwner = (id: string) => `post:${id}`;
export const draftImageOwner = (id: string) => `draft:${id}`;

export const imageRepository = {
  async resolve(
    ids: string[],
    ownerId: string,
  ): Promise<(StoredPostImage | undefined)[]> {
    const records = await db.postImages.bulkGet(ids);
    return records.map((record) =>
      record &&
      record.ownerId === ownerId &&
      record.blob instanceof Blob &&
      record.blob.size === record.fileSize &&
      record.blob.type === record.mimeType &&
      imageMetadataSchema.safeParse(record).success
        ? record
        : undefined,
    );
  },
  // These mutation helpers run inside the caller's transaction.
  async assertOwnership(images: PreparedPostImage[], allowedOwners: string[]) {
    const existing = await db.postImages.bulkGet(
      images.map((image) => image.id),
    );
    if (
      existing.some((image) => image && !allowedOwners.includes(image.ownerId))
    ) {
      throw new Error(
        "A photo belongs to another post. Select the file again.",
      );
    }
  },
  replace(ownerId: string, images: PreparedPostImage[]) {
    return db.postImages.bulkPut(
      images.map((image, position) => ({ ...image, ownerId, position })),
    );
  },
  removeOwner: (ownerId: string) =>
    db.postImages.where("ownerId").equals(ownerId).delete(),
};
