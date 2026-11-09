import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container page-section empty-state">
      <h1>Дестинацията не е намерена.</h1>
      <Link className="button button-primary" href="/destinations">
        Към дестинациите
      </Link>
    </div>
  );
}
