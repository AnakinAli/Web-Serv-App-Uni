import { dbFetch } from "@/lib/data";
import type { Review, Destination } from "@/lib/types";
import { validateReview } from "@/lib/validation";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const idText = new URL(req.url).searchParams.get("destinationId");
  const id = idText ? Number(idText) : null;
  if (idText && (!Number.isInteger(id) || (id ?? 0) < 1))
    return Response.json(
      { error: "Невалиден destinationId." },
      { status: 400 },
    );
  try {
    return Response.json(
      await dbFetch<Review[]>(`/reviews${id ? `?destinationId=${id}` : ""}`),
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
  const result = validateReview(body);
  if (!result.ok)
    return Response.json({ errors: result.errors }, { status: 400 });
  try {
    await dbFetch<Destination>(`/destinations/${result.data.destinationId}`);
    const created = await dbFetch<Review>("/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });
    return Response.json(created, { status: 201 });
  } catch {
    return Response.json(
      { error: "Дестинацията не съществува или базата е недостъпна." },
      { status: 404 },
    );
  }
}
