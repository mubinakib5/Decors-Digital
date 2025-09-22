'use client';

import Footer from "../../components/Footer";
import ScrollToTop from "../../components/ui/ScrollToTop";
import PageBanner from "../../components/ui/PageBanner";
import AosInit from "../../components/AosInit";

const clientLogos = [
  { name: "TechCorp", logo: "/images/clients/techcorp.svg" },
  { name: "GreenLife", logo: "/images/clients/greenlife.svg" },
  { name: "UrbanStyle", logo: "/images/clients/urbanstyle.svg" },
  { name: "FoodieHub", logo: "/images/clients/foodiehub.svg" },
  { name: "HealthPlus", logo: "/images/clients/healthplus.svg" },
  { name: "EduTech", logo: "/images/clients/edutech.svg" },
  { name: "FinanceFirst", logo: "/images/clients/financefirst.svg" },
  { name: "TravelMax", logo: "/images/clients/travelmax.svg" },
]

const caseStudies = [
  {
    title: "TechCorp Digital Transformation",
    client: "TechCorp",
    challenge: "Low online visibility and poor conversion rates",
    solution: "Comprehensive SEO strategy and conversion optimization",
    results: "300% increase in organic traffic, 150% boost in conversions",
    image: "/images/case-studies/techcorp.jpg"
  },
  {
    title: "GreenLife Brand Revamp",
    client: "GreenLife",
    challenge: "Outdated brand identity and inconsistent messaging",
    solution: "Complete brand redesign and content strategy overhaul",
    results: "40% increase in brand recognition, 200% social media growth",
    image: "/images/case-studies/greenlife.jpg"
  },
  {
    title: "UrbanStyle E-commerce Success",
    client: "UrbanStyle",
    challenge: "Low e-commerce sales and poor user experience",
    solution: "UX redesign and targeted paid advertising campaigns",
    results: "500% increase in online sales, 60% improvement in user engagement",
    image: "/images/case-studies/urbanstyle.jpg"
  }
]

const testimonials = [
  {
    name: "Sarah Johnson",
    position: "CEO, TechCorp",
    content: "Decor's Digital transformed our online presence completely. Their strategic approach and attention to detail resulted in remarkable growth for our business.",
    rating: 5
  },
  {
    name: "Michael Chen",
    position: "Marketing Director, GreenLife",
    content: "Working with Decor's Digital was a game-changer. They understood our vision and delivered results beyond our expectations.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    position: "Founder, UrbanStyle",
    content: "The team's creativity and expertise in digital marketing helped us achieve our goals faster than we ever imagined possible.",
    rating: 5
  }
]

export default function ClientsDiary() {
  return (
    <>
      <AosInit />
      
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        <PageBanner
          title="Clients Diary"
          description="Discover how we've helped businesses grow through strategic digital marketing and creative solutions"
          backgroundImage="/assets/images/backgrounds/aboutus-banner.jpg"
        />

        {/* Client Logos Section */}
        <section className="py-5 py-lg-11 py-xl-12 bg-light">
          <div className="container">
            <div className="text-center mb-5 mb-lg-8">
              <h2 className="fs-2 fw-bold text-dark mb-4">Trusted by Leading Brands</h2>
              <p className="fs-5 text-muted">We're proud to work with innovative companies across various industries</p>
            </div>
            
            {/* Infinite Scroll Container */}
            <div className="overflow-hidden position-relative">
              <div className="d-flex align-items-center" style={{
                animation: 'scrollRight 30s linear infinite',
                width: 'max-content'
              }}>
                {/* First set of logos */}
                {clientLogos.map((client, index) => (
                  <div key={`first-${index}`} className="flex-shrink-0 mx-4">
                    <div className="d-flex align-items-center justify-content-center p-4 bg-white rounded shadow-sm" style={{width: '200px', height: '80px'}}>
                      <span className="text-muted fw-medium text-center">{client.name}</span>
                    </div>
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {clientLogos.map((client, index) => (
                  <div key={`second-${index}`} className="flex-shrink-0 mx-4">
                    <div className="d-flex align-items-center justify-content-center p-4 bg-white rounded shadow-sm" style={{width: '200px', height: '80px'}}>
                      <span className="text-muted fw-medium text-center">{client.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* CSS Animation Styles */}
          <style jsx>{`
            @keyframes scrollRight {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }
            
            .overflow-hidden:hover > div {
              animation-play-state: paused;
            }
          `}</style>
        </section>

        {/* Case Studies Section */}
        <section className="py-5 py-lg-11 py-xl-12 bg-white">
          <div className="container">
            <div className="text-center mb-5 mb-lg-10">
              <h2 className="fs-1 fw-bold text-dark mb-4">Success Stories</h2>
              <p className="fs-5 text-muted mx-auto" style={{maxWidth: '32rem'}}>
                Real results from real clients. See how our strategic approach drives measurable growth.
              </p>
            </div>
            <div className="row g-5 g-lg-8">
              {caseStudies.map((study, index) => (
                <div key={index} className="col-12">
                  <div className={`row align-items-center g-4 g-lg-6 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}>
                    <div className="col-lg-6">
                      <div className="bg-light rounded h-100 d-flex align-items-center justify-content-center" style={{minHeight: '16rem'}}>
                        <span className="text-muted">Case Study Image</span>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <h3 className="fs-3 fw-bold text-dark mb-4 mb-lg-6">{study.title}</h3>
                      <div className="d-flex flex-column gap-4 gap-lg-6">
                        <div>
                          <h4 className="fw-semibold text-primary mb-3">Challenge:</h4>
                          <p className="text-muted mb-0">{study.challenge}</p>
                        </div>
                        <div>
                          <h4 className="fw-semibold text-primary mb-3">Solution:</h4>
                          <p className="text-muted mb-0">{study.solution}</p>
                        </div>
                        <div>
                          <h4 className="fw-semibold text-primary mb-3">Results:</h4>
                          <p className="text-muted fw-medium mb-0">{study.results}</p>
                        </div>
                      </div>
                      <button className="btn btn-primary mt-4 mt-lg-5 px-4 py-3 fw-semibold shadow-lg">
                        View Full Case Study
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-5 py-lg-11 py-xl-12 bg-light">
          <div className="container">
            <div className="text-center mb-5 mb-lg-10">
              <h2 className="fs-1 fw-bold text-dark mb-4">What Our Clients Say</h2>
              <p className="fs-5 text-muted">Hear directly from the businesses we've helped transform</p>
            </div>
            <div className="row g-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="col-md-6 col-lg-4">
                  <div className="bg-white rounded p-4 p-lg-5 shadow-lg h-100">
                    <div className="d-flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-primary fs-4">★</span>
                      ))}
                    </div>
                    <p className="text-muted mb-4 mb-lg-5 fst-italic">"{testimonial.content}"</p>
                    <div>
                      <h4 className="fw-bold text-dark mb-1">{testimonial.name}</h4>
                      <p className="small text-muted mb-0">{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-dark text-white py-5 py-lg-11 py-xl-12">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8 col-xl-6 text-center">
                <h2 className="fs-2 fw-bold mb-4 mb-lg-5">Ready to Join Our Success Stories?</h2>
                <p className="fs-5 text-white-50 mb-5 mb-lg-6">
                  Let's create your next success story together. Get in touch to discuss your project.
                </p>
                <div className="d-flex flex-column flex-sm-row gap-3 gap-lg-4 justify-content-center">
                  <button className="btn btn-primary px-5 py-3 fw-bold shadow-lg d-flex align-items-center justify-content-center gap-2">
                    Start Your Project
                    <iconify-icon icon="lucide:arrow-right" className="fs-6"></iconify-icon>
                  </button>
                  <button className="btn btn-outline-light px-4 py-3 fw-medium d-flex align-items-center justify-content-center gap-2">
                    Schedule a Call
                    <iconify-icon icon="lucide:calendar" className="fs-6"></iconify-icon>
                  </button>
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