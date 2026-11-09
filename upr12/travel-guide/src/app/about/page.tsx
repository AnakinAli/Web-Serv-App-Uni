import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Heart,
  MessageSquare,
  MapPinned,
} from "lucide-react";
export const dynamic = "force-static";
export default function About() {
  return (
    <div className="container page-section">
      <div className="page-intro">
        <div className="eyebrow">ЗА ПРИЛОЖЕНИЕТО</div>
        <h1>Пътувай с вдъхновение.</h1>
        <p>
          TravelGuide е учебно уеб приложение, което съчетава туристически
          дестинации и мнения на пътешественици.
        </p>
      </div>
      <div className="about-cards">
        <div>
          <MapPinned size={30} />
          <h3>Откривай</h3>
          <p>
            Разглеждай дестинации, търси по град и филтрирай според интересите
            си.
          </p>
        </div>
        <div>
          <Heart size={30} />
          <h3>Планирай</h3>
          <p>
            Запазвай любими места с localStorage — без нужда от регистрация.
          </p>
        </div>
        <div>
          <MessageSquare size={30} />
          <h3>Споделяй</h3>
          <p>Добавяй ревюта с рейтинг, които се пазят в json-server.</p>
        </div>
      </div>
      <div className="about-note">
        <Compass size={30} />
        <div>
          <h2>Технологии</h2>
          <p>
            Next.js App Router, React, TypeScript, REST API Route Handlers,
            json-server и Docker. SSR за динамичните страници, CSR за формите и
            личния списък, SSG за тази страница.
          </p>
          <p>
            Контакт (демонстрационен):{" "}
            <a href="mailto:hello@travelguide.example">
              hello@travelguide.example
            </a>
          </p>
          <Link className="text-link" href="/destinations">
            Разгледай дестинациите <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
