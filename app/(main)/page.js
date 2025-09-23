import AosInit from "../components/AosInit";
import BannerSection from "../components/BannerSection";
import Footer from "../components/Footer";
import MeetOurTeamSection from "../components/MeetOurTeamSection";
import PerformanceOptimizer from "../components/PerformanceOptimizer";
import { COMPANY_INFO } from "../constants";

export const metadata = {
  title: "The Company - Decor's Digital | Premium Digital Marketing Agency",
  description:
    "Discover Decor's Digital - a premium digital marketing agency specializing in brand strategy, creative content, and innovative marketing solutions. Learn about our history, mission, vision, and team.",
  keywords:
    "digital marketing agency, brand strategy, creative agency, marketing solutions, Decor's Digital, company history, mission, vision, team",
  openGraph: {
    title: "The Company - Decor's Digital | Premium Digital Marketing Agency",
    description:
      "Discover Decor's Digital - a premium digital marketing agency specializing in brand strategy, creative content, and innovative marketing solutions.",
    type: "website",
    url: "https://www.thedecorbd.com",
    siteName: "Decor's Digital",
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
    description: COMPANY_INFO.fullDescription,
    images: ["/assets/images/logos/logo-dark.png"],
  },
  alternates: {
    canonical: "https://decorsdigital.com",
  },
};

export default function TheCompany() {
  return (
    <>
      <PerformanceOptimizer />
      <AosInit />
      <main className="page-wrapper overflow-hidden">
        {/* Hero Section with Video Background */}
        <BannerSection />

        {/* History Section */}
        <section className="history-section py-24 bg-gradient-to-br from-white to-gray-50">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center mb-20">
                <p className="text-xl text-gray-600 leading-relaxed">
                  Decor's Digital is a marketing agency backed by its mother
                  company, The Decor, which was established in 2018 and launched
                  a sister concern 'Decor's Digital' in March 2023. Decor's
                  Digital was founded with an initial focus on basic social
                  media marketing. However, by early 2024, the company had
                  rapidly evolved into a full-fledged marketing agency.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section py-24 bg-white">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-8 mb-lg-0">
                <div className="mission-image-placeholder bg-light-gray rounded-4 p-8 text-center">
                  <h4 className="text-muted">Mission Visual</h4>
                  <p className="text-muted">Purpose-driven imagery</p>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="ps-lg-8">
                  <h2 className="display-4 fw-bold text-deep-charcoal mb-6">
                    Our Mission
                  </h2>
                  <p className="lead text-muted mb-8">
                    Empower brands by providing innovative, tailored, impactful
                    marketing solutions, fostering growth and visibility across
                    digital and offline platforms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="vision-section py-24 bg-gradient-to-br from-gray-50 to-white">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h2 className="display-4 fw-bold text-deep-charcoal mb-6">
                  Our Vision
                </h2>
                <p className="lead text-muted mb-8">
                  To be the leading marketing agency in Bangladesh, helping
                  businesses of all scales transform and thrive in an
                  ever-evolving digital landscape.
                </p>
              </div>
              <div className="col-lg-6">
                <div className="vision-image-placeholder bg-light-gray rounded-4 p-8 text-center">
                  <h4 className="text-muted">Vision Visual</h4>
                  <p className="text-muted">Future-focused imagery</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section - Real team members with images */}
        <MeetOurTeamSection />

        {/* Archive Section */}
        <section className="archive-section py-24 bg-white">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center mb-16">
                <h2 className="display-4 fw-bold text-deep-charcoal mb-6">
                  Archive
                </h2>
              </div>
            </div>

            {/* Archive Grid */}
            <div className="row">
              <div className="col-lg-4 col-md-6 mb-8">
                <div className="archive-item bg-light-gray rounded-4 overflow-hidden shadow-sm">
                  <div
                    className="archive-image-placeholder bg-light-gray"
                    style={{
                      height: "250px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="text-center">
                      <h6 className="text-muted">Event Photo</h6>
                      <p className="text-muted small">Team celebration</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <h6 className="fw-bold text-deep-charcoal">
                      Annual Team Retreat
                    </h6>
                    <p className="text-muted small mb-0">
                      Building stronger bonds and celebrating achievements
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-8">
                <div className="archive-item bg-light-gray rounded-4 overflow-hidden shadow-sm">
                  <div
                    className="archive-image-placeholder bg-light-gray"
                    style={{
                      height: "250px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="text-center">
                      <h6 className="text-muted">AV Shoot</h6>
                      <p className="text-muted small">Behind the scenes</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <h6 className="fw-bold text-deep-charcoal">
                      Brand Campaign Shoot
                    </h6>
                    <p className="text-muted small mb-0">
                      Creating compelling visual narratives
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6 mb-8">
                <div className="archive-item bg-light-gray rounded-4 overflow-hidden shadow-sm">
                  <div
                    className="archive-image-placeholder bg-light-gray"
                    style={{
                      height: "250px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="text-center">
                      <h6 className="text-muted">Office Culture</h6>
                      <p className="text-muted small">Daily moments</p>
                    </div>
                  </div>
                  <div className="p-3">
                    <h6 className="fw-bold text-deep-charcoal">
                      Creative Brainstorming
                    </h6>
                    <p className="text-muted small mb-0">
                      Innovation in action
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <button className="btn bg-transparent border-2 border-white/30 text-white px-8 py-4 text-lg font-medium rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                View Full Archive
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="cta-section py-28 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #1C1C1C 0%, #2C2C2C 50%, #1C1C1C 100%)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10"></div>
          <div className="container relative z-10">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <div className="inline-flex items-center gap-3 bg-red-500/20 px-6 py-3 rounded-full mb-10">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-red-400 font-semibold text-sm uppercase tracking-wider">
                    Let's Work Together
                  </span>
                </div>
                <h2 className="text-5xl font-bold text-white mb-8 leading-tight">
                  Ready to Transform Your Brand?
                </h2>
                <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl mx-auto">
                  Let's collaborate to create something extraordinary that
                  drives real results for your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  {/* Primary Button */}
                  <button className="btn bg-transparent border-2 border-white/30 text-white px-8 py-4 text-lg font-medium rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      Start Your Project
                      <iconify-icon
                        icon="lucide:arrow-right"
                        className="text-lg"
                      ></iconify-icon>
                    </span>
                  </button>
                  {/* Secondary Button */}
                  <button className="btn bg-transparent border-2 border-white/30 text-white px-8 py-4 text-lg font-medium rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <iconify-icon
                        icon="lucide:calendar"
                        className="text-lg"
                      ></iconify-icon>
                      Schedule a Call
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-red-600/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
        </section>

        <Footer />
      </main>
    </>
  );
}
