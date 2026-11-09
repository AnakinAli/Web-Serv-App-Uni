"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, PlusCircle, UploadCloud } from "lucide-react";
export default function AddDestination() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    city: "",
    country: "",
    type: "Природа",
    description: "",
    imageUrl: "/images/santorini.svg",
    rating: 4.5,
    estimatedBudget: 150,
  });
  const update = (key: keyof typeof form, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      let imageUrl = form.imageUrl;
      if (file) {
        if (file.size > 3 * 1024 * 1024)
          throw new Error("Максимален размер на изображението: 3 MB.");
        const fd = new FormData();
        fd.set("file", file);
        const upload = await fetch("/api/uploads", {
          method: "POST",
          body: fd,
        });
        const result = await upload.json();
        if (!upload.ok) throw new Error(result.error || "Неуспешно качване.");
        imageUrl = result.imageUrl;
      }
      const response = await fetch("/api/destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, imageUrl, gallery: [imageUrl] }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          Object.values(data.errors || {}).join(" ") ||
            data.error ||
            "Неуспешно запазване.",
        );
      router.push(`/destinations/${data.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Възникна грешка.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container form-page">
      <Link className="back-link" href="/destinations">
        <ArrowLeft size={17} /> Към дестинациите
      </Link>
      <div className="form-card wide-form">
        <div className="eyebrow">ДОПЪЛНИ ПЪТЕВОДИТЕЛЯ</div>
        <h1>Добави нова дестинация</h1>
        <p>Сподели място, което заслужава да бъде открито.</p>
        <form className="stacked-form" onSubmit={submit}>
          <div className="form-row">
            <label>
              Име
              <input
                required
                minLength={3}
                maxLength={90}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Име на мястото"
              />
            </label>
            <label>
              Град
              <input
                required
                minLength={2}
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Държава
              <input
                required
                minLength={2}
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
              />
            </label>
            <label>
              Категория
              <select
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
              >
                {[
                  "Природа",
                  "Забележителност",
                  "История",
                  "Култура",
                  "Архитектура",
                  "Град",
                ].map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Описание
            <textarea
              required
              minLength={20}
              rows={5}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Разкажи защо си заслужава да се посети..."
            />
          </label>
          <div className="form-row">
            <label>
              Рейтинг (0–5)
              <input
                type="number"
                required
                min={0}
                max={5}
                step={0.1}
                value={form.rating}
                onChange={(e) => update("rating", Number(e.target.value))}
              />
            </label>
            <label>
              Примерен бюджет (€)
              <input
                type="number"
                required
                min={0}
                value={form.estimatedBudget}
                onChange={(e) =>
                  update("estimatedBudget", Number(e.target.value))
                }
              />
            </label>
          </div>
          <label>
            Път към изображение (ако не качваш файл)
            <input
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="/images/example.svg"
            />
          </label>
          <label className="upload-area">
            <UploadCloud size={26} />
            <strong>Избери изображение от компютъра</strong>
            <span>JPG, PNG, WEBP или GIF, до 3 MB (по желание)</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && <small>Избран файл: {file.name}</small>}
          </label>
          {error && (
            <div role="alert" className="form-error">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={busy}
            className="button button-primary submit-button"
          >
            <PlusCircle size={17} />
            {busy ? "Запазване..." : "Добави дестинацията"}
          </button>
        </form>
      </div>
    </div>
  );
}
