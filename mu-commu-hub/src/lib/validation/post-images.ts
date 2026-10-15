import { z } from "zod";

export const MAX_POST_IMAGES = 5;
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const imageMetadataSchema = z.object({
  id: z.string().min(1).max(160),
  mimeType: z.enum(IMAGE_MIME_TYPES),
  fileName: z.string().min(1).max(255),
  fileSize: z.number().int().positive().max(MAX_IMAGE_BYTES),
  width: z.number().int().positive().max(32768),
  height: z.number().int().positive().max(32768),
  createdAt: z.iso.datetime(),
});

export const preparedImageSchema = imageMetadataSchema.extend({
  blob: z.custom<Blob>(
    (value) => typeof Blob !== "undefined" && value instanceof Blob,
    "The photo data is missing. Please select it again.",
  ),
});

export const postImagesSchema = z
  .array(preparedImageSchema)
  .max(MAX_POST_IMAGES, "You can attach up to 5 photos per post.")
  .refine(
    (images) => new Set(images.map((image) => image.id)).size === images.length,
    "Each photo must have a unique attachment ID.",
  );

/** Check signatures as well as MIME. An extension alone never makes a valid photo. */
export async function detectImageType(blob: Blob) {
  const bytes = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)
    return "image/jpeg";
  if (
    [137, 80, 78, 71, 13, 10, 26, 10].every(
      (byte, index) => bytes[index] === byte,
    )
  )
    return "image/png";
  const ascii = (start: number, end: number) =>
    String.fromCharCode(...bytes.slice(start, end));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  return null;
}
