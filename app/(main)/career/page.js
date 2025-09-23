"use client";

import AosInit from "../../components/AosInit";
import Footer from "../../components/Footer";
import PageBanner from "../../components/ui/PageBanner";
import ScrollToTop from "../../components/ui/ScrollToTop";

// Metadata for the Career page

const openPositions = [
  {
    title: "Video Editor",
    link: "https://forms.gle/tPqJL3wdssJdyvUX9",
  },
  {
    title: "3D Motion Designer",
    link: "https://forms.gle/9zxoVpWMGunB1cp89",
  },
  {
    title: "Designer",
    link: "https://forms.gle/Navu9DpfkZpKxZwP7",
  },
  {
    title: "Copywriter",
    link: "https://forms.gle/22A3qfv9DnRjKRZE7",
  },
];

const applicationProcess = [
  {
    step: "1",
    title: "Screening",
    description:
      "We review your application and portfolio to understand your background and experience.",
    icon: "📋",
  },
  {
    step: "2",
    title: "Interview",
    description:
      "Have a conversation with our team to discuss your experience, goals, and cultural fit.",
    icon: "💬",
  },
  {
    step: "3",
    title: "Offer",
    description:
      "If you're a great fit, we'll extend an offer and welcome you to the team!",
    icon: "🎉",
  },
];

const workCulture = [
  {
    title: "Retreat & Meet-up",
    description:
      "Annual team retreats and regular meetups to build connections and have fun together.",
    icon: "🎯",
  },
  {
    title: "Work Week",
    description:
      "Structured 40-hour work week with clear boundaries between work and personal time.",
    icon: "📅",
  },
  {
    title: "Learning",
    description:
      "Continuous learning opportunities with courses, workshops, and skill development programs.",
    icon: "📚",
  },
];

const benefits = [
  {
    title: "Fully remote",
    description:
      "Work from the comfort of your home or any location in Bangladesh.",
    icon: "🌍",
  },
  {
    title: "Flexible hours",
    description: "Set your own schedule and work when you're most productive.",
    icon: "🕐",
  },
  {
    title: "Retreat & Meet-up",
    description: "Join our annual team retreats and networking events.",
    icon: "🎪",
  },
];

export default function Career() {
  return (
    <>
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        {/* Hero Section */}
        <PageBanner
          title="Join Us"
          description="Shape the future of digital marketing in Bangladesh with our passionate, innovative team"
          backgroundImage="/assets/images/backgrounds/career-banner.jpg"
        />

        {/* Application Process Section */}
        <section className="py-5 py-lg-11 py-xl-12 bg-light">
          <div className="container">
            <div className="text-center mb-5 mb-lg-8">
              <h2 className="display-4 fw-bold text-white mb-3">
                Application Process
              </h2>
              <p
                className="fs-5 text-white mx-auto"
                style={{ maxWidth: "600px" }}
              >
                Our hiring process is designed to be transparent, fair, and
                efficient. Here's what you can expect.
              </p>
            </div>

            <div className="d-flex justify-content-center">
              <div
                className="row g-4 justify-content-center"
                style={{ maxWidth: "900px" }}
              >
                {applicationProcess.map((process, index) => (
                  <div key={index} className="col-md-6 col-lg-4 mb-5">
                    <div className="text-center">
                      <div
                        className="bg-danger text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4 fw-bold"
                        style={{
                          width: "40px",
                          height: "40px",
                          fontSize: "18px",
                        }}
                      >
                        {process.step}
                      </div>
                      <h3 className="display-6 fw-bold text-white mb-4">
                        {process.title}
                      </h3>
                      <p className="fs-6 text-white lh-base px-2">
                        {process.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section
          id="open-positions"
          className="py-5 py-lg-11 py-xl-12 bg-white"
        >
          <div className="container">
            <div className="text-center mb-5 mb-lg-8">
              <h2 className="display-4 fw-bold text-dark mb-3">
                Open Positions
              </h2>
              <p className="fs-5 text-dark">
                Find your perfect role and join our growing team
              </p>
            </div>

            <div className="row g-4">
              {openPositions.map((position, index) => (
                <div key={index} className="col-lg-6">
                  <div className="bg-white rounded-3 p-4 p-lg-5 shadow-sm border h-100">
                    <div className="text-center mb-4">
                      <h3 className="display-5 fw-bold text-dark mb-3">
                        {position.title}
                      </h3>
                      <p className="fs-6 text-dark mb-3">
                        {position.description}
                      </p>
                    </div>

                    <div className="d-flex justify-content-center">
                      <a
                        href={position.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-danger px-5 py-3 fs-5 fw-medium text-decoration-none"
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits of Working With Us Section */}
        <section className="py-5 py-lg-11 py-xl-12 bg-light">
          <div className="container">
            <div className="text-center mb-5 mb-lg-8">
              <h2 className="display-4 fw-bold text-white mb-3">
                Benefits Of Working With Decor's Digital
              </h2>
              <p className="fs-5 text-white">
                We offer more than just a job - we provide a lifestyle that
                supports your growth and well-being
              </p>
            </div>

            <div className="row g-4">
              {workCulture.map((culture, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="bg-white rounded-3 p-4 p-lg-5 text-center shadow-sm h-100">
                    <div className="mb-4" style={{ fontSize: "4rem" }}>
                      {culture.icon}
                    </div>
                    <h3 className="fs-3 fw-bold text-dark mb-3">
                      {culture.title}
                    </h3>
                    <p className="fs-6 text-dark lh-base">
                      {culture.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Don't See a Match Section */}
        <section className="py-5 py-lg-11 py-xl-12 bg-white">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 text-center">
                <h2 className="display-4 fw-bold text-dark mb-4">
                  Don't see a match?
                </h2>
                <p className="fs-6 text-dark mb-4 mb-lg-5">
                  We're always looking for talented individuals to join our
                  team. Send us your information and we'll keep you in mind for
                  future opportunities.
                </p>
                <a
                  href="mailto:info@thedecorbd.com?subject=CV Submission - Career Opportunity&body=Dear Hiring Team,%0D%0A%0D%0AI am interested in joining your team. Please find my CV attached.%0D%0A%0D%0ABest regards"
                  className="btn btn-danger px-5 py-3 fs-4 fw-medium text-decoration-none"
                >
                  Send us your CV
                </a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <ScrollToTop />
      <AosInit />
    </>
  );
}
