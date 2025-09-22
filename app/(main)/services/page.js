import { Metadata } from "next";
import PageBanner from "@/app/components/ui/PageBanner";
import ServicesSection from "@/app/components/ServicesSection";
import GetInTouchSection from "@/app/components/GetInTouchSection";

export const metadata = {
  title: "Services | Decor's Digital",
  description:
    "Comprehensive digital services including Brand Strategy & Communication, Creative Content Production, Paid Marketing & Promotions, Visual Design & Branding, Website Design & Development, Consultation/Strategy/Training, Digital & Social Media Management, and SEO & AEO.",
  keywords: [
    "Brand Strategy",
    "Communication",
    "Creative Content Production",
    "Paid Marketing",
    "Promotions",
    "Visual Design",
    "Branding",
    "Website Design",
    "Web Development",
    "Consultation",
    "Strategy",
    "Training",
    "Digital Marketing",
    "Social Media Management",
    "SEO",
    "AEO",
    "Answer Engine Optimization",
  ],
  openGraph: {
    title: "Services | Decor's Digital",
    description:
      "Comprehensive digital services including Brand Strategy & Communication, Creative Content Production, Paid Marketing & Promotions, Visual Design & Branding, Website Design & Development, Consultation/Strategy/Training, Digital & Social Media Management, and SEO & AEO.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Services | Decor's Digital",
    description:
      "Comprehensive digital services including Brand Strategy & Communication, Creative Content Production, Paid Marketing & Promotions, Visual Design & Branding, Website Design & Development, Consultation/Strategy/Training, Digital & Social Media Management, and SEO & AEO.",
  },
};

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        title="Our Services"
        description="Comprehensive digital solutions to elevate your brand and drive business growth"
        backgroundImage="/assets/images/backgrounds/aboutus-banner.jpg"
      />
      <ServicesSection />
      <GetInTouchSection />
    </>
  );
}
