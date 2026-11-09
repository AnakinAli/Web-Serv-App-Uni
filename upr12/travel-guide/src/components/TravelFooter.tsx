import Link from "next/link";
import { Compass } from "lucide-react";
export default function TravelFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <span className="footer-brand">
          <Compass size={18} /> TravelGuide
        </span>
        <span>Открий следващото си приключение.</span>
        <Link href="/about">Контакти и информация</Link>
      </div>
    </footer>
  );
}
