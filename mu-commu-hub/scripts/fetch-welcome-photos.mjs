import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const photos = JSON.parse(await readFile("src/data/welcome-photo-sources.json", "utf8"));
const selected = process.argv[2] ? photos.filter((photo) => photo.id === process.argv[2]) : photos;
if (selected.length === 0) throw new Error(`Unknown photo: ${process.argv[2]}`);

for (const photo of selected) {
  const url = `${photo.imageUrl}?fit=crop&w=1800&q=88&fm=jpg`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${photo.id}: ${response.status} ${response.statusText}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const output = join("public", photo.file.replace(/^\//, ""));
  const info = await sharp(bytes).rotate().resize({ width: 1400, withoutEnlargement: true }).webp({ quality: 82, effort: 6 }).toFile(output);
  console.log(`${photo.id}: ${info.width}×${info.height}, ${Math.round(info.size / 1024)} KB`);
}
