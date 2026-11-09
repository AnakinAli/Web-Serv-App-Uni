import { saveImage } from "@/lib/upload";
export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const result = await saveImage(await req.formData());
    return "error" in result
      ? Response.json(result, { status: 400 })
      : Response.json(result, { status: 201 });
  } catch {
    return Response.json({ error: "Неуспешно качване." }, { status: 500 });
  }
}
