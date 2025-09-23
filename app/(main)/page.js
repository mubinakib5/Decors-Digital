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
                <div className="inline-flex items-center gap-3 bg-red-50 px-6 py-3 rounded-full mb-8">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 font-semibold text-sm uppercase tracking-wider">Our Journey</span>
                </div>
                <h2 className="text-5xl font-bold text-deep-charcoal mb-8 leading-tight">
                  Our History
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  From humble beginnings to industry leadership, discover the
                  journey that shaped Decor's Digital into the premium agency we
                  are today.
                </p>
              </div>
            </div>
            <div className="row align-items-center">
              <div className="col-lg-6">
                <div className="timeline-content">
                  <div className="timeline-item mb-12 group">
                    <div className="d-flex align-items-start">
                      <div
                        className="timeline-marker bg-gradient-to-br from-red-500 to-red-600 rounded-full me-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{
                          width: "16px",
                          height: "16px",
                          marginTop: "8px",
                        }}
                      ></div>
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                        <h5 className="text-xl font-bold text-deep-charcoal mb-3">
                          2018 - The Decor Established
                        </h5>
                        <p className="text-gray-600 leading-relaxed">
                          The Decor, our mother company, was established with a vision to transform the marketing landscape in Bangladesh.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="timeline-item mb-8 group">
                    <div className="d-flex align-items-start">
                      <div
                        className="timeline-marker bg-gradient-to-br from-red-500 to-red-600 rounded-full me-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{
                          width: "16px",
                          height: "16px",
                          marginTop: "8px",
                        }}
                      ></div>
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                        <h5 className="text-xl font-bold text-deep-charcoal mb-3">
                          March 2023 - Decor's Digital Launch
                        </h5>
                        <p className="text-gray-600 leading-relaxed">
                          Launched as a sister concern of The Decor, initially focusing on basic social media marketing services.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="timeline-item mb-8 group">
                    <div className="d-flex align-items-start">
                      <div
                        className="timeline-marker bg-gradient-to-br from-red-500 to-red-600 rounded-full me-4 shadow-lg group-hover:scale-110 transition-transform duration-300"
                        style={{
                          width: "16px",
                          height: "16px",
                          marginTop: "8px",
                        }}
                      ></div>
                      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 group-hover:shadow-xl transition-all duration-300">
                        <h5 className="text-xl font-bold text-deep-charcoal mb-3">
                          Early 2024 - Full-Fledged Agency
                        </h5>
                        <p className="text-gray-600 leading-relaxed">
                          Rapidly evolved into a comprehensive marketing agency, offering innovative and tailored marketing solutions across digital and offline platforms.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="history-image-placeholder bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-12 text-center shadow-xl border border-gray-200">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mx-auto flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-deep-charcoal mb-2">Our Journey</h4>
                    <p className="text-gray-600">
                      Timeline infographic or company photos
                    </p>
                  </div>
                </div>
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
                    Empower brands by providing innovative, tailored, impactful marketing solutions, fostering growth and visibility across digital and offline platforms.
                  </p>
                  <div className="mission-values">
                    <div className="d-flex align-items-start mb-6">
                      <div
                        className="bg-primary rounded-circle me-3"
                        style={{ width: "8px", height: "8px", marginTop: "12px" }}
                      ></div>
                      <p className="text-muted mb-0">
                        Leverage cutting-edge technologies and creative strategies to deliver exceptional results
                      </p>
                    </div>
                    <div className="d-flex align-items-start mb-3">
                      <div
                        className="bg-primary rounded-circle me-3"
                        style={{ width: "8px", height: "8px", marginTop: "12px" }}
                      ></div>
                      <p className="text-muted mb-0">
                        Tailor every solution to meet the unique needs and goals of our clients
                      </p>
                    </div>
                    <div className="d-flex align-items-start">
                      <div
                        className="bg-primary rounded-circle me-3"
                        style={{ width: "8px", height: "8px", marginTop: "12px" }}
                      ></div>
                      <p className="text-muted mb-0">
                        Continuously innovate to stay ahead of industry trends
                      </p>
                    </div>
                  </div>
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
                  To be the leading marketing agency in Bangladesh, helping businesses of all scales transform and thrive in an ever-evolving digital landscape.
                </p>
                <div className="vision-stats row">
                  <div className="col-4 text-center">
                    <h3 className="fw-bold text-primary">500+</h3>
                    <p className="text-muted small">Projects Delivered</p>
                  </div>
                  <div className="col-4 text-center">
                    <h3 className="fw-bold text-primary">150+</h3>
                    <p className="text-muted small">Happy Clients</p>
                  </div>
                  <div className="col-4 text-center">
                    <h3 className="fw-bold text-primary">6+</h3>
                    <p className="text-muted small">Years Experience</p>
                  </div>
                </div>
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
                <p className="lead text-muted">
                  Explore our journey through moments that define our culture,
                  creativity, and collaborative spirit.
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="row mb-8">
              <div className="col-12 text-center">
                <div className="archive-filters">
                  <button className="btn btn-outline-primary me-2 mb-2 active">
                    All
                  </button>
                  <button className="btn btn-outline-primary me-2 mb-2">
                    Events
                  </button>
                  <button className="btn btn-outline-primary me-2 mb-2">
                    AV Shoots
                  </button>
                  <button className="btn btn-outline-primary me-2 mb-2">
                    Team Culture
                  </button>
                </div>
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
              <button className="btn btn-primary px-8 py-3 text-lg font-semibold rounded-full hover:shadow-lg transition-all duration-300">
                View Full Archive
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-28 relative overflow-hidden" style={{
          background: 'linear-gradient(135deg, #1C1C1C 0%, #2C2C2C 50%, #1C1C1C 100%)'
        }}>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10"></div>
          <div className="container relative z-10">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <div className="inline-flex items-center gap-3 bg-red-500/20 px-6 py-3 rounded-full mb-10">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  <span className="text-red-400 font-semibold text-sm uppercase tracking-wider">Let's Work Together</span>
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
                  <button className="btn bg-gradient-to-r from-red-500 to-red-600 text-white px-10 py-4 text-lg font-bold rounded-full hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl border-2 border-red-500">
                    <span className="flex items-center gap-2">
                      Start Your Project
                      <iconify-icon icon="lucide:arrow-right" className="text-lg"></iconify-icon>
                    </span>
                  </button>
                  {/* Secondary Button */}
                  <button className="btn bg-transparent border-2 border-white/30 text-white px-8 py-4 text-lg font-medium rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-105 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <iconify-icon icon="lucide:calendar" className="text-lg"></iconify-icon>
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
        {/* Scroll to Top Button */}
        <div
          className="get-template hstack gap-2 position-fixed bottom-0 end-0 m-4"
          style={{ zIndex: 1000 }}
        >
          <button
            className="btn bg-primary p-2 round-52 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 hidden"
            id="scrollToTopBtn"
          >
            <iconify-icon
              icon="lucide:arrow-up"
              className="fs-7 text-white"
            ></iconify-icon>
          </button>
        </div>
      </main>
    </>
  );
}
