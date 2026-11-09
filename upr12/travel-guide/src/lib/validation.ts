import type { DestinationInput, ReviewInput } from "./types";
type Valid<T> =
  { ok: true; data: T } | { ok: false; errors: Record<string, string> };
const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
const validImage = (value: string) =>
  /^\/(images|uploads)\/[a-zA-Z0-9._/-]+$/.test(value) && !value.includes("..");

export function validateReview(value: unknown): Valid<ReviewInput> {
  const obj = (value && typeof value === "object" ? value : {}) as Record<
    string,
    unknown
  >;
  const destinationId = Number(obj.destinationId);
  const author = str(obj.author);
  const text = str(obj.text);
  const rating = Number(obj.rating);
  const errors: Record<string, string> = {};
  if (!Number.isInteger(destinationId) || destinationId < 1)
    errors.destinationId = "Изберете валидна дестинация.";
  if (author.length < 2 || author.length > 80)
    errors.author = "Името трябва да е от 2 до 80 символа.";
  if (text.length < 10 || text.length > 1000)
    errors.text = "Ревюто трябва да е от 10 до 1000 символа.";
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    errors.rating = "Оценката трябва да е от 1 до 5.";
  return Object.keys(errors).length
    ? { ok: false, errors }
    : { ok: true, data: { destinationId, author, text, rating } };
}

export function validateDestination(value: unknown): Valid<DestinationInput> {
  const obj = (value && typeof value === "object" ? value : {}) as Record<
    string,
    unknown
  >;
  const name = str(obj.name),
    city = str(obj.city),
    country = str(obj.country);
  const type = str(obj.type),
    description = str(obj.description),
    imageUrl = str(obj.imageUrl);
  const rating = Number(obj.rating),
    estimatedBudget = Number(obj.estimatedBudget);
  const gallery = Array.isArray(obj.gallery)
    ? obj.gallery.filter(
        (x): x is string => typeof x === "string" && validImage(x),
      )
    : [];
  const errors: Record<string, string> = {};
  if (name.length < 3 || name.length > 90)
    errors.name = "Името трябва да е от 3 до 90 символа.";
  if (city.length < 2 || city.length > 70)
    errors.city = "Въведете валиден град.";
  if (country.length < 2 || country.length > 70)
    errors.country = "Въведете валидна държава.";
  if (type.length < 3 || type.length > 50) errors.type = "Въведете категория.";
  if (description.length < 20 || description.length > 1500)
    errors.description = "Описанието трябва да е от 20 до 1500 символа.";
  if (!validImage(imageUrl))
    errors.imageUrl = "Използвайте път /images/... или /uploads/...";
  if (!Number.isFinite(rating) || rating < 0 || rating > 5)
    errors.rating = "Рейтингът е от 0 до 5.";
  if (!Number.isFinite(estimatedBudget) || estimatedBudget < 0)
    errors.estimatedBudget = "Бюджетът не може да е отрицателен.";
  return Object.keys(errors).length
    ? { ok: false, errors }
    : {
        ok: true,
        data: {
          name,
          city,
          country,
          type,
          description,
          imageUrl,
          gallery: gallery.length ? gallery : [imageUrl],
          rating,
          estimatedBudget,
        },
      };
}
