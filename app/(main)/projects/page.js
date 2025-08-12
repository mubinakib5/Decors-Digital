import Image from 'next/image';
import Link from 'next/link';
import AosInit from '../../components/AosInit';
import Footer from '../../components/Footer';

export default function Projects() {
  return (
    <>
      <AosInit />
      
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        {/* Banner Section */}
        <section
          className="banner-section banner-inner-section position-relative overflow-hidden d-flex align-items-end"
          style={{
            backgroundImage: "url('/assets/images/backgrounds/projects-banner.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '60vh'
          }}
        >
          <div className="container">
            <div className="d-flex flex-column gap-4 pb-5 pb-xl-10 position-relative z-1">
              <div className="row align-items-center">
                <div className="col-xl-4">
                  <div
                    className="d-flex align-items-center gap-4"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <Image
                      src="/assets/images/svgs/primary-leaf.svg"
                      alt=""
                      width={24}
                      height={24}
                      className="img-fluid animate-spin"
                    />
                    <p className="mb-0 text-white fs-5 text-opacity-70">
                      A <span className="text-primary">showcase of creativity</span>,
                      strategy, and results explore the projects that define us.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="d-flex align-items-end gap-3"
                data-aos="fade-up"
                data-aos-delay="200"
                data-aos-duration="1000"
              >
                <h1 className="mb-0 fs-16 text-white lh-1">Projects</h1>
                <a
                  href="javascript:void(0)"
                  className="p-1 ps-7 bg-primary rounded-pill"
                >
                  <span className="bg-white round-52 rounded-circle d-flex align-items-center justify-content-center">
                    <iconify-icon
                      icon="lucide:arrow-up-right"
                      className="fs-8 text-dark"
                    ></iconify-icon>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Project Section */}
        <section className="project py-5 py-lg-11 py-xl-12">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 mb-7">
                <div
                  className="portfolio d-flex flex-column gap-6"
                  data-aos="fade-up"
                  data-aos-delay="100"
                  data-aos-duration="1000"
                >
                  <div className="portfolio-img position-relative overflow-hidden">
                    <Image
                      src="/assets/images/portfolio/portfolio-img-5.jpg"
                      alt="Amber Bottle"
                      width={600}
                      height={400}
                      className="img-fluid w-100"
                    />
                    <div className="portfolio-overlay">
                      <Link
                        href="/projects-detail"
                        className="position-absolute top-50 start-50 translate-middle bg-primary round-64 rounded-circle hstack justify-content-center"
                      >
                        <iconify-icon
                          icon="lucide:arrow-up-right"
                          className="fs-8 text-dark"
                        ></iconify-icon>
                      </Link>
                    </div>
                  </div>
                  <div className="portfolio-details d-flex flex-column gap-3">
                    <h3 className="mb-0">Amber Bottle</h3>
                    <div className="hstack gap-2">
                      <span className="badge text-dark border">Photography</span>
                      <span className="badge text-dark border">Studio</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-7">
                <div
                  className="portfolio d-flex flex-column gap-6"
                  data-aos="fade-up"
                  data-aos-delay="200"
                  data-aos-duration="1000"
                >
                  <div className="portfolio-img position-relative overflow-hidden">
                    <Image
                      src="/assets/images/portfolio/portfolio-img-4.jpg"
                      alt="BioTrack LIMS"
                      width={600}
                      height={400}
                      className="img-fluid w-100"
                    />
                    <div className="portfolio-overlay">
                      <Link
                        href="/projects-detail"
                        className="position-absolute top-50 start-50 translate-middle bg-primary round-64 rounded-circle hstack justify-content-center"
                      >
                        <iconify-icon
                          icon="lucide:arrow-up-right"
                          className="fs-8 text-dark"
                        ></iconify-icon>
                      </Link>
                    </div>
                  </div>
                  <div className="portfolio-details d-flex flex-column gap-3">
                    <h3 className="mb-0">BioTrack LIMS</h3>
                    <div className="hstack gap-2">
                      <span className="badge text-dark border">Brand identity</span>
                      <span className="badge text-dark border">Digital design</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-7">
                <div
                  className="portfolio d-flex flex-column gap-6"
                  data-aos="fade-up"
                  data-aos-delay="300"
                  data-aos-duration="1000"
                >
                  <div className="portfolio-img position-relative overflow-hidden">
                    <Image
                      src="/assets/images/portfolio/portfolio-img-6.jpg"
                      alt="Digital Magazine"
                      width={600}
                      height={400}
                      className="img-fluid w-100"
                    />
                    <div className="portfolio-overlay">
                      <Link
                        href="/projects-detail"
                        className="position-absolute top-50 start-50 translate-middle bg-primary round-64 rounded-circle hstack justify-content-center"
                      >
                        <iconify-icon
                          icon="lucide:arrow-up-right"
                          className="fs-8 text-dark"
                        ></iconify-icon>
                      </Link>
                    </div>
                  </div>
                  <div className="portfolio-details d-flex flex-column gap-3">
                    <h3 className="mb-0">Digital Magazine</h3>
                    <div className="hstack gap-2">
                      <span className="badge text-dark border">Digital design</span>
                      <span className="badge text-dark border">Web development</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-7">
                <div
                  className="portfolio d-flex flex-column gap-6"
                  data-aos="fade-up"
                  data-aos-delay="400"
                  data-aos-duration="1000"
                >
                  <div className="portfolio-img position-relative overflow-hidden">
                    <Image
                      src="/assets/images/portfolio/portfolio-img-3.jpg"
                      alt="Pixelforge"
                      width={600}
                      height={400}
                      className="img-fluid w-100"
                    />
                    <div className="portfolio-overlay">
                      <Link
                        href="/projects-detail"
                        className="position-absolute top-50 start-50 translate-middle bg-primary round-64 rounded-circle hstack justify-content-center"
                      >
                        <iconify-icon
                          icon="lucide:arrow-up-right"
                          className="fs-8 text-dark"
                        ></iconify-icon>
                      </Link>
                    </div>
                  </div>
                  <div className="portfolio-details d-flex flex-column gap-3">
                    <h3 className="mb-0">Pixelforge</h3>
                    <div className="hstack gap-2">
                      <span className="badge text-dark border">UI/UX design</span>
                      <span className="badge text-dark border">Web development</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-7">
                <div
                  className="portfolio d-flex flex-column gap-6"
                  data-aos="fade-up"
                  data-aos-delay="500"
                  data-aos-duration="1000"
                >
                  <div className="portfolio-img position-relative overflow-hidden">
                    <Image
                      src="/assets/images/portfolio/portfolio-img-1.jpg"
                      alt="Snapclear"
                      width={600}
                      height={400}
                      className="img-fluid w-100"
                    />
                    <div className="portfolio-overlay">
                      <Link
                        href="/projects-detail"
                        className="position-absolute top-50 start-50 translate-middle bg-primary round-64 rounded-circle hstack justify-content-center"
                      >
                        <iconify-icon
                          icon="lucide:arrow-up-right"
                          className="fs-8 text-dark"
                        ></iconify-icon>
                      </Link>
                    </div>
                  </div>
                  <div className="portfolio-details d-flex flex-column gap-3">
                    <h3 className="mb-0">Snapclear</h3>
                    <div className="hstack gap-2">
                      <span className="badge text-dark border">UX Strategy</span>
                      <span className="badge text-dark border">UI Design</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-7">
                <div
                  className="portfolio d-flex flex-column gap-6"
                  data-aos="fade-up"
                  data-aos-delay="600"
                  data-aos-duration="1000"
                >
                  <div className="portfolio-img position-relative overflow-hidden">
                    <Image
                      src="/assets/images/portfolio/portfolio-img-2.jpg"
                      alt="Transfermax"
                      width={600}
                      height={400}
                      className="img-fluid w-100"
                    />
                    <div className="portfolio-overlay">
                      <Link
                        href="/projects-detail"
                        className="position-absolute top-50 start-50 translate-middle bg-primary round-64 rounded-circle hstack justify-content-center"
                      >
                        <iconify-icon
                          icon="lucide:arrow-up-right"
                          className="fs-8 text-dark"
                        ></iconify-icon>
                      </Link>
                    </div>
                  </div>
                  <div className="portfolio-details d-flex flex-column gap-3">
                    <h3 className="mb-0">Transfermax</h3>
                    <div className="hstack gap-2">
                      <span className="badge text-dark border">Web development</span>
                      <span className="badge text-dark border">Digital design</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Scroll to Top Button */}
      <div className="get-template hstack gap-2 position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1000 }}>
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
    </>
  );
}
