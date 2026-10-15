import type { PreparedPostImage } from "@/types";
import {
  detectImageType,
  IMAGE_MIME_TYPES,
  MAX_IMAGE_BYTES,
  postImagesSchema,
} from "@/lib/validation/post-images";

async function decodeImage(
  blob: Blob,
): Promise<{
  width: number;
  height: number;
  source: CanvasImageSource;
  close: () => void;
}> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(blob);
    return {
      width: bitmap.width,
      height: bitmap.height,
      source: bitmap,
      close: () => bitmap.close(),
    };
  }
  const url = URL.createObjectURL(blob);
  const image = new Image();
  try {
    image.src = url;
    await image.decode();
    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      source: image,
      close: () => URL.revokeObjectURL(url),
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
}

export async function preparePostImage(file: File): Promise<PreparedPostImage> {
  if (file.size > MAX_IMAGE_BYTES)
    throw new Error(
      `${file.name}: each original photo must be 8 MB or smaller.`,
    );
  if (!file.size) throw new Error(`${file.name}: this file is empty.`);
  if (!(IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) {
    throw new Error(`${file.name}: choose a JPEG, PNG, or WebP image.`);
  }
  const mimeType = await detectImageType(file);
  if (!mimeType || mimeType !== file.type)
    throw new Error(
      `${file.name}: the contents do not match a supported image format.`,
    );
  let decoded: Awaited<ReturnType<typeof decodeImage>>;
  try {
    decoded = await decodeImage(file);
  } catch {
    throw new Error(
      `${file.name}: this image is damaged or cannot be decoded.`,
    );
  }
  try {
    if (
      !decoded.width ||
      !decoded.height ||
      decoded.width > 32768 ||
      decoded.height > 32768 ||
      decoded.width * decoded.height > 40_000_000
    ) {
      throw new Error(
        `${file.name}: this image is too large to process. Choose a photo under 40 megapixels.`,
      );
    }
    let blob: Blob = file;
    let width = decoded.width;
    let height = decoded.height;
    // Decode asynchronously and process one photo at a time; small images stay byte-for-byte intact.
    if (Math.max(width, height) > 2560 || file.size > 2 * 1024 * 1024) {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
      const ratio = Math.min(1, 2560 / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(decoded.source, 0, 0, canvas.width, canvas.height);
        const optimized = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/webp", 0.86),
        );
        if (optimized?.type === "image/webp" && optimized.size < file.size) {
          blob = optimized;
          width = canvas.width;
          height = canvas.height;
        }
        canvas.width = canvas.height = 0;
      }
    }
    return {
      id: `photo-${crypto.randomUUID()}`,
      blob,
      mimeType: blob === file ? mimeType : "image/webp",
      fileName: file.name.slice(0, 255),
      fileSize: blob.size,
      width,
      height,
      createdAt: new Date().toISOString(),
    };
  } finally {
    decoded.close();
  }
}

/** Run before opening an IndexedDB transaction: Blob reads must not let it auto-commit. */
export async function validatePreparedImages(images: PreparedPostImage[]) {
  postImagesSchema.parse(images);
  for (const image of images) {
    if (
      image.blob.size !== image.fileSize ||
      image.blob.type !== image.mimeType ||
      (await detectImageType(image.blob)) !== image.mimeType
    ) {
      throw new Error(
        `${image.fileName}: the photo data is invalid. Remove it and select it again.`,
      );
    }
  }
}
