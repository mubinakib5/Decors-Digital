import { Metadata } from 'next'
import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ui/ScrollToTop";
import PageBanner from "../../components/ui/PageBanner";
import AosInit from "../../components/AosInit";

export const metadata = {
  title: 'Newsletter - Decor\'s Digital',
  description: 'Subscribe to our newsletter for the latest digital marketing insights, trends, and exclusive content. Access our archive of past editions.',
  keywords: 'newsletter subscription, digital marketing insights, marketing trends, exclusive content, newsletter archive',
  openGraph: {
    title: 'Newsletter - Decor\'s Digital',
    description: 'Subscribe to our newsletter for the latest digital marketing insights, trends, and exclusive content. Access our archive of past editions.',
    type: 'website',
    url: 'https://www.thedecorbd.com/newsletter',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Newsletter - Decor\'s Digital',
    description: 'Subscribe to our newsletter for the latest digital marketing insights, trends, and exclusive content. Access our archive of past editions.',
  },
  alternates: {
    canonical: 'https://www.thedecorbd.com/newsletter',
  },
}

const pastEditions = [
  {
    title: "The Future of Digital Marketing in 2024",
    date: "January 15, 2024",
    description: "Exploring emerging trends, AI integration, and what businesses need to know to stay ahead.",
    topics: ["AI Marketing", "Automation", "Personalization", "Data Privacy"]
  },
  {
    title: "Social Media Strategy Masterclass",
    date: "December 20, 2023",
    description: "Deep dive into platform-specific strategies and content creation best practices.",
    topics: ["Content Strategy", "Platform Optimization", "Engagement", "Analytics"]
  },
  {
    title: "E-commerce Growth Hacks",
    date: "November 28, 2023",
    description: "Proven strategies to boost online sales and improve customer retention.",
    topics: ["Conversion Optimization", "Customer Journey", "Retention", "UX Design"]
  },
  {
    title: "Brand Building in the Digital Age",
    date: "October 30, 2023",
    description: "How to create a strong brand presence across digital channels.",
    topics: ["Brand Identity", "Digital Presence", "Storytelling", "Community Building"]
  },
  {
    title: "SEO Trends and Algorithm Updates",
    date: "September 25, 2023",
    description: "Latest search engine updates and how to adapt your SEO strategy.",
    topics: ["Algorithm Updates", "Technical SEO", "Content Optimization", "Local SEO"]
  },
  {
    title: "Paid Advertising ROI Optimization",
    date: "August 18, 2023",
    description: "Maximizing returns on your advertising spend across all platforms.",
    topics: ["ROI Optimization", "Campaign Management", "Audience Targeting", "Budget Allocation"]
  }
]

export default function Newsletter() {
  return (
    <>
      <AosInit />
      
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        <PageBanner
          title="Newsletter"
          description="Stay ahead with the latest digital marketing insights, trends, and exclusive content delivered to your inbox"
          backgroundImage="/assets/images/backgrounds/newsletter-banner.jpg"
        />

        {/* Newsletter Subscription Section */}
        <section className="py-5 py-lg-11 py-xl-12 bg-light">
          <div className="container">
            <div className="text-center mb-5 mb-lg-8">
              <h2 className="fs-2 fw-bold text-dark mb-4">Subscribe to Our Newsletter</h2>
              <p className="fs-5 text-muted">Get exclusive insights, industry trends, and actionable tips delivered straight to your inbox every month.</p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded shadow-lg p-4 p-md-5">
                <form className="row g-4">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label fw-bold text-dark">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label fw-bold text-dark">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label fw-bold text-dark">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="company" className="form-label fw-bold text-dark">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company"
                      name="company"
                    />
                  </div>
                  <div className="col-12">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="consent"
                        name="consent"
                        required
                      />
                      <label className="form-check-label text-muted" htmlFor="consent">
                        I agree to receive marketing communications from Decor's Digital. You can unsubscribe at any time.
                      </label>
                    </div>
                  </div>
                  <div className="col-12 text-center">
                    <button type="submit" className="btn btn-primary btn-lg px-5">
                      Subscribe Now
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Past Editions Section */}
        <section className="py-5 py-lg-11 py-xl-12 bg-white">
          <div className="container">
            <div className="text-center mb-5 mb-lg-10">
              <h2 className="fs-1 fw-bold text-dark mb-4">Past Editions</h2>
              <p className="fs-5 text-muted mx-auto" style={{maxWidth: '32rem'}}>
                Catch up on our previous newsletters and discover valuable insights you might have missed.
              </p>
            </div>
            <div className="row g-4 g-lg-5">
              {pastEditions.map((edition, index) => (
                <div key={index} className="col-lg-6">
                  <div className="bg-light rounded p-4 p-lg-5 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className="badge bg-primary text-white">{edition.date}</span>
                    </div>
                    <h3 className="fs-4 fw-bold text-dark mb-3">{edition.title}</h3>
                    <p className="text-muted mb-4">{edition.description}</p>
                    <div className="d-flex flex-wrap gap-2 mb-4">
                      {edition.topics.map((topic, topicIndex) => (
                        <span key={topicIndex} className="badge bg-light text-dark border">
                          {topic}
                        </span>
                      ))}
                    </div>
                    <button className="btn btn-outline-primary">
                      Read Edition
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter Benefits Section */}
        <section className="py-5 py-lg-11 py-xl-12 bg-light">
          <div className="container">
            <div className="text-center mb-5 mb-lg-8">
              <h2 className="fs-2 fw-bold text-dark mb-4">Why Subscribe?</h2>
              <p className="fs-5 text-muted">Join thousands of professionals who rely on our insights to stay ahead</p>
            </div>
            
            <div className="row g-4 g-lg-5">
              <div className="col-lg-4">
                <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center bg-primary rounded-circle mx-auto mb-4" style={{width: '4rem', height: '4rem'}}>
                    <span className="text-white fs-4">📊</span>
                  </div>
                  <h3 className="fs-4 fw-bold text-dark mb-3">Exclusive Insights</h3>
                  <p className="text-muted">Get access to industry data and trends not available anywhere else</p>
                </div>
              </div>
              
              <div className="col-lg-4">
                <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center bg-primary rounded-circle mx-auto mb-4" style={{width: '4rem', height: '4rem'}}>
                    <span className="text-white fs-4">🚀</span>
                  </div>
                  <h3 className="fs-4 fw-bold text-dark mb-3">Actionable Tips</h3>
                  <p className="text-muted">Practical strategies you can implement immediately in your business</p>
                </div>
              </div>
              
              <div className="col-lg-4">
                <div className="text-center">
                  <div className="d-flex align-items-center justify-content-center bg-primary rounded-circle mx-auto mb-4" style={{width: '4rem', height: '4rem'}}>
                    <span className="text-white fs-4">⏰</span>
                  </div>
                  <h3 className="fs-4 fw-bold text-dark mb-3">Stay Ahead</h3>
                  <p className="text-muted">Be the first to know about emerging trends and opportunities</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      <ScrollToTop />
    </>
  );
}