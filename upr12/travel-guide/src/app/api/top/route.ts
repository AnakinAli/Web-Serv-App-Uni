import { dbFetch, sortDestinations } from "@/lib/data";
import type { Destination } from "@/lib/types";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return Response.json(
      sortDestinations(
        (await dbFetch<Destination[]>("/destinations")).filter(
          (d) => d.rating >= 4.5,
        ),
      ),
    );
  } catch {
    return Response.json(
      { error: "Базата данни не е достъпна." },
      { status: 502 },
    );
  }
}
