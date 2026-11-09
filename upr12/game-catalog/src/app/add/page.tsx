"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Plus, UploadCloud } from "lucide-react";
const genres = [
  "Екшън",
  "Приключенска",
  "RPG",
  "Стратегия",
  "Състезателна",
  "Пъзел",
  "Симулация",
  "Спортна",
  "Друг",
];
export default function Add() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    id: "",
    title: "",
    genre: "Екшън",
    year: new Date().getFullYear(),
    description: "",
    imageUrl: "/images/neon-drift.svg",
    rating: 8,
    developer: "",
  });
  const update = (key: keyof typeof form, value: string | number) =>
    setForm((prev) => ({ ...prev, [key]: value }));
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (
      form.title.trim().length < 2 ||
      form.description.trim().length < 15 ||
      form.developer.trim().length < 2
    ) {
      setError(
        "Попълни валидно заглавие, студио и описание (поне 15 символа).",
      );
      return;
    }
    if (form.rating < 1 || form.rating > 10 || form.year < 1958) {
      setError("Рейтингът трябва да е 1–10, а годината — 1958 или по-късно.");
      return;
    }
    setBusy(true);
    try {
      let imageUrl = form.imageUrl;
      if (file) {
        if (file.size > 3 * 1024 * 1024)
          throw new Error("Изображението трябва да е до 3 MB.");
        const fd = new FormData();
        fd.set("file", file);
        const upload = await fetch("/api/uploads", {
          method: "POST",
          body: fd,
        });
        const uploaded = await upload.json();
        if (!upload.ok)
          throw new Error(
            uploaded.error || "Грешка при качване на изображението.",
          );
        imageUrl = uploaded.imageUrl;
      }
      const payload = {
        ...form,
        imageUrl,
        ...(form.id.trim() ? { id: Number(form.id) } : {}),
      };
      if (!form.id.trim()) delete (payload as { id?: string | number }).id;
      const response = await fetch("/api/games", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          Object.values(result.errors || {}).join(" ") ||
            result.error ||
            "Неуспешно запазване.",
        );
      router.push(`/games/${result.id}`);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Невъзможно запазване.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container add-page">
      <Link className="back" href="/">
        <ArrowLeft size={17} /> Назад към каталога
      </Link>
      <div className="add-card">
        <div className="section-kicker">РАЗШИРИ БИБЛИОТЕКАТА</div>
        <h1>
          Добави нова игра<span>.</span>
        </h1>
        <p>Въведи информация за играта, която искаш да представиш.</p>
        <form onSubmit={submit} className="game-form">
          <div className="form-grid">
            <label>
              Заглавие на играта
              <input
                required
                minLength={2}
                maxLength={120}
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="Напр. Neon Drift"
              />
            </label>
            <label>
              ID (незадължително)
              <input
                type="number"
                min={1}
                placeholder="Автоматично, ако е празно"
                value={form.id}
                onChange={(e) => update("id", e.target.value)}
              />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Жанр
              <select
                value={form.genre}
                onChange={(e) => update("genre", e.target.value)}
              >
                {genres.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </label>
            <label>
              Година на издаване
              <input
                type="number"
                required
                min={1958}
                max={new Date().getFullYear() + 2}
                value={form.year}
                onChange={(e) => update("year", Number(e.target.value))}
              />
            </label>
          </div>
          <div className="form-grid">
            <label>
              Разработчик / студио
              <input
                required
                minLength={2}
                value={form.developer}
                onChange={(e) => update("developer", e.target.value)}
                placeholder="Име на студиото"
              />
            </label>
            <label>
              Оценка (1–10)
              <div className="rating-field">
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={0.1}
                  value={form.rating}
                  onChange={(e) => update("rating", Number(e.target.value))}
                />
                <strong>{form.rating.toFixed(1)}</strong>
              </div>
            </label>
          </div>
          <label>
            Описание
            <textarea
              rows={5}
              minLength={15}
              maxLength={1500}
              required
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Какво прави играта интересна?"
            />
          </label>
          <label>
            Път към изображението (ако не се качва файл)
            <input
              value={form.imageUrl}
              onChange={(e) => update("imageUrl", e.target.value)}
              placeholder="/images/example.svg"
            />
          </label>
          <label className="upload-zone">
            <UploadCloud size={30} />
            <strong>Качи обложка на играта</strong>
            <span>JPG / PNG / WEBP / GIF, до 3 MB</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file && <small>Файл: {file.name}</small>}
          </label>
          {error && (
            <div className="form-error" role="alert">
              {error}
            </div>
          )}
          <button
            className="button primary submit"
            type="submit"
            disabled={busy}
          >
            <Plus size={18} />
            {busy ? "Запазване..." : "Добави играта"}
          </button>
        </form>
      </div>
    </div>
  );
}
