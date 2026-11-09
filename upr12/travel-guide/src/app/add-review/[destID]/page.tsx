"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Send, Star } from "lucide-react";
export default function AddReview() {
  const { destID } = useParams<{ destID: string }>();
  const router = useRouter();
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (author.trim().length < 2 || text.trim().length < 10) {
      setError("Името трябва да е поне 2 символа, а ревюто — поне 10.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinationId: Number(destID),
          author,
          text,
          rating,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(
          Object.values(data.errors || {}).join(" ") ||
            data.error ||
            "Неуспешно запазване.",
        );
        return;
      }
      router.push(`/destinations/${destID}`);
      router.refresh();
    } catch {
      setError("Проблем при свързване със сървъра.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container form-page">
      <Link href={`/destinations/${destID}`} className="back-link">
        <ArrowLeft size={17} /> Назад към мястото
      </Link>
      <div className="form-card">
        <div className="eyebrow">СПОДЕЛИ ВПЕЧАТЛЕНИЯТА СИ</div>
        <h1>Разкажи своята история</h1>
        <p>Твоят опит може да вдъхнови следващото пътешествие.</p>
        <form onSubmit={submit} className="stacked-form">
          <label>
            Твоето име
            <input
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Как се казваш?"
            />
          </label>
          <div className="field-label">Твоята оценка</div>
          <div
            className="rating-picker"
            role="group"
            aria-label="Оценка от 1 до 5"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} звезди`}
                aria-pressed={rating === n}
              >
                <Star size={32} fill={n <= rating ? "currentColor" : "none"} />
              </button>
            ))}
            <span>{rating}/5</span>
          </div>
          <label>
            Твоето ревю
            <textarea
              required
              minLength={10}
              maxLength={1000}
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Какво най-много ти хареса? Какво би препоръчал?"
            />
          </label>
          {error && (
            <div role="alert" className="form-error">
              {error}
            </div>
          )}
          <button
            disabled={busy}
            className="button button-primary submit-button"
            type="submit"
          >
            <Send size={18} />
            {busy ? "Изпращане..." : "Публикувай ревюто"}
          </button>
        </form>
      </div>
    </div>
  );
}
