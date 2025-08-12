import Image from 'next/image';
import Link from 'next/link';
import AosInit from '../../components/AosInit';
import Footer from '../../components/Footer';

export default function BlogDetail() {
  return (
    <>
      <AosInit />
      
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        {/* Banner Section */}
        <section
          className="banner-section banner-inner-section position-relative overflow-hidden d-flex align-items-end"
          style={{
            backgroundImage: "url('/assets/images/backgrounds/blog-detail-banner.jpg')",
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
                      In a
                      <span className="text-primary">world where standing</span> still
                      means falling behind, we knew it was time for a bold
                      transformation..
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
                <h1 className="mb-0 fs-15 text-white lh-1">
                  A campaign that connects
                </h1>
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

        {/* Blog Detail Section */}
        <section className="blog-detail py-5 py-lg-11 py-xl-12">
          <div className="container">
            <div className="d-flex flex-column gap-7 gap-xl-11">
              <div className="row gap-4 gap-lg-0">
                <div className="col-lg-4">
                  <h2
                    className="fs-13 mb-0"
                    data-aos="fade-right"
                    data-aos-delay="100"
                    data-aos-duration="1000"
                  >
                    Scroll to read
                  </h2>
                </div>
                <div className="col-lg-8">
                  <div
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="1000"
                  >
                    <p className="fs-5 mb-0">
                      At Studiova, we're always evolving, and our latest brand
                      redesign is a bold step forward. This transformation
                      reflects our commitment to innovation and growth, both in
                      how we look and how we connect with you.
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="blog-detail-img"
                data-aos="fade-up"
                data-aos-delay="300"
                data-aos-duration="1000"
              >
                <Image
                  src="/assets/images/backgrounds/blog-detail-img.jpg"
                  alt="blog-detail"
                  width={1200}
                  height={600}
                  className="img-fluid"
                />
              </div>
              <div className="row justify-content-end">
                <div className="col-lg-8">
                  <div
                    data-aos="fade-up"
                    data-aos-delay="400"
                    data-aos-duration="1000"
                  >
                    <p className="fs-5 mb-0">
                      Blogger outreach campaigns are strategic efforts by
                      businesses to collaborate with influential bloggers, aiming
                      to promote products, services, or content to a broader
                      audience. This form of influencer marketing leverages the
                      blogger's established credibility and reach within a
                      specific niche.
                    </p>
                    <p className="fs-5 mb-6">
                      Key Steps to Launch a Successful Blogger Outreach Campaign:
                    </p>
                    <h4>1. Define Your Goals:</h4>
                    <p className="fs-5 mb-6">
                      Clearly outline what you aim to achieve, such as increasing
                      brand awareness, driving website traffic, or boosting
                      product sales.
                    </p>
                    <h4>2. Identify Relevant Bloggers:</h4>
                    <p className="fs-5 mb-6">
                      Research and compile a list of bloggers whose audience
                      aligns with your target demographic. Utilize tools like
                      BuzzSumo to discover key influencers in your industry.
                    </p>
                    <h4>Engage Authentically:</h4>
                    <p className="fs-5 mb-0">
                      Prior to outreach, engage with the bloggers' content by
                      commenting on posts or sharing their articles. This
                      establishes a genuine connection and familiarity.
                    </p>
                    <p className="fs-5 mb-0">
                      Craft Personalized Outreach Messages: Develop tailored
                      emails that acknowledge the blogger's work and propose a
                      mutually beneficial collaboration. Avoid generic templates
                      to increase response rates.
                    </p>
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
