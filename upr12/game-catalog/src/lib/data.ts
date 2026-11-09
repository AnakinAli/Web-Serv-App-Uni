import type { Game } from "./types";
const BASE = process.env.JSON_SERVER_URL ?? "http://localhost:3003";
export async function dbFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store", ...init });
  if (!res.ok) throw new Error(`json-server returned ${res.status}`);
  return (await res.json()) as T;
}
export const getGames = () => dbFetch<Game[]>("/games");
export const getGame = async (id: number): Promise<Game | null> => {
  try {
    return await dbFetch<Game>(`/games/${id}`);
  } catch {
    return null;
  }
};
export function sortGames(games: Game[], sort: string) {
  if (sort === "rating_asc")
    return [...games].sort((a, b) => a.rating - b.rating);
  if (sort === "year_desc") return [...games].sort((a, b) => b.year - a.year);
  if (sort === "year_asc") return [...games].sort((a, b) => a.year - b.year);
  return [...games].sort((a, b) => b.rating - a.rating);
}
