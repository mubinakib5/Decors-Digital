import type { Metadata } from "next";
import { Cormorant, Geist, Geist_Mono, Manrope } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Decor's Digital - Digital Excellence",
  description: "Transforming ideas into digital excellence. Professional web design and digital solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${cormorant.variable} antialiased font-manrope`}
      >
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
