import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  MessageSquarePlus,
  Star,
  Wallet,
} from "lucide-react";
import SavedButton from "@/components/SavedButton";
import { getDestination, getReviews } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function DestinationDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numberId = Number(id);
  if (!Number.isInteger(numberId) || numberId < 1) notFound();
  const destination = await getDestination(numberId);
  if (!destination) notFound();
  const reviews = await getReviews(numberId);
  return (
    <div className="container page-section">
      <Link className="back-link" href="/destinations">
        <ArrowLeft size={17} /> Всички дестинации
      </Link>
      <div className="detail-heading">
        <div>
          <div className="eyebrow">{destination.type.toUpperCase()}</div>
          <h1>{destination.name}</h1>
          <div className="detail-meta">
            <span>
              <MapPin size={17} /> {destination.city}, {destination.country}
            </span>
            <span>
              <Star size={17} fill="currentColor" />{" "}
              {destination.rating.toFixed(1)} рейтинг
            </span>
          </div>
        </div>
        <SavedButton id={destination.id} />
      </div>
      <div className="gallery">
        <div className="gallery-main">
          <img
            src={destination.gallery[0] || destination.imageUrl}
            alt={destination.name}
          />
        </div>
        <div className="gallery-side">
          <img
            src={destination.gallery[1] || destination.imageUrl}
            alt={`${destination.name} — допълнителна гледка`}
          />
          <img
            src={destination.gallery[2] || destination.imageUrl}
            alt={`${destination.name} — пейзаж`}
          />
        </div>
      </div>
      <div className="detail-layout">
        <div>
          <section className="detail-block">
            <div className="eyebrow">ЗА МЯСТОТО</div>
            <h2>Едно незабравимо изживяване</h2>
            <p className="detail-description">{destination.description}</p>
          </section>
          <section className="detail-block reviews-section">
            <div className="reviews-header">
              <div>
                <div className="eyebrow">МНЕНИЯ НА ПЪТЕШЕСТВЕНИЦИ</div>
                <h2>
                  Отзиви <span>({reviews.length})</span>
                </h2>
              </div>
              <Link
                href={`/add-review/${destination.id}`}
                className="button button-primary"
              >
                <MessageSquarePlus size={17} /> Напиши ревю
              </Link>
            </div>
            {reviews.length ? (
              <div className="reviews-list">
                {reviews.map((r) => (
                  <article className="review-card" key={r.id}>
                    <div className="review-top">
                      <div className="review-avatar">
                        {r.author.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <strong>{r.author}</strong>
                        <span>Пътешественик</span>
                      </div>
                      <div className="review-stars">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </div>
                    </div>
                    <p>{r.text}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                Все още няма ревюта. Бъди първият!
              </div>
            )}
          </section>
        </div>
        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <div className="eyebrow">ПЛАНИРАЙ ПЪТУВАНЕТО</div>
            <h3>Малко вдъхновение за голямо приключение.</h3>
            <p>
              Добави мястото към списъка си и го намери лесно, когато планираш
              маршрута.
            </p>
            <div className="sidebar-budget">
              <Wallet size={20} />
              <div>
                <span>Ориентировъчен бюджет</span>
                <strong>от €{destination.estimatedBudget}</strong>
              </div>
            </div>
            <SavedButton id={destination.id} />
            <Link className="button button-outline" href="/my-trips">
              Виж моите пътувания
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
