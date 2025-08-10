import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Header from "./components/Header";
import OwlCarouselInit from "./components/OwlCarouselInit";
import { COMPANY_INFO, CONTACT_INFO, SOCIAL_LINKS } from "./constants";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  fallback: ['system-ui', 'arial'],
  preload: true,
  adjustFontFallback: true
});

export const metadata = {
  title: {
    default: COMPANY_INFO.name,
    template: `%s | ${COMPANY_INFO.name}`
  },
  description: COMPANY_INFO.tagline,
  keywords: [
    'digital agency',
    'web development',
    'branding',
    'digital marketing',
    'web design',
    'SEO',
    'content creation',
    'SaaS development',
    'motion graphics',
    '3D modeling',
    'Chattogram',
    'Bangladesh'
  ],
  authors: [{ name: COMPANY_INFO.name }],
  creator: COMPANY_INFO.name,
  publisher: COMPANY_INFO.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://decorsdigital.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://decorsdigital.com',
    siteName: COMPANY_INFO.name,
    title: COMPANY_INFO.name,
    description: COMPANY_INFO.tagline,
    images: [
      {
        url: '/assets/images/logos/logo-dark.png',
        width: 1200,
        height: 630,
        alt: COMPANY_INFO.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: COMPANY_INFO.name,
    description: COMPANY_INFO.tagline,
    images: ['/assets/images/logos/logo-dark.png'],
    creator: '@DecorsDigital',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  category: 'technology',
};

export default function RootLayout({ children }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": COMPANY_INFO.name,
    "description": COMPANY_INFO.description,
    "url": "https://decorsdigital.com",
    "logo": "https://decorsdigital.com/assets/images/logos/logo-dark.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": CONTACT_INFO.phone,
      "contactType": "customer service",
      "email": CONTACT_INFO.email
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": CONTACT_INFO.address,
      "addressCountry": "BD"
    },
    "sameAs": [
      SOCIAL_LINKS.facebook,
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.twitter,
      SOCIAL_LINKS.linkedin,
      SOCIAL_LINKS.youtube
    ],
    "serviceArea": {
      "@type": "GeoCircle",
      "geoMidpoint": {
        "@type": "GeoCoordinates",
        "latitude": 22.3277761,
        "longitude": 91.8103838
      },
      "geoRadius": "50000"
    }
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
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-TileColor" content="#000000" />
        <link
          rel="stylesheet"
          href="/assets/libs/owl.carousel/dist/assets/owl.carousel.min.css"
        />
        <link rel="stylesheet" href="/assets/libs/aos-master/dist/aos.css" />
        <link rel="stylesheet" href="/assets/css/styles.css" />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Button hover styles with highest priority */
            .btn-primary:hover {
              background-color: #ffffff !important;
              border-color: #ff0000 !important;
              color: #000000 !important;
            }
            
            .btn-primary:focus {
              background-color: #ffffff !important;
              border-color: #ff0000 !important;
              color: #000000 !important;
              box-shadow: 0 0 0 0.25rem rgba(255, 0, 0, 0.5) !important;
            }
            
            .btn-primary:active {
              background-color: #ffffff !important;
              border-color: #ff0000 !important;
              color: #000000 !important;
            }
            
            /* Additional specificity for button elements */
            button.btn-primary:hover,
            a.btn-primary:hover,
            input.btn-primary:hover {
              background-color: #ffffff !important;
              border-color: #ff0000 !important;
              color: #000000 !important;
            }
            
            /* Even more specific selectors */
            .btn.btn-primary:hover,
            .btn.btn-primary:focus,
            .btn.btn-primary:active {
              background-color: #ffffff !important;
              border-color: #ff0000 !important;
              color: #000000 !important;
            }
            
            /* Most specific selector for the exact button structure */
            button.btn.btn-primary.fs-6.px-4.py-3.hstack.justify-content-center.gap-2:hover,
            button.btn.btn-primary.fs-6.px-4.py-3.hstack.justify-content-center.gap-2:focus,
            button.btn.btn-primary.fs-6.px-4.py-3.hstack.justify-content-center.gap-2:active {
              background-color: #ffffff !important;
              border-color: #ff0000 !important;
              color: #000000 !important;
            }
          `
        }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
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
        <Header />
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
        <Script 
          src="/assets/js/custom.js" 
          strategy="afterInteractive"
        />
        <Script 
          src="https://cdn.jsdelivr.net/npm/iconify-icon@1.0.8/dist/iconify-icon.min.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
