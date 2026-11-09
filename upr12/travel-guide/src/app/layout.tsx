import type { Metadata } from "next";
import "./globals.css";
import TravelHeader from "@/components/TravelHeader";
import TravelFooter from "@/components/TravelFooter";
export const metadata: Metadata = {
  title: "TravelGuide — Открий света",
  description: "Туристически пътеводител с ревюта, дестинации и любими места.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bg">
      <body>
        <TravelHeader />
        <main>{children}</main>
        <TravelFooter />
      </body>
    </html>
  );
}
