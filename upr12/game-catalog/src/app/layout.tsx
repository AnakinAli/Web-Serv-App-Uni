import type { Metadata } from "next";
import "./globals.css";
import GamesHeader from "@/components/GamesHeader";
export const metadata: Metadata = {
  title: "GameVault — Каталог на игри",
  description: "Каталог на компютърни игри с рейтинг, търсене и филтриране.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bg">
      <body>
        <GamesHeader />
        <main>{children}</main>
        <footer className="games-footer">
          <div className="container">
            <span>GameVault © 2026</span>
            <span>Създадено с Next.js + json-server</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
