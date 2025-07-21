import { Cormorant, Geist, Geist_Mono, Manrope } from "next/font/google";
import Navbar from "../components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "700", "800"],
});

const cormorant = Cormorant({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "700"],
  style: ["italic", "normal"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/DECOR'S DIGITAL.svg" sizes="any" />
        <link rel="shortcut icon" type="image/svg+xml" href="/DECOR'S DIGITAL.svg" sizes="any" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${cormorant.variable} antialiased font-manrope`}
        style={{ background: "#fff" }}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
