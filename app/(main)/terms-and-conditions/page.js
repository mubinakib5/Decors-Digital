import Image from 'next/image';
import Link from 'next/link';
import AosInit from '../../components/AosInit';
import Footer from '../../components/Footer';

export default function TermsAndConditions() {
  return (
    <>
      <AosInit />
      
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        {/* Banner Section */}
        <section
          className="banner-section banner-inner-section position-relative overflow-hidden d-flex align-items-end"
          style={{
            backgroundImage: "url('/assets/images/backgrounds/terms-banner.jpg')",
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
                    className="d-flex align-items-center gap-2 mb-3"
                    data-aos="fade-up"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    <p className="mb-0 text-white fs-5 text-opacity-70">
                      Understand the
                      <span className="text-primary"> Rules & Guidelines</span>
                      Before Using Our Services
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
                <h1 className="mb-0 fs-15 text-white lh-1">Terms & Conditions</h1>
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

        {/* Terms & Conditions Section */}
        <section className="terms-conditions py-5 py-lg-11">
          <div className="container">
            <p className="fs-5 text-dark fw-medium">
              This <strong>Decor's Digital</strong> Terms of Service
              <span className="fw-bold"> ("Agreement")</span> is entered into by and
              between Decor's Digital
              <span className="fw-bold"> ("Decor's Digital")</span> and the
              entity or person placing an order for or accessing the Services
              <span className="fw-bold"> ("Customer")</span>. This Agreement consists
              of the terms and conditions set forth below and any Order Form. The
              <span className="fw-bold"> "Effective Date"</span> of this Agreement is
              the date which is the earlier of (a) Customer's initial access to
              the Services through any online provisioning, registration or order
              process or (b) the Effective Date of the first Order Form. This
              Agreement will govern Customer's initial purchase on the Effective
              Date as well as any future purchases made by Customer that reference
              this Agreement. Decor's Digital may modify this Agreement
              from time to time as permitted in Section 13.4 (Amendment).
            </p>
            <p className="fs-5 text-dark fw-medium">
              Capitalized terms shall have the meanings set forth in Section 1, or
              in the section where they are first used
            </p>
            <h4 className="my-4">1. Definitions</h4>
            <p className="fs-5 text-dark fw-medium">
              <span className="fw-bold">1.1 "Authorized Devices"</span> means those
              mobile, desktop, or other devices with which the Services can be
              accessed and used.
            </p>
            <p className="fs-5 text-dark fw-medium">
              <span className="fw-bold">1.2 "Content"</span> means code, content,
              fonts, graphics, designs, documents, or materials created using the
              Services by Customer and its Users or imported into the Services by
              Customer and its Users.
            </p>
            <p className="fs-5 text-dark fw-medium">
              <span className="fw-bold">1.3 "Documentation"</span> means the technical
              materials made available by Decor's Digital to Customer
              and/or its Users in hard copy or electronic form describing the use
              and operation of the Services.
            </p>
            <p className="fs-5 text-dark fw-medium">
              <span className="fw-bold">1.4 "Services"</span> Decor's Digital
              proprietary web-based products and services, along with
              downloadable desktop and mobile apps. Each Order Form will identify
              details of Customer's Services subscription.
            </p>
            <p className="fs-5 text-dark fw-medium">
              <span className="fw-bold">1.5 "Order Form"</span> means a document
              signed by both Parties identifying the Enterprise Services to be
              made available by Decor's Digital pursuant to this
              Agreement.
            </p>
            <p className="fs-5 text-dark fw-medium">
              <span className="fw-bold">1.6 "Packages" or "Components"</span> means
              add-on modules made available within the Services. Packages and
              Components may be created by Decor's Digital, Customer or
              other third parties. Packages and Components created by Decor's Digital
              are supported as part of the Services. Decor's Digital
              will use reasonable efforts to support Customer's
              use of Packages and Components created by third parties but
              disclaims all warranties as to such Packages and Components.
            </p>
            <p className="fs-5 text-dark fw-medium">
              <span className="fw-bold">1.7 "User"</span> means an employee,
              contractor or other individual associated with Customer who has been
              provisioned by Customer with access to the Services.
            </p>
            <p className="fs-5 text-dark fw-medium">
              <span className="fw-bold">1.8 "Services"</span> means Decor's Digital
              product, web design software, tools, along with
              downloadable desktop and mobile apps. Each Order Form will identify
              details of Customer's subscription to the Services.
            </p>

            <h4 className="my-4">2. License and use rights</h4>
            <p className="fs-5 text-dark fw-medium">
              <span className="fw-bold">2.1 Services </span> Decor's Digital
              hereby grants Customer a non-exclusive, non-transferable license
              during the Term (as defined in Section 12) to: (a) use the Services
              and to download and install desktop or mobile applications as
              applicable on the number and type of Authorized Devices solely for
              Customer's internal business purposes in accordance with the
              Documentation, and/or (b) use our SaaS product, hosted systems,
              design software, tools, and build websites under the Decor's Digital
              domain. The Services are delivered electronically.
            </p>
            <p className="fs-5 text-dark fw-medium">
              <span className="fw-bold">2.2 Provisioning the Services</span> Decor's Digital
              will provide to Customer the necessary passwords,
              security protocols, policies, network links or connections ("Access
              Protocols") to allow Customer and its Users to access the Services
              as described herein; no other access to the website or servers from
              which the Services are delivered is permitted. Customer will
              provision its Users to access and use the features and functions of
              the Services through the Access Protocols. Customer may select one
              or more Users to act as administrators and control, manage and use
              the Services on Customer's behalf. Customer shall be responsible for
              all acts and omissions of its Users.
            </p>
          </div>
        </section>

        <Footer />
      </div>

      {/* Scroll to Top Button */}
      <div className="get-template hstack gap-2 position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1000 }}>
        <button
          className="btn bg-primary p-2 round-52 rounded-circle hstack justify-content-center flex-shrink-0"
          id="scrollToTopBtn"
          style={{ display: 'none' }}
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
