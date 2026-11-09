import Link from "next/link";
import { Compass, Heart, MapPin, PlusCircle } from "lucide-react";
export default function TravelHeader() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/">
          <span className="brand-icon">
            <Compass size={21} strokeWidth={2.4} />
          </span>
          <span>
            Travel<span className="brand-accent">Guide</span>
          </span>
        </Link>
        <nav className="navigation" aria-label="Главно меню">
          <Link href="/">Начало</Link>
          <Link href="/destinations">Дестинации</Link>
          <Link href="/my-trips">Моите пътувания</Link>
          <Link href="/about">За проекта</Link>
        </nav>
        <div className="header-actions">
          <Link href="/my-trips" className="icon-link" title="Любими">
            <Heart size={19} />
          </Link>
          <Link
            href="/add-destination"
            className="button button-primary header-add"
          >
            <PlusCircle size={17} /> Добави място
          </Link>
        </div>
      </div>
    </header>
  );
}
