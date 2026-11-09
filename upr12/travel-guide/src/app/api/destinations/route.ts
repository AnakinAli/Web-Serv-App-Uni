import { dbFetch } from "@/lib/data";
import type { Destination } from "@/lib/types";
import { validateDestination } from "@/lib/validation";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json(await dbFetch<Destination[]>("/destinations"));
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
  const result = validateDestination(body);
  if (!result.ok)
    return Response.json({ errors: result.errors }, { status: 400 });
  try {
    const created = await dbFetch<Destination>("/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.data),
    });
    return Response.json(created, { status: 201 });
  } catch {
    return Response.json(
      { error: "Базата данни не е достъпна." },
      { status: 502 },
    );
  }
}
