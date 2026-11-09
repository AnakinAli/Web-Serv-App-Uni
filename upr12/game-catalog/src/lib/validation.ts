import type { GameInput } from "./types";
type Result =
  { ok: true; data: GameInput } | { ok: false; errors: Record<string, string> };
const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
export function validateGame(body: unknown): Result {
  const v = (body && typeof body === "object" ? body : {}) as Record<
    string,
    unknown
  >;
  const title = str(v.title),
    genre = str(v.genre),
    description = str(v.description),
    imageUrl = str(v.imageUrl),
    developer = str(v.developer);
  const year = Number(v.year),
    rating = Number(v.rating);
  const errors: Record<string, string> = {};
  if (
    v.id !== undefined &&
    v.id !== "" &&
    (!Number.isInteger(Number(v.id)) || Number(v.id) < 1)
  )
    errors.id = "ID трябва да е положително цяло число.";
  if (title.length < 2 || title.length > 120)
    errors.title = "Заглавието трябва да е 2–120 символа.";
  if (genre.length < 2 || genre.length > 60)
    errors.genre = "Жанрът трябва да е 2–60 символа.";
  if (
    !Number.isInteger(year) ||
    year < 1958 ||
    year > new Date().getFullYear() + 2
  )
    errors.year = "Въведете валидна година.";
  if (description.length < 15 || description.length > 1500)
    errors.description = "Описанието трябва да е 15–1500 символа.";
  if (
    !/^\/(images|uploads)\/[a-zA-Z0-9._/-]+$/.test(imageUrl) ||
    imageUrl.includes("..")
  )
    errors.imageUrl = "Изображението трябва да е в /images/ или /uploads/.";
  if (!Number.isFinite(rating) || rating < 1 || rating > 10)
    errors.rating = "Оценката трябва да е от 1 до 10.";
  if (developer.length < 2 || developer.length > 100)
    errors.developer = "Името на студиото трябва да е 2–100 символа.";
  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      ...(v.id !== undefined && v.id !== "" ? { id: Number(v.id) } : {}),
      title,
      genre,
      year,
      description,
      imageUrl,
      rating,
      developer,
    },
  };
}
