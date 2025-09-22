import { Inter } from "next/font/google";
import Script from "next/script";
import OwlCarouselInit from "./components/OwlCarouselInit";
import { COMPANY_INFO, CONTACT_INFO, SOCIAL_LINKS } from "./constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
  preload: true,
  adjustFontFallback: true,
});

export const metadata = {
  title: {
    default: "The Company - Decor's Digital",
    template: `%s | Decor's Digital`,
  },
  description: "Premium digital marketing agency specializing in brand strategy, content creation, paid marketing, visual design, and web development. Transforming businesses through innovative digital solutions.",
  keywords: [
    "digital marketing agency",
    "brand strategy",
    "content creation",
    "paid marketing",
    "visual design",
    "web development",
    "digital transformation",
    "marketing consultation",
    "premium digital services",
    "business growth",
    "creative agency",
    "digital solutions",
    "Bangladesh",
    "Chattogram",
  ],
  authors: [{ name: "Decor's Digital" }],
  creator: "Decor's Digital",
  publisher: "Decor's Digital",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.thedecorbd.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.thedecorbd.com",
    siteName: "Decor's Digital",
    title: "The Company - Decor's Digital | Premium Digital Marketing Agency",
    description: "Premium digital marketing agency specializing in brand strategy, content creation, paid marketing, visual design, and web development. Transforming businesses through innovative digital solutions.",
    images: [
      {
        url: "/assets/images/logos/logo-dark.png",
        width: 1200,
        height: 630,
        alt: "Decor's Digital - Premium Digital Marketing Agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Company - Decor's Digital | Premium Digital Marketing Agency",
    description: "Premium digital marketing agency specializing in brand strategy, content creation, paid marketing, visual design, and web development.",
    images: ["/assets/images/logos/logo-dark.png"],
    creator: "@DecorsDigital",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "business",
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Decor's Digital",
    description: "Premium digital marketing agency specializing in brand strategy, content creation, paid marketing, visual design, and web development. Transforming businesses through innovative digital solutions.",
    url: "https://www.thedecorbd.com",
    logo: "https://www.thedecorbd.com/assets/images/logos/logo-dark.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: CONTACT_INFO.phone,
      contactType: "customer service",
      email: CONTACT_INFO.email,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: CONTACT_INFO.address,
      addressCountry: "BD",
    },
    sameAs: [
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.youtube,
    ],
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 22.3277761,
        longitude: 91.8103838,
      },
      geoRadius: "50000",
    },
    services: [
      {
        "@type": "Service",
        name: "Brand Strategy",
        description: "Comprehensive brand development and positioning strategies"
      },
      {
        "@type": "Service", 
        name: "Content Creation",
        description: "High-quality content development for digital platforms"
      },
      {
        "@type": "Service",
        name: "Paid Marketing",
        description: "Strategic paid advertising campaigns across digital channels"
      },
      {
        "@type": "Service",
        name: "Visual Design",
        description: "Creative visual design solutions for brands and businesses"
      },
      {
        "@type": "Service",
        name: "Web Development",
        description: "Modern, responsive website development and optimization"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/svg+xml"
          href="/assets/images/logos/favicon.svg"
        />
        <link
          rel="shortcut icon"
          type="image/svg+xml"
          href="/assets/images/logos/favicon.svg"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/assets/images/logos/logo-dark.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/images/logos/logo-dark.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/images/logos/logo-dark.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#D2212E" />
        <meta name="msapplication-TileColor" content="#D2212E" />
        <link
          rel="stylesheet"
          href="/assets/libs/owl.carousel/dist/assets/owl.carousel.min.css"
        />
        <link rel="stylesheet" href="/assets/libs/aos-master/dist/aos.css" />
        <link rel="stylesheet" href="/assets/css/styles.css" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Updated button styles using new brand colors */
              .btn {
                background-color: var(--decor-red) !important;
                border-color: var(--decor-red) !important;
                color: #ffffff !important;
                transition: all 0.3s ease;
              }
              
              .btn:hover {
                background-color: #ffffff !important;
                border-color: var(--decor-red) !important;
                color: var(--decor-red) !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(210, 33, 46, 0.3);
              }
              
              .btn:focus {
                background-color: #ffffff !important;
                border-color: var(--decor-red) !important;
                color: var(--decor-red) !important;
                box-shadow: 0 0 0 0.25rem rgba(210, 33, 46, 0.25) !important;
              }
              
              /* Accessibility improvements */
              .btn:focus-visible {
                outline: 2px solid var(--decor-red);
                outline-offset: 2px;
              }
              
              /* Skip to main content link for accessibility */
              .skip-link {
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--decor-red);
                color: white;
                padding: 8px;
                text-decoration: none;
                z-index: 1000;
                border-radius: 4px;
              }
              
              .skip-link:focus {
                top: 6px;
              }
              
              /* High contrast mode support */
              @media (prefers-contrast: high) {
                .btn {
                  border: 2px solid !important;
                }
              }
              
              /* Reduced motion support */
              @media (prefers-reduced-motion: reduce) {
                .btn {
                  transition: none !important;
                }
                .btn:hover {
                  transform: none !important;
                }
              }
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}

        {/* Scripts */}
        <Script
          src="https://code.jquery.com/jquery-3.6.0.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="/assets/libs/bootstrap/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/libs/aos-master/dist/aos.js"
          strategy="afterInteractive"
        />
        <Script
          src="/assets/libs/owl.carousel/dist/owl.carousel.min.js"
          strategy="afterInteractive"
        />
        <OwlCarouselInit />
        <Script src="/assets/js/custom.js" strategy="afterInteractive" />
        <Script src="/assets/js/accordion-fix.js" strategy="afterInteractive" />
        <Script
          src="https://cdn.jsdelivr.net/npm/iconify-icon@1.0.8/dist/iconify-icon.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
