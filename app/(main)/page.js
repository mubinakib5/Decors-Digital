import AosInit from "../components/AosInit";
import BannerSection from "../components/BannerSection";
import FaqSection from "../components/FaqSection";
import FeaturedProjectsSection from "../components/FeaturedProjectsSection";
import Footer from "../components/Footer";
import GetInTouchSection from "../components/GetInTouchSection";
import MeetOurTeamSection from "../components/MeetOurTeamSection";
import PerformanceOptimizer from "../components/PerformanceOptimizer";
import ServicesSection from "../components/ServicesSection";
import StatsSection from "../components/StatsSection";
import TestimonialSection from "../components/TestimonialSection";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import { COMPANY_INFO } from "../constants";

export const metadata = {
  title: COMPANY_INFO.name,
  description: COMPANY_INFO.tagline,
  keywords: [
    "digital agency",
    "web development",
    "branding",
    "digital marketing",
    "web design",
    "SEO",
    "content creation",
    "SaaS development",
    "motion graphics",
    "3D modeling",
    "Chattogram",
    "Bangladesh",
  ],
  openGraph: {
    title: COMPANY_INFO.name,
    description: COMPANY_INFO.tagline,
    url: "https://decorsdigital.com",
    siteName: COMPANY_INFO.name,
    images: [
      {
        url: "/assets/images/logos/logo-dark.png",
        width: 1200,
        height: 630,
        alt: COMPANY_INFO.name,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: COMPANY_INFO.name,
    description: COMPANY_INFO.tagline,
    images: ["/assets/images/logos/logo-dark.png"],
  },
  alternates: {
    canonical: "https://decorsdigital.com",
  },
};

export default function Home() {
  return (
    <>
      <PerformanceOptimizer />
      <AosInit />
      <main className="page-wrapper overflow-hidden">
        <BannerSection />
        <StatsSection />
        <FeaturedProjectsSection />
        <ServicesSection />
        <WhyChooseUsSection />
        <TestimonialSection />
        <MeetOurTeamSection />
        <FaqSection />
        <GetInTouchSection />
        <Footer />
        {/* Scroll to Top Button */}
        <div
          className="get-template hstack gap-2 position-fixed bottom-0 end-0 m-4"
          style={{ zIndex: 1000 }}
        >
          <button
            className="btn bg-primary p-2 round-52 rounded-circle hstack justify-content-center flex-shrink-0 hidden"
            id="scrollToTopBtn"
          >
            <iconify-icon
              icon="lucide:arrow-up"
              className="fs-7 text-dark"
            ></iconify-icon>
          </button>
        </div>
      </main>
    </>
  );
}
