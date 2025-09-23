"use client";

import AosInit from "../../components/AosInit";
import Footer from "../../components/Footer";
import PageBanner from "../../components/ui/PageBanner";

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





        <Footer />
      </div>

      <AosInit />
    </>
  );
}
