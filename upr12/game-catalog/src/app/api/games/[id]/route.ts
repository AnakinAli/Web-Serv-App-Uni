import { getGame } from "@/lib/data";
export const dynamic = "force-dynamic";
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const num = Number(id);
  if (!Number.isInteger(num) || num < 1)
    return Response.json({ error: "Невалидно ID." }, { status: 400 });
  const game = await getGame(num);
  return game
    ? Response.json(game)
    : Response.json({ error: "Играта не е намерена." }, { status: 404 });
}
