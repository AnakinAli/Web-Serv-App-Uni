import { dbFetch, sortGames } from "@/lib/data";
import type { Game } from "@/lib/types";
import { validateGame } from "@/lib/validation";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  const url = new URL(req.url);
  const yearText = url.searchParams.get("year");
  if (yearText && !/^\d{4}$/.test(yearText))
    return Response.json({ error: "Невалидна година." }, { status: 400 });
  try {
    const games = await dbFetch<Game[]>("/games");
    const filtered = games.filter(
      (g) => !yearText || g.year === Number(yearText),
    );
    return Response.json(
      sortGames(filtered, url.searchParams.get("sort") || "rating_desc"),
    );
  } catch {
    return Response.json(
      { error: "Базата данни не е достъпна." },
      { status: 502 },
    );
  }
}
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Невалиден JSON." }, { status: 400 });
  }
  const result = validateGame(body);
  if (!result.ok)
    return Response.json({ errors: result.errors }, { status: 400 });
  try {
    if (result.data.id !== undefined) {
      const games = await dbFetch<Game[]>("/games");
      if (games.some((g) => g.id === result.data.id))
        return Response.json(
          { error: "Игра с това ID вече съществува." },
          { status: 409 },
        );
    }
    const game = await dbFetch<Game>("/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });
    return Response.json(game, { status: 201 });
  } catch {
    return Response.json(
      { error: "Неуспешен запис в базата." },
      { status: 502 },
    );
  }
}
