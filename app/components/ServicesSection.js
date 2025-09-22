'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { servicesData } from '../data';
import Button from './ui/Button';

export default function ServicesSection() {
  const [activeService, setActiveService] = useState(0);

  const handleServiceClick = (serviceId) => {
    setActiveService(serviceId);
  };

  return (
    <section className="services py-5 py-lg-11 py-xl-12 bg-dark" id="services">
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
                <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">03</span>
                <hr className="border-line bg-white" />
                <span className="badge text-dark bg-white">Services</span>
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
                    <h2 className="mb-0 text-white">What we do</h2>
                    <p className="fs-5 mb-0 text-white text-opacity-70">
                      A glimpse into our creativity—exploring innovative designs, successful collaborations, and transformative digital experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="services-tab">
            <div className="row gap-5 gap-xl-0">
              <div className="col-xl-4">
                <div className="tab-content" data-aos="zoom-in" data-aos-delay="100" data-aos-duration="1000">
                  {servicesData.map((service) => (
                    <div 
                      key={service.id}
                      className={`tab-pane ${activeService === service.id ? 'active' : ''}`} 
                      id={`service-${service.id}`} 
                      role="tabpanel" 
                      aria-labelledby={`service-${service.id}-tab`} 
                      tabIndex={0}
                    >
                      <Image 
                        src={service.image} 
                        alt={service.name} 
                        width={400} 
                        height={400} 
                        className="img-fluid" 
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-xl-8">
                <div className="d-flex flex-column gap-6 gap-lg-8">
                  <ul className="nav nav-tabs" id="myTab" role="tablist" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                    {servicesData.map((service) => (
                      <li key={service.id} className="nav-item py-4 py-lg-6 border-top border-white border-opacity-10 d-flex align-items-start w-100" role="presentation">
                        <div className="row w-100 gx-4 gy-3">
                          <div className="col-12 col-md-5 col-lg-4 col-xl-5">
                            <button 
                              className={`nav-link fs-6 fs-lg-5 fw-bold py-2 px-0 border-0 rounded-0 text-start w-100 ${activeService === service.id ? 'active' : ''}`} 
                              id={`service-${service.id}-tab`} 
                              type="button" 
                              role="tab" 
                              aria-controls={`service-${service.id}`} 
                              aria-selected={activeService === service.id}
                              onClick={() => handleServiceClick(service.id)}
                              style={{ lineHeight: '1.3', whiteSpace: 'normal' }}
                            >
                              {service.name}
                            </button>
                          </div>
                          <div className="col-12 col-md-7 col-lg-8 col-xl-7">
                            <p className="text-white text-opacity-70 mb-0 fs-6" style={{ lineHeight: '1.5' }}>
                              {service.description}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Button 
                      href="/projects" 
                      variant="outline" 
                      className="border-2 border-white border-opacity-30 text-white hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl" 
                      data-aos="fade-up" 
                      data-aos-delay="300" 
                      data-aos-duration="1000"
                    >
                      <span className="btn-text font-semibold">See our Work</span>
                      <iconify-icon icon="lucide:arrow-up-right" className="btn-icon bg-white text-dark round-52 rounded-circle hstack justify-content-center fs-7 shadow-sm transition-all duration-300"></iconify-icon>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
