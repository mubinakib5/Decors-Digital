"use client";

import PageBanner from "../../components/ui/PageBanner";
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ui/ScrollToTop";

// Metadata for the Career page

const openPositions = [
  {
    title: "Video Editor",
  },
  {
    title: "3D Motion Designer",
  },
  {
    title: "Designer",
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
          description="The #1 attachment is here. We, as WIPOOL, believe in flexibility & reliability. We are passionate and work like workaholic, so everyone works remote."
          backgroundImage="/images/career-hero-bg.jpg"
        >
          <div className="text-center mt-8">
            <p className="text-lg text-gray-200 mb-8">
              We are building the future of digital marketing in Bangladesh.
              Join our remote-first team.
            </p>
            <button
              className="btn bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-lg font-medium transition-colors duration-300"
              onClick={() =>
                document
                  .getElementById("open-positions")
                  .scrollIntoView({ behavior: "smooth" })
              }
            >
              View Open Positions
            </button>
          </div>
        </PageBanner>

        {/* Application Process Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-deep-charcoal mb-4">
                Application Process
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our hiring process is designed to be transparent, fair, and
                efficient. Here's what you can expect.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {applicationProcess.map((process, index) => (
                <div key={index} className="text-center group">
                  <div className="bg-blue-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                    <span className="text-3xl">{process.icon}</span>
                  </div>
                  <div className="bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-bold text-deep-charcoal mb-3">
                    {process.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {process.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section id="open-positions" className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-deep-charcoal mb-4">
                Open Positions
              </h2>
              <p className="text-lg text-gray-600">
                Find your perfect role and join our growing team
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {openPositions.map((position, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-deep-charcoal mb-4">
                      {position.title}
                    </h3>
                  </div>

                  <div className="flex justify-center">
                    <button className="btn bg-red-600 hover:bg-red-700 text-white py-3 px-8 rounded-lg font-medium transition-colors duration-300">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits of Working With Us Section */}
        <section className="py-20 bg-gray-50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-deep-charcoal mb-4">
                Benefits Of Working With Decor's Digital
              </h2>
              <p className="text-lg text-gray-600">
                We offer more than just a job - we provide a lifestyle that
                supports your growth and well-being
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {workCulture.map((culture, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-5xl mb-6">{culture.icon}</div>
                  <h3 className="text-xl font-bold text-deep-charcoal mb-4">
                    {culture.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {culture.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Don't See a Match Section */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-deep-charcoal mb-6">
                Don't see a match?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're always looking for talented individuals to join our team.
                Send us your information and we'll keep you in mind for future
                opportunities.
              </p>
              <a 
                href="mailto:info@thedecorbd.com?subject=CV Submission - Career Opportunity&body=Dear Hiring Team,%0D%0A%0D%0AI am interested in joining your team. Please find my CV attached.%0D%0A%0D%0ABest regards"
                className="btn bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-lg font-medium transition-colors duration-300"
              >
                Send us your CV
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <ScrollToTop />
    </>
  );
}