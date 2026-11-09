import { dbFetch } from "@/lib/data";
import type { Destination } from "@/lib/types";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const q = (new URL(req.url).searchParams.get("q") || "").toLocaleLowerCase(
      "bg",
    );
    const destinations = await dbFetch<Destination[]>("/destinations");
    return Response.json(
      destinations.filter((d) =>
        `${d.name} ${d.city}`.toLocaleLowerCase("bg").includes(q),
      ),
    );
  } catch {
    return Response.json(
      { error: "Базата данни не е достъпна." },
      { status: 502 },
    );
  }
}
