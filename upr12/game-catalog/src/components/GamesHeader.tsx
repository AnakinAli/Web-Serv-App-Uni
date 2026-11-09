import Link from "next/link";
import { Gamepad2, Plus, Sparkles } from "lucide-react";
export default function GamesHeader() {
  return (
    <header className="games-header">
      <div className="container games-header-inner">
        <Link href="/" className="games-brand">
          <span className="brand-box">
            <Gamepad2 size={22} />
          </span>
          Game<span>Vault</span>
          <sup>✦</sup>
        </Link>
        <nav className="games-nav">
          <Link href="/">Каталог</Link>
          <Link href="/#featured">Топ игри</Link>
          <Link href="/about">За проекта</Link>
        </nav>
        <Link href="/add" className="button primary">
          <Plus size={17} /> Добави игра
        </Link>
      </div>
    </header>
  );
}
