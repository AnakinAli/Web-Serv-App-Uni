import type { Destination, Review } from "./types";

const BASE_URL = process.env.JSON_SERVER_URL ?? "http://localhost:3002";

export async function dbFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    cache: "no-store",
    ...init,
  });
  if (!response.ok) throw new Error(`json-server returned ${response.status}`);
  return (await response.json()) as T;
}

export const getDestinations = () => dbFetch<Destination[]>("/destinations");
export const getDestination = async (
  id: number,
): Promise<Destination | null> => {
  try {
    return await dbFetch<Destination>(`/destinations/${id}`);
  } catch {
    return null;
  }
};
export const getReviews = (destinationId?: number) =>
  dbFetch<Review[]>(
    `/reviews${destinationId ? `?destinationId=${destinationId}` : ""}`,
  );

export const sortDestinations = (destinations: Destination[]) =>
  [...destinations].sort((a, b) => b.rating - a.rating);
