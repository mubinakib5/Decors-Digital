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

export const metadata = {
  title: "Decor's Digital - Creative Marketing Agency",
  description: "Decor's Digital is a full-service marketing agency offering branding, digital marketing, web design, and creative solutions.",
  openGraph: {
    title: "Decor's Digital - Creative Marketing Agency",
    description: "Decor's Digital is a full-service marketing agency offering branding, digital marketing, web design, and creative solutions.",
    url: "https://yourdomain.com",
    siteName: "Decor's Digital",
    images: [
      {
        url: "/DD_Hero_Logo@3x.png",
        width: 800,
        height: 600,
        alt: "Decor's Digital Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Decor's Digital - Creative Marketing Agency",
    description: "Decor's Digital is a full-service marketing agency offering branding, digital marketing, web design, and creative solutions.",
    images: ["/DD_Hero_Logo@3x.png"],
  },
  robots: "index, follow",
  icons: {
    icon: "/DECOR'S DIGITAL.svg",
  },
};

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
        {/* Skip to main content link for accessibility */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:ring-4 focus:ring-red-500 focus:outline-none bg-white text-black font-bold px-4 py-2 rounded absolute top-2 left-2 z-[1000] transition-all">Skip to main content</a>
        <header>
          <Navbar />
        </header>
        <main id="main-content" className="min-h-screen">
          {/* Visually hidden h1 for homepage accessibility/SEO */}
          <h1 className="sr-only">Decor&apos;s Digital - Creative Marketing Agency</h1>
          {children}
        </main>
      </body>
    </html>
  );
}
