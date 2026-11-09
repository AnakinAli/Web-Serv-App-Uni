import Link from "next/link";
import {
  ArrowRight,
  Gamepad2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { getGames, sortGames } from "@/lib/data";
import GameCard from "@/components/GameCard";
export const dynamic = "force-dynamic";
type Filters = { year?: string; sort?: string; genre?: string; q?: string };
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Filters>;
}) {
  const filters = await searchParams;
  const all = await getGames();
  const featured = sortGames(all, "rating_desc")[0];
  const genres = [...new Set(all.map((x) => x.genre))].sort();
  const years = [...new Set(all.map((x) => x.year))].sort((a, b) => b - a);
  const filtered = all.filter(
    (g) =>
      (!filters.year || g.year === Number(filters.year)) &&
      (!filters.genre || g.genre === filters.genre) &&
      (!filters.q ||
        `${g.title} ${g.genre}`
          .toLocaleLowerCase("bg")
          .includes(filters.q.toLocaleLowerCase("bg"))),
  );
  const games = sortGames(filtered, filters.sort || "rating_desc");
  return (
    <>
      <section className="games-hero">
        <div className="container hero-grid">
          <div className="hero-text">
            <div className="chip">
              <Sparkles size={14} /> ТВОЯТА ГЕЙМИНГ ВСЕЛЕНА
            </div>
            <h1>
              Открий играта,
              <br />
              <span>която те очаква.</span>
            </h1>
            <p>
              Подбрани заглавия, вдъхновяващи светове и оценки на едно място.
              Избери следващото си приключение.
            </p>
            <div className="hero-actions">
              <Link href="/#catalog" className="button primary">
                Разгледай каталога <ArrowRight size={17} />
              </Link>
              <Link href="/add" className="button ghost">
                Добави своя игра
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{all.length}</strong>
                <span>игри в каталога</span>
              </div>
              <div>
                <strong>{genres.length}</strong>
                <span>различни жанра</span>
              </div>
              <div>
                <strong>10/10</strong>
                <span>максимален рейтинг</span>
              </div>
            </div>
          </div>
          {featured && (
            <div className="hero-featured" id="featured">
              <img
                src={featured.imageUrl}
                alt={`Илюстрация на ${featured.title}`}
              />
              <div className="featured-overlay">
                <span className="featured-small">
                  <Trophy size={15} /> ИЗБОР НА РЕДАКТОРА
                </span>
                <h2>{featured.title}</h2>
                <p>
                  {featured.genre} · {featured.year}
                </p>
                <Link href={`/games/${featured.id}`} className="featured-link">
                  Виж подробности <ArrowRight size={18} />
                </Link>
              </div>
              <span className="featured-rating">
                <Star size={15} fill="currentColor" />{" "}
                {featured.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </section>
      <section className="container catalog-section" id="catalog">
        <div className="catalog-heading">
          <div>
            <div className="section-kicker">
              <Gamepad2 size={15} /> GAME LIBRARY
            </div>
            <h2>
              Библиотека с игри <span>({games.length})</span>
            </h2>
            <p>Филтрирай, сортирай и намери следващия си фаворит.</p>
          </div>
          <div className="catalog-caption">
            <Trophy size={15} /> Подредени според твоите предпочитания
          </div>
        </div>
        <form className="games-filter" action="/" method="get">
          <div className="filter-item search-item">
            <Search size={17} />
            <input
              type="search"
              name="q"
              defaultValue={filters.q || ""}
              placeholder="Търси игра..."
              aria-label="Търси игра"
            />
          </div>
          <label className="filter-item">
            <SlidersHorizontal size={17} />
            <select
              name="genre"
              aria-label="Жанр"
              defaultValue={filters.genre || ""}
            >
              <option value="">Всички жанрове</option>
              {genres.map((g) => (
                <option value={g} key={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-item">
            <select
              name="year"
              aria-label="Година"
              defaultValue={filters.year || ""}
            >
              <option value="">Всички години</option>
              {years.map((y) => (
                <option value={y} key={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="filter-item">
            <select
              name="sort"
              aria-label="Сортиране"
              defaultValue={filters.sort || "rating_desc"}
            >
              <option value="rating_desc">Рейтинг: най-висок</option>
              <option value="rating_asc">Рейтинг: най-нисък</option>
              <option value="year_desc">Най-нови</option>
              <option value="year_asc">Най-стари</option>
            </select>
          </label>
          <button className="button primary" type="submit">
            Приложи
          </button>
        </form>
        {games.length ? (
          <div className="games-grid">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="games-empty">
            Не са открити игри по зададените филтри. Опитай отново.
          </div>
        )}
      </section>
    </>
  );
}
