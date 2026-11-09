import { saveImage } from "@/lib/upload";
export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const result = await saveImage(await req.formData());
    if ("error" in result) return Response.json(result, { status: 400 });
    return Response.json(result, { status: 201 });
  } catch {
    return Response.json(
      { error: "Качването не беше успешно." },
      { status: 500 },
    );
  }
}
