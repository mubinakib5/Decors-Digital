'use client';
import { useState } from 'react';
import { faqData } from '../data';

export default function FaqSection() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (faqId) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  return (
    <section className="faq py-5 py-lg-11 py-xl-12">
      <div className="container">
        <div className="d-flex flex-column gap-5 gap-xl-11">
          <div className="row gap-7 gap-xl-0">
            <div className="col-xl-4 col-xxl-4">
              <div className="d-flex align-items-center gap-7 py-2" data-aos="fade-right" data-aos-delay="100" data-aos-duration="1000">
                <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">08</span>
                <hr className="border-line bg-white" />
                <span className="badge text-bg-dark">FAQs</span>
              </div>
            </div>
            <div className="col-xl-8 col-xxl-7">
              <div className="row">
                <div className="col-xxl-9">
                  <div className="d-flex flex-column gap-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
                    <h2 className="mb-0">Frequently asked questions</h2>
                    <p className="fs-5 mb-0 text-opacity-70">
                      Discover how we tailor our solutions to meet unique needs, delivering impactful strategies, personalized branding, and exceptional customer experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-end">
            <div className="col-xl-8">
              <div className="accordion accordion-flush" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                {faqData.map((faq, index) => (
                  <div key={faq.id} className={`accordion-item ${index === faqData.length - 1 ? 'border-bottom' : ''}`}>
                    <h2 className="accordion-header">
                      <button 
                        className={`accordion-button ${openFaq === faq.id ? '' : 'collapsed'} fs-8 fw-bold`}
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        aria-expanded={openFaq === faq.id}
                        aria-controls={`faq-collapse-${faq.id}`}
                      >
                        {faq.question}
                      </button>
                    </h2>
                    <div 
                      id={`faq-collapse-${faq.id}`}
                      className={`accordion-collapse ${openFaq === faq.id ? 'show' : 'collapse'}`}
                    >
                      <div className="accordion-body pt-0 fs-5 text-dark">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
