import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container game-detail-page">
      <div className="games-empty">
        <h1>Играта не е намерена.</h1>
        <Link className="button primary" href="/">
          Обратно към каталога
        </Link>
      </div>
    </div>
  );
}
