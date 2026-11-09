"use client";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
export const STORAGE_KEY = "travelguide:saved-destinations";
export const FAVORITES_EVENT = "travelguide:favorites-change";
export function readSaved(): number[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data)
      ? data.filter(
          (n): n is number => typeof n === "number" && Number.isInteger(n),
        )
      : [];
  } catch {
    return [];
  }
}
export default function SavedButton({
  id,
  compact = false,
}: {
  id: number;
  compact?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    const sync = () => setSaved(readSaved().includes(id));
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(FAVORITES_EVENT, sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(FAVORITES_EVENT, sync);
    };
  }, [id]);
  const toggle = () => {
    const ids = readSaved();
    const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(FAVORITES_EVENT));
  };
  return (
    <button
      type="button"
      onClick={toggle}
      className={`save-button ${saved ? "is-saved" : ""} ${compact ? "compact" : ""}`}
      aria-label={saved ? "Премахни от любими" : "Запази в любими"}
      title={saved ? "Премахни от любими" : "Запази в любими"}
    >
      <Heart size={compact ? 18 : 19} fill={saved ? "currentColor" : "none"} />
      {!compact && <span>{saved ? "Запазено" : "Запази мястото"}</span>}
    </button>
  );
}
