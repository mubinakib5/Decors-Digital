'use client';

import { CALENDLY_URL } from '../constants';

export default function GetInTouchSection() {
  const handleBookCall = () => {
    // Open Calendly in a new window/tab
    window.open(CALENDLY_URL, '_blank');
  };

  return (
    <section className="get-in-touch py-5 py-lg-11 py-xl-12">
      <div className="container">
        <div className="d-flex flex-column gap-5 gap-xl-10">
          <div className="row gap-7 gap-xl-0">
            <div className="col-xl-4 col-xxl-4">
              <div className="d-flex align-items-center gap-7 py-2" data-aos="fade-right" data-aos-delay="100" data-aos-duration="1000">
                <span className="round-36 flex-shrink-0 text-dark rounded-circle bg-primary hstack justify-content-center fw-medium">10</span>
                <hr className="border-line bg-white" />
                <span className="badge text-bg-dark">Contact us</span>
              </div>
            </div>
            <div className="col-xl-8 col-xxl-7">
              <div className="row">
                <div className="col-xxl-8">
                  <div className="d-flex flex-column gap-6" data-aos="fade-up" data-aos-delay="100" data-aos-duration="1000">
                    <h2 className="mb-0">Get in touch</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row justify-content-between gap-7 gap-xl-0">
            <div className="col-xl-3">
              <p className="mb-0 fs-5" data-aos="fade-right" data-aos-delay="100" data-aos-duration="1000">
                Let's collaborate and create something amazing! Tell us about your project—We're all ears.
              </p>
            </div>
            <div className="col-xl-8">
              <div className="d-flex flex-column gap-7" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                <div className="d-flex gap-4">
                  <button 
                    className="btn btn-primary fs-6 px-4 py-3 hstack justify-content-center gap-2"
                    onClick={handleBookCall}
                  >
                    <iconify-icon icon="lucide:calendar" className="fs-6"></iconify-icon>
                    Book a Call
                  </button>
                  <p className="mb-0 text-muted fs-6 d-flex align-items-center">
                    Schedule a 30-minute consultation to discuss your project
                  </p>
                </div>
                <div className="border-top pt-4">
                  <p className="mb-3 fs-6 text-muted">Or send us a message directly:</p>
                  <form className="d-flex flex-column gap-4">
                    <div>
                      <input type="text" className="form-control border-bottom border-dark" id="formGroupExampleInput" placeholder="Name" />
                    </div>
                    <div>
                      <input type="email" className="form-control border-bottom border-dark" id="exampleInputEmail1" placeholder="Email" aria-describedby="emailHelp" />
                    </div>
                    <div>
                      <textarea className="form-control border-bottom border-dark" id="exampleFormControlTextarea1" placeholder="Tell us about your project" rows={3}></textarea>
                    </div>
                    <button type="submit" className="btn w-100 justify-content-center">
                      <span className="btn-text">Submit message</span>
                      <iconify-icon icon="lucide:arrow-up-right" className="btn-icon bg-white text-dark round-52 rounded-circle hstack justify-content-center fs-7 shadow-sm"></iconify-icon>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
