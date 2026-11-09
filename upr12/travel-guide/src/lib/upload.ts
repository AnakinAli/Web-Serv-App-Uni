import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const allowed: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
export async function saveImage(
  formData: FormData,
): Promise<{ imageUrl: string } | { error: string }> {
  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Изберете файл." };
  const ext = allowed[file.type];
  if (!ext) return { error: "Разрешени са JPEG, PNG, WEBP и GIF." };
  if (file.size === 0 || file.size > 3 * 1024 * 1024)
    return { error: "Файлът трябва да е между 1 байт и 3 MB." };
  const name = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()), {
    flag: "wx",
  });
  return { imageUrl: `/uploads/${name}` };
}
