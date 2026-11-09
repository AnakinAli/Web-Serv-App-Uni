"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowRight, Map } from "lucide-react";
import DestinationCard from "@/components/DestinationCard";
import { FAVORITES_EVENT, readSaved } from "@/components/SavedButton";
import type { Destination } from "@/lib/types";
export default function MyTrips() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const sync = () => setSavedIds(readSaved());
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener(FAVORITES_EVENT, sync);
    fetch("/api/destinations")
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: Destination[]) => setDestinations(data))
      .catch(() => setError("В момента не можем да заредим дестинациите."))
      .finally(() => setLoading(false));
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(FAVORITES_EVENT, sync);
    };
  }, []);
  const saved = savedIds
    .map((id) => destinations.find((d) => d.id === id))
    .filter((d): d is Destination => d !== undefined);
  return (
    <div className="container page-section">
      <div className="page-intro">
        <div className="eyebrow">ТВОЯТА КОЛЕКЦИЯ</div>
        <h1>
          Моите пътувания <Heart size={30} fill="currentColor" />
        </h1>
        <p>
          Съхранявай местата, които искаш да посетиш. Списъкът се пази в този
          браузър.
        </p>
      </div>
      {loading ? (
        <div className="empty-state">Зареждане...</div>
      ) : error ? (
        <div className="empty-state">{error}</div>
      ) : saved.length ? (
        <>
          <div className="result-header">
            <h2>
              Запазени места <span>({saved.length})</span>
            </h2>
          </div>
          <div className="destination-grid">
            {saved.map((d) => (
              <DestinationCard key={d.id} destination={d} />
            ))}
          </div>
          <div className="trip-route">
            <h2>Моят примерен маршрут</h2>
            <p>
              Местата са подредени в реда, в който са запазени. Това е личен
              списък със спирки, а не оптимизиран транспортен маршрут.
            </p>
            <ol>
              {saved.map((d) => (
                <li key={d.id}>
                  <span>
                    {d.city}, {d.country}
                  </span>
                  <strong>{d.name}</strong>
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : (
        <div className="empty-state big-empty">
          <Map size={48} />
          <h2>Твоят списък очаква нови места</h2>
          <p>Натисни сърцето върху някоя дестинация, за да я добавиш тук.</p>
          <Link className="button button-primary" href="/destinations">
            Разгледай дестинации <ArrowRight size={17} />
          </Link>
        </div>
      )}
    </div>
  );
}
