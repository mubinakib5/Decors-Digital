'use client';

import Image from 'next/image';
import Link from 'next/link';
import AosInit from '../../components/AosInit';
import Footer from '../../components/Footer';
import { teamData } from '../../data';
import { COMPANY_INFO } from '../../constants';

export default function AboutUs() {
  return (
    <>
      <AosInit />
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        {/* Banner Section */}
        <section
          className="banner-section banner-inner-section position-relative overflow-hidden d-flex align-items-end"
          style={{
            backgroundImage: "url('/assets/images/backgrounds/aboutus-banner.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '60vh'
          }}
        >
          <div className="container">
            <div className="d-flex flex-column gap-4 pb-5 pb-xl-10 position-relative z-1" style={{ paddingTop: '128px' }}>
              <div
                className="d-flex align-items-end gap-3"
                data-aos="fade-up"
                data-aos-delay="100"
                data-aos-duration="1000"
              >
                <h1 className="mb-0 fs-16 text-white lh-1">About us</h1>
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
              <div className="row align-items-center" style={{ marginTop: '24px' }}>
                <div className="col-xl-4">
                  <div
                    className="d-flex align-items-center gap-2 mb-3"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    <p className="mb-0 text-white fs-5 text-opacity-70">
                      We craft
                      <span className="text-primary"> innovative digital</span>
                      solutions that amplify brand identity and drive meaningful
                      results
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Content Section */}
        <section className="about-content py-5 py-lg-11 py-xl-12">
          <div className="container">
            <div className="d-flex flex-column gap-5 gap-xl-11 gap-xxl-12">
              <div className="row gap-4 gap-lg-0">
                <div className="col-lg-4">
                  <h2
                    className="fs-13 mb-0"
                    data-aos="fade-right"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    Decor's Digital.
                  </h2>
                </div>
                <div className="col-lg-8">
                  <div
                    className="d-flex flex-column gap-4 gap-lg-5"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    <div className="d-flex flex-column gap-4">
                      <h3 className="mb-0 fs-6 text-primary fw-bold">Our Mission</h3>
                      <p className="mb-0 fs-5 text-dark">
                        {COMPANY_INFO.mission}
                      </p>
                    </div>
                    
                    <div className="d-flex flex-column gap-4">
                      <h3 className="mb-0 fs-6 text-primary fw-bold">Our Vision</h3>
                      <p className="mb-0 fs-5 text-dark">
                        {COMPANY_INFO.vision}
                      </p>
                    </div>
                    
                    <div className="d-flex flex-column gap-4">
                      <h3 className="mb-0 fs-6 text-primary fw-bold">Our Purpose</h3>
                      <p className="mb-0 fs-5 text-dark">
                        {COMPANY_INFO.purpose}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row gx-xl-5">
                <div className="col-md-6 col-lg-4 mb-8 mb-lg-0">
                  <div
                    className="d-flex flex-column gap-7"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <h2 className="mb-0 fs-13 pb-7 border-bottom">
                      <span className="count" data-target="45">45</span>+
                    </h2>
                    <div className="d-flex flex-column gap-3">
                      <h4 className="mb-0">Presence in global markets</h4>
                      <p className="mb-0">
                        Expanding reach across international regions with
                        localized expertise and worldwide impact.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4 mb-8 mb-lg-0">
                  <div
                    className="d-flex flex-column gap-7"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    <h2 className="mb-0 fs-13 pb-7 border-bottom">
                      <span className="count" data-target="15">15</span>M
                    </h2>
                    <div className="d-flex flex-column gap-3">
                      <h4 className="mb-0">In strategic investments</h4>
                      <p className="mb-0">
                        Driving growth with curated partnerships and
                        high-performing, audience-driven initiatives.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4 mb-8 mb-lg-0">
                  <div
                    className="d-flex flex-column gap-7"
                    data-aos="fade-up"
                    data-aos-delay="300"
                    data-aos-duration="1000"
                  >
                    <h2 className="mb-0 fs-13 pb-7 border-bottom">
                      <span className="count" data-target="158">158</span>+
                    </h2>
                    <div className="d-flex flex-column gap-3">
                      <h4 className="mb-0">Trusted brand collaborations</h4>
                      <p className="mb-0">
                        Shaping industry conversations through innovation,
                        creativity, and lasting influence.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Book a Call Section */}
        <section className="book-a-call py-5 py-lg-11 py-xl-12 bg-light-gray">
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
                    <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">09</span>
                    <hr className="border-line" />
                    <span className="badge text-bg-dark">Let's talk</span>
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
                        <h2 className="mb-0">Ready to work together?</h2>
                        <p className="fs-5 mb-0 text-opacity-70">
                          Let's discuss your project and see how we can help you achieve your goals.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row justify-content-between gap-7 gap-xl-0">
                <div className="col-xl-3">
                  <p className="mb-0 fs-5" data-aos="fade-right" data-aos-delay="100" data-aos-duration="1000">
                    Ready to start something amazing? Let's collaborate and create something extraordinary together.
                  </p>
                </div>
                <div className="col-xl-8">
                  <div className="d-flex flex-column gap-7" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                    <div className="d-flex gap-4">
                      <button 
                        className="btn btn-primary fs-6 px-4 py-3 hstack justify-content-center gap-2"
                        onClick={() => window.open('https://calendly.com/decorsdigital/30min', '_blank')}
                      >
                        <iconify-icon icon="lucide:calendar" className="fs-6"></iconify-icon>
                        Book a Call
                      </button>
                      <p className="mb-0 text-muted fs-6 d-flex align-items-center">
                        Schedule a 30-minute consultation to discuss your project
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Img Section */}
        <section className="about-img py-5 py-lg-11 py-xl-12">
          <Image
            src="/assets/images/about/about-img.jpg"
            alt="About Us"
            width={1200}
            height={600}
            className="w-100 object-fit-cover"
          />
          <div className="marquee w-100 d-flex align-items-center overflow-hidden bg-primary py-4">
            <div className="marquee-content d-flex align-items-center gap-8">
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Branding</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Web development</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Agency</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Content creation</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">SaaS</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Motion & 3d modeling</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Photography</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Branding</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Web development</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Agency</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Content creation</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">SaaS</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Motion & 3d modeling</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
              <div className="hstack gap-4 flex-shrink-0">
                <h4 className="mb-0">Photography</h4>
                <span className="round-10 bg-dark bg-opacity-10 rounded-circle flex-shrink-0"></span>
              </div>
            </div>
          </div>
        </section>

        {/* Meet our team Section */}
        <section className="meet-our-team py-5 py-lg-11 py-xl-12">
          <div className="container">
            <div className="d-flex flex-column gap-5 gap-xl-11">
              <div className="row gap-7 gap-xl-0">
                <div className="col-xl-4 col-xxl-4">
                  <div
                    className="d-flex align-items-center gap-7 py-2"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">06</span>
                    <hr className="border-line bg-white" />
                    <span className="badge text-bg-dark">The team</span>
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
                        <h2 className="mb-0">Meet our team</h2>
                        <p className="fs-5 mb-0 text-opacity-70">
                          Our team is committed to redefining digital experiences
                          through innovative web solutions while fostering a
                          diverse and collaborative environment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {teamData.map((member, index) => (
                  <div key={member.id} className="col-md-6 col-xl-3 mb-7 mb-xl-0">
                    <div
                      className="meet-team d-flex flex-column gap-4"
                      data-aos="fade-up"
                      data-aos-delay={`${(index + 1) * 100}`}
                      data-aos-duration="1000"
                    >
                      <div className="meet-team-img position-relative overflow-hidden">
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={300}
                          height={400}
                          className="img-fluid w-100"
                        />
                        <div className="meet-team-overlay p-7 d-flex flex-column justify-content-end">
                          <ul className="social list-unstyled mb-0 hstack gap-2 justify-content-end">
                            {member.socialLinks && member.socialLinks.length > 0 ? (
                              member.socialLinks.map((link, linkIndex) => (
                                <li key={linkIndex}>
                                  <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn bg-white p-2 round-45 rounded-circle hstack justify-content-center"
                                  >
                                    <Image
                                      src={`/assets/images/svgs/icon-${link.platform}.svg`}
                                      alt={link.platform}
                                      width={20}
                                      height={20}
                                    />
                                  </a>
                                </li>
                              ))
                            ) : (
                              <li>
                                <span className="btn bg-white p-2 round-45 rounded-circle hstack justify-content-center opacity-50">
                                  <Image
                                    src="/assets/images/svgs/icon-linkedin.svg"
                                    alt="no social"
                                    width={20}
                                    height={20}
                                  />
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                      <div className="meet-team-details">
                        <h4 className="mb-0">{member.name}</h4>
                        <p className="mb-0">{member.position}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Scroll to Top Button */}
      <div className="get-template hstack gap-2 position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1000 }}>
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
    </>
  );
}
