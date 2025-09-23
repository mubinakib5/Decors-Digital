import AosInit from "@/components/AosInit";
import Footer from "@/components/Footer";
import PageBanner from "@/components/ui/PageBanner";
import ScrollToTop from "@/components/ui/ScrollToTop";

export const metadata = {
  title: "Contact - Decor's Digital | Get In Touch",
  description:
    "Contact Decor's Digital for your digital marketing needs. Visit our office, call us, or send a message. We're here to help transform your brand.",
  keywords:
    "contact, digital marketing agency, Decor's Digital, office address, phone, email, consultation",
  openGraph: {
    title: "Contact - Decor's Digital | Get In Touch",
    description:
      "Contact Decor's Digital for your digital marketing needs. Visit our office, call us, or send a message.",
    type: "website",
    url: "https://www.thedecorbd.com/contact",
    siteName: "Decor's Digital",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact - Decor's Digital | Get In Touch",
    description:
      "Contact Decor's Digital for your digital marketing needs. Visit our office, call us, or send a message.",
  },
  alternates: {
    canonical: "https://www.thedecorbd.com/contact",
  },
};

const contactInfo = {
  office: {
    address: "South Khulshi 2, jannat 8/B, Khulshi, Chittagong",
    phone: "+880 1234-567890",
    email: "hello@thedecorbd.com",
    whatsapp: "+880 1234-567890",
    hours: "Sunday - Thursday: 9:00 AM - 6:00 PM",
  },
  socialMedia: [
    {
      name: "LinkedIn",
      url: "https://linkedin.com/company/decorsdigital",
      icon: "fab fa-linkedin",
    },
    {
      name: "Facebook",
      url: "https://facebook.com/decorsdigital",
      icon: "fab fa-facebook",
    },
    {
      name: "Instagram",
      url: "https://instagram.com/decorsdigital",
      icon: "fab fa-instagram",
    },
    {
      name: "YouTube",
      url: "https://youtube.com/decorsdigital",
      icon: "fab fa-youtube",
    },
  ],
};

export default function Contact() {
  return (
    <>
      <AosInit />

      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        <PageBanner
          title="Let's Connect"
          description="Ready to transform your brand? We're here to listen, understand your goals, and create something extraordinary together."
          backgroundImage="/assets/images/backgrounds/contact-banner.jpg"
        />

        {/* Contact Form & Info Section */}
        <section className="contact-section py-5 py-lg-11 py-xl-12 bg-white">
          <div className="container">
            <div className="row">
              <div className="col-lg-8">
                <div className="contact-form-wrapper bg-soft-white rounded-4 p-5">
                  <h2 className="fw-bold text-deep-charcoal mb-4">
                    Send Us a Message
                  </h2>
                  <form role="form" aria-labelledby="contact-form-heading">
                    <h2 id="contact-form-heading" className="visually-hidden">
                      Contact Form
                    </h2>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label
                          htmlFor="firstName"
                          className="form-label fw-bold text-deep-charcoal"
                        >
                          First Name *
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="form-control form-control-lg"
                          required
                          aria-required="true"
                          aria-describedby="firstName-error"
                        />
                        <div
                          id="firstName-error"
                          className="invalid-feedback"
                          role="alert"
                        ></div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label
                          htmlFor="lastName"
                          className="form-label fw-bold text-deep-charcoal"
                        >
                          Last Name *
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="form-control form-control-lg"
                          required
                          aria-required="true"
                          aria-describedby="lastName-error"
                        />
                        <div
                          id="lastName-error"
                          className="invalid-feedback"
                          role="alert"
                        ></div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label
                          htmlFor="email"
                          className="form-label fw-bold text-deep-charcoal"
                        >
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control form-control-lg"
                          required
                          aria-required="true"
                          aria-describedby="email-error email-help"
                        />
                        <div id="email-help" className="form-text">
                          We'll never share your email with anyone else.
                        </div>
                        <div
                          id="email-error"
                          className="invalid-feedback"
                          role="alert"
                        ></div>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label
                          htmlFor="phone"
                          className="form-label fw-bold text-deep-charcoal"
                        >
                          Phone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="form-control form-control-lg"
                          aria-describedby="phone-help"
                        />
                        <div id="phone-help" className="form-text">
                          Optional - for faster response
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="company"
                        className="form-label fw-bold text-deep-charcoal"
                      >
                        Company/Organization
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        className="form-control form-control-lg"
                        aria-describedby="company-help"
                      />
                      <div id="company-help" className="form-text">
                        Optional - helps us understand your business
                      </div>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="subject"
                        className="form-label fw-bold text-deep-charcoal"
                      >
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        className="form-select form-select-lg"
                        required
                        aria-required="true"
                        aria-describedby="subject-error"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="services">Services & Pricing</option>
                        <option value="partnership">
                          Partnership Opportunity
                        </option>
                        <option value="support">Technical Support</option>
                        <option value="other">Other</option>
                      </select>
                      <div
                        id="subject-error"
                        className="invalid-feedback"
                        role="alert"
                      ></div>
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="message"
                        className="form-label fw-bold text-deep-charcoal"
                      >
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className="form-control form-control-lg"
                        rows="5"
                        required
                        aria-required="true"
                        aria-describedby="message-error message-help"
                        placeholder="Tell us about your project or inquiry..."
                      ></textarea>
                      <div id="message-help" className="form-text">
                        Please provide as much detail as possible
                      </div>
                      <div
                        id="message-error"
                        className="invalid-feedback"
                        role="alert"
                      ></div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg w-100"
                      aria-describedby="submit-help"
                    >
                      <i
                        className="fas fa-paper-plane me-2"
                        aria-hidden="true"
                      ></i>
                      Send Message
                    </button>
                    <div
                      id="submit-help"
                      className="form-text text-center mt-2"
                    >
                      We'll respond within 24 hours
                    </div>
                  </form>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="contact-info-wrapper">
                  <div className="contact-info-card bg-deep-charcoal rounded-4 p-4 text-white mb-4">
                    <h4 className="fw-bold mb-4 text-white">
                      Visit Our Office
                    </h4>
                    <div className="mb-3">
                      <i className="fas fa-map-marker-alt text-primary me-2"></i>
                      <span>{contactInfo.office.address}</span>
                    </div>
                    <div className="mb-3">
                      <i className="fas fa-clock text-primary me-2"></i>
                      <span>{contactInfo.office.hours}</span>
                    </div>
                    <div className="social-links mt-4">
                      <h6 className="fw-bold mb-3 text-white">Follow Us</h6>
                      <div className="d-flex gap-3 justify-content-center">
                        {contactInfo.socialMedia.map((social, index) => (
                          <a
                            key={index}
                            href={social.url}
                            className="btn btn-outline-light d-flex align-items-center justify-content-center text-white social-icon-btn"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              border: "2px solid white",
                              padding: "0",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.3s ease",
                            }}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i
                              className={`${social.icon} text-white social-icon`}
                              style={{ fontSize: "18px", transition: "color 0.3s ease" }}
                            ></i>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="quick-contact bg-soft-white rounded-4 p-4">
                    <h5 className="fw-bold text-deep-charcoal mb-3">
                      Quick Contact
                    </h5>
                    <div className="d-grid gap-2">
                      <a
                        href={`tel:${contactInfo.office.phone}`}
                        className="btn btn-outline-primary"
                      >
                        <i className="fas fa-phone me-2"></i>Call Now
                      </a>
                      <a
                        href={`mailto:${contactInfo.office.email}`}
                        className="btn btn-outline-primary"
                      >
                        <i className="fas fa-envelope me-2"></i>Send Email
                      </a>
                      <a
                        href={`https://wa.me/${contactInfo.office.whatsapp.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        className="btn btn-outline-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-whatsapp me-2"></i>WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="map-section py-5 bg-light-gray">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <h2 className="fw-bold text-deep-charcoal text-center mb-5">
                  Find Us on the Map
                </h2>
                <div className="map-container rounded-4 overflow-hidden shadow">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3689.8472839285!2d91.8093!3d22.3569!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30acd8a64dafa8c3%3A0x5045a6fd3d3a3b2e!2sKhulshi%2C%20Chittagong!5e0!3m2!1sen!2sbd!4v1642000000000!5m2!1sen!2sbd"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Office Location - South Khulshi 2, jannat 8/B, Khulshi, Chittagong"
                  ></iframe>
                </div>
                <div className="text-center mt-4">
                  <p className="text-muted mb-2">
                    <i className="fas fa-map-marker-alt text-primary me-2"></i>
                    {contactInfo.office.address}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      contactInfo.office.address
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    <i className="fas fa-directions me-2"></i>
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section py-5 bg-white">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <h2 className="fw-bold text-deep-charcoal text-center mb-5">
                  Frequently Asked Questions
                </h2>
                <div className="accordion" id="contactFAQ">
                  <div className="accordion-item border-0 mb-3">
                    <h2 className="accordion-header" id="headingOne">
                      <button
                        className="accordion-button collapsed bg-soft-white fw-bold text-deep-charcoal"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq1"
                        aria-expanded="false"
                        aria-controls="faq1"
                      >
                        How quickly do you respond to inquiries?
                      </button>
                    </h2>
                    <div
                      id="faq1"
                      className="accordion-collapse collapse"
                      data-bs-parent="#contactFAQ"
                      aria-labelledby="headingOne"
                    >
                      <div className="accordion-body bg-soft-white text-muted">
                        We typically respond to all inquiries within 24 hours
                        during business days. For urgent matters, feel free to
                        call us directly or reach out via WhatsApp.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item border-0 mb-3">
                    <h2 className="accordion-header" id="headingTwo">
                      <button
                        className="accordion-button collapsed bg-soft-white fw-bold text-deep-charcoal"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq2"
                        aria-expanded="false"
                        aria-controls="faq2"
                      >
                        Do you offer free consultations?
                      </button>
                    </h2>
                    <div
                      id="faq2"
                      className="accordion-collapse collapse"
                      data-bs-parent="#contactFAQ"
                      aria-labelledby="headingTwo"
                    >
                      <div className="accordion-body bg-soft-white text-muted">
                        Yes, we offer a complimentary 30-minute consultation to
                        discuss your project goals and how we can help achieve
                        them.
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item border-0 mb-3">
                    <h2 className="accordion-header" id="headingThree">
                      <button
                        className="accordion-button collapsed bg-soft-white fw-bold text-deep-charcoal"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#faq3"
                        aria-expanded="false"
                        aria-controls="faq3"
                      >
                        What information should I include in my message?
                      </button>
                    </h2>
                    <div
                      id="faq3"
                      className="accordion-collapse collapse"
                      data-bs-parent="#contactFAQ"
                      aria-labelledby="headingThree"
                    >
                      <div className="accordion-body bg-soft-white text-muted">
                        Please include details about your business, project
                        goals, timeline, and budget range. The more information
                        you provide, the better we can tailor our response to
                        your needs.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-5 py-lg-11 py-xl-12 bg-primary">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <h2 className="display-4 fw-bold text-white mb-4">
                  Ready to Start Your Project?
                </h2>
                <p className="lead text-white mb-5">
                  Let's schedule a call to discuss your goals and how we can
                  help bring your vision to life.
                </p>
                <button className="btn btn-lg px-5 py-3 fw-bold shadow d-flex align-items-center gap-2 mx-auto" style={{backgroundColor: 'white !important', color: 'var(--decor-red) !important', border: '2px solid white !important'}}>
                  Schedule a Free Consultation
                  <iconify-icon
                    icon="lucide:calendar"
                    className="fs-6"
                    style={{color: 'var(--decor-red) !important'}}
                  ></iconify-icon>
                </button>
              </div>
            </div>
          </div>
        </section>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
