import Image from 'next/image';
import Link from 'next/link';
import AosInit from '../components/AosInit';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <>
      <AosInit />
      
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        {/* Banner Section */}
        <section
          className="banner-section banner-inner-section position-relative overflow-hidden d-flex align-items-end"
          style={{
            backgroundImage: "url('/assets/images/backgrounds/contact-banner.jpg')",
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
                      Ready to
                      <span className="text-primary">start something</span> great?
                      Reach out we'd love to hear from you.
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
                <h1 className="mb-0 fs-16 text-white lh-1">Contact</h1>
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

        {/* Get in touch Section */}
        <section className="get-in-touch py-5 py-lg-11 py-xl-12">
          <div className="container">
            <div className="d-flex flex-column gap-5 gap-xl-10">
              <div className="row gap-7 gap-xl-0">
                <div className="col-xl-4 col-xxl-4">
                  <div
                    className="d-flex align-items-center gap-7 py-2"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">10</span>
                    <hr className="border-line bg-white" />
                    <span className="badge text-bg-dark">Contact us</span>
                  </div>
                </div>
                <div className="col-xl-8 col-xxl-7">
                  <div className="row">
                    <div className="col-xxl-8">
                      <div
                        className="d-flex flex-column gap-6"
                        data-aos="fade-up"
                        data-aos-delay="100"
                        data-aos-duration="1000"
                      >
                        <h2 className="mb-0">Get in touch</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-between gap-7 gap-xl-0">
                <div className="col-xl-3">
                  <p
                    className="mb-0 fs-5"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    Let's collaborate and create something amazing! Tell me about
                    your project—I'm all ears.
                  </p>
                </div>
                <div className="col-xl-8">
                  <form
                    className="d-flex flex-column gap-7"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    <div>
                      <input
                        type="text"
                        className="form-control border-bottom border-dark"
                        id="formGroupExampleInput"
                        placeholder="Name"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        className="form-control border-bottom border-dark"
                        id="exampleInputEmail1"
                        placeholder="Email"
                        aria-describedby="emailHelp"
                      />
                    </div>
                    <div>
                      <textarea
                        className="form-control border-bottom border-dark"
                        id="exampleFormControlTextarea1"
                        placeholder="Tell us about your project"
                        rows="3"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="btn w-100 justify-content-center"
                    >
                      <span className="btn-text">Submit message</span>
                      <iconify-icon
                        icon="lucide:arrow-up-right"
                        className="btn-icon bg-white text-dark round-52 rounded-circle hstack justify-content-center fs-7 shadow-sm"
                      ></iconify-icon>
                    </button>
                  </form>
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
