import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Gamepad2,
  MonitorPlay,
  Star,
  Tag,
  UserRound,
} from "lucide-react";
import { getGame } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function GameDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const gameId = Number(id);
  if (!Number.isInteger(gameId) || gameId < 1) notFound();
  const game = await getGame(gameId);
  if (!game) notFound();
  return (
    <div className="container game-detail-page">
      <Link className="back" href="/">
        <ArrowLeft size={17} /> Обратно към каталога
      </Link>
      <div className="game-detail-grid">
        <div className="detail-cover">
          <img src={game.imageUrl} alt={`Обложка на ${game.title}`} />
          <span className="cover-rating">
            <Star size={18} fill="currentColor" /> {game.rating.toFixed(1)}{" "}
            <small>/ 10</small>
          </span>
        </div>
        <div className="detail-info">
          <span className="detail-tag">
            <Gamepad2 size={14} /> GAME DETAILS
          </span>
          <h1>{game.title}</h1>
          <p className="detail-subtitle">
            Открий историята зад едно изключително игрово преживяване.
          </p>
          <div className="detail-facts">
            <div>
              <Tag size={20} />
              <span>Жанр</span>
              <strong>{game.genre}</strong>
            </div>
            <div>
              <CalendarDays size={20} />
              <span>Година на издаване</span>
              <strong>{game.year}</strong>
            </div>
            <div>
              <UserRound size={20} />
              <span>Разработчик</span>
              <strong>{game.developer}</strong>
            </div>
            <div>
              <Star size={20} />
              <span>Рейтинг</span>
              <strong>{game.rating.toFixed(1)} / 10</strong>
            </div>
          </div>
          <div className="game-description">
            <h2>За играта</h2>
            <p>{game.description}</p>
          </div>
          <Link className="button primary" href="/">
            Виж всички игри <MonitorPlay size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
