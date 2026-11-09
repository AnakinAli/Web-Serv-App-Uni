import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Compass,
  MapPin,
  Search,
  Star,
  Users,
} from "lucide-react";
import DestinationCard from "@/components/DestinationCard";
import { getDestinations, sortDestinations } from "@/lib/data";
export const dynamic = "force-dynamic";
export default async function Home() {
  const destinations = await getDestinations();
  const top = sortDestinations(destinations)
    .filter((d) => d.rating >= 4.5)
    .slice(0, 6);
  return (
    <>
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-copy">
            <div className="eyebrow eyebrow-light">
              <span className="eyebrow-dot" /> СВЕТЪТ ТЕ ОЧАКВА
            </div>
            <h1>
              Светът е голям.
              <br />
              <em>Открий своята</em>
              <br />
              следваща история.
            </h1>
            <p>
              Красиви места, истински впечатления и идеи за незабравими
              пътувания — всичко на едно място.
            </p>
            <form className="hero-search" action="/destinations" method="get">
              <Search size={19} />
              <input
                name="q"
                aria-label="Потърси дестинация"
                placeholder="Къде искаш да отидеш?"
              />
              <button type="submit">
                Търси <ArrowRight size={16} />
              </button>
            </form>
            <div className="hero-trust">
              <span>
                <Star size={17} fill="currentColor" /> Любими дестинации
              </span>
              <span>
                <Users size={17} /> Отзиви от пътешественици
              </span>
            </div>
          </div>
          <div className="hero-art">
            <img src="/images/santorini.svg" alt="Санторини — морски пейзаж" />
            <div className="hero-art-note">
              <MapPin size={15} /> Санторини, Гърция <span>★ 4.9</span>
            </div>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <div className="eyebrow">ВЪЗМОЖНОСТИ ЗА ПЪТУВАНЕ</div>
            <h2>Популярни дестинации</h2>
            <p>Любимите места на нашата общност, подредени по рейтинг.</p>
          </div>
          <Link className="button button-outline" href="/destinations">
            Всички дестинации <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="destination-grid">
          {top.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </section>
      <section className="container">
        <div className="promo">
          <div>
            <div className="eyebrow eyebrow-light">НАЧЕРТАЙ СВОЯ МАРШРУТ</div>
            <h2>
              Твоето приключение
              <br />
              започва с едно място.
            </h2>
            <p>
              Запази харесаните дестинации и създай личен списък за следващото
              пътуване.
            </p>
            <Link className="button button-light" href="/my-trips">
              Моите пътувания <ArrowRight size={17} />
            </Link>
          </div>
          <div className="promo-symbol">
            <Compass size={126} strokeWidth={1} />
          </div>
        </div>
      </section>
      <section className="section container compact-section">
        <div className="stats-row">
          <div>
            <strong>{destinations.length}+</strong>
            <span>уникални места</span>
          </div>
          <div>
            <strong>
              {destinations.filter((d) => d.rating >= 4.5).length}
            </strong>
            <span>топ дестинации</span>
          </div>
          <div>
            <strong>4.5★</strong>
            <span>праг за най-добрите</span>
          </div>
        </div>
      </section>
    </>
  );
}
