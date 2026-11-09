import Link from "next/link";
import { ArrowUpRight, CalendarDays, Star } from "lucide-react";
import type { Game } from "@/lib/types";
export default function GameCard({ game }: { game: Game }) {
  return (
    <article className="game-card">
      <Link href={`/games/${game.id}`} className="game-art">
        <img src={game.imageUrl} alt={`Илюстрация на ${game.title}`} />
        <span className="score-badge">
          <Star size={12} fill="currentColor" /> {game.rating.toFixed(1)}
        </span>
      </Link>
      <div className="game-card-content">
        <span className="genre-pill">{game.genre}</span>
        <h3>
          <Link href={`/games/${game.id}`}>{game.title}</Link>
        </h3>
        <div className="game-card-bottom">
          <span>
            <CalendarDays size={15} /> {game.year}
          </span>
          <Link
            href={`/games/${game.id}`}
            aria-label={`Детайли за ${game.title}`}
            className="circle-link"
          >
            <ArrowUpRight size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}
