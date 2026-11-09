import DestinationCard from "@/components/DestinationCard";
import { getDestinations } from "@/lib/data";
import { Filter, Search } from "lucide-react";
export const dynamic = "force-dynamic";
type Params = { q?: string; type?: string; country?: string };
export default async function Destinations({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const filters = await searchParams;
  const list = await getDestinations();
  const q = (filters.q || "").trim().toLocaleLowerCase("bg"),
    type = filters.type || "",
    country = filters.country || "";
  const categories = [...new Set(list.map((d) => d.type))].sort();
  const countries = [...new Set(list.map((d) => d.country))].sort();
  const filtered = list.filter(
    (d) =>
      (!q || `${d.name} ${d.city}`.toLocaleLowerCase("bg").includes(q)) &&
      (!type || d.type === type) &&
      (!country || d.country === country),
  );
  return (
    <div className="container page-section">
      <div className="page-intro">
        <div className="eyebrow">ТВОЯТ ПЪТЕВОДИТЕЛ</div>
        <h1>Открий нови места</h1>
        <p>
          Разгледай красиви кътчета на света и избери своята следваща спирка.
        </p>
      </div>
      <form className="filter-panel" method="get" action="/destinations">
        <div className="filter-control filter-search">
          <label htmlFor="q">Име или град</label>
          <div className="input-with-icon">
            <Search size={18} />
            <input
              id="q"
              type="search"
              name="q"
              defaultValue={filters.q || ""}
              placeholder="Напр. Париж, Рила..."
            />
          </div>
        </div>
        <div className="filter-control">
          <label htmlFor="type">Категория</label>
          <select id="type" name="type" defaultValue={type}>
            <option value="">Всички категории</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-control">
          <label htmlFor="country">Държава</label>
          <select id="country" name="country" defaultValue={country}>
            <option value="">Всички държави</option>
            {countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button className="button button-primary" type="submit">
          <Filter size={17} /> Филтрирай
        </button>
      </form>
      <div className="result-header">
        <h2>
          Всички дестинации <span>({filtered.length})</span>
        </h2>
        <span>Открий своя любим маршрут</span>
      </div>
      {filtered.length ? (
        <div className="destination-grid">
          {filtered.map((item) => (
            <DestinationCard key={item.id} destination={item} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          Няма резултати за избраните филтри. Опитай с други критерии.
        </div>
      )}
    </div>
  );
}
