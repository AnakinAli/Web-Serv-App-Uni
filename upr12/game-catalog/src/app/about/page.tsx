import Link from "next/link";
import { ArrowRight, Database, Gamepad2, ShieldCheck, Zap } from "lucide-react";
export const dynamic = "force-static";
export default function About() {
  return (
    <div className="container game-detail-page">
      <div className="section-kicker">ЗА ПРОЕКТА</div>
      <h1 className="about-heading">
        Игрите заслужават
        <br />
        <span>свой собствен свят.</span>
      </h1>
      <p className="about-lead">
        GameVault е примерен каталог на компютърни игри, разработен с Next.js
        App Router, TypeScript и json-server за учебни цели.
      </p>
      <div className="games-about-grid">
        <article>
          <Gamepad2 size={28} />
          <h3>Каталог</h3>
          <p>
            Преглеждай подробности за игрите с изображения, жанр, година,
            описание и рейтинг.
          </p>
        </article>
        <article>
          <Zap size={28} />
          <h3>Удобни филтри</h3>
          <p>Търси по име, филтрирай по година и сортирай по рейтинг.</p>
        </article>
        <article>
          <Database size={28} />
          <h3>REST API</h3>
          <p>
            GET и POST операции към Next.js Route Handlers, които комуникират с
            json-server.
          </p>
        </article>
        <article>
          <ShieldCheck size={28} />
          <h3>Валидация</h3>
          <p>Клиентска и сървърна валидация, включително качване на файлове.</p>
        </article>
      </div>
      <Link className="button primary" href="/">
        Обратно към игрите <ArrowRight size={17} />
      </Link>
    </div>
  );
}
