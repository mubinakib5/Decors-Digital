import Image from 'next/image';
import Link from 'next/link';
import AosInit from './components/AosInit';
import Footer from './components/Footer';

export default function NotFound() {
  return (
    <>
      <AosInit />
      
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        {/* 404 Section */}
        <section className="error-404 py-5 py-lg-11 py-xl-12">
          <div className="container py-3">
            <div className="d-flex flex-column justify-content-center gap-8">
              <Image 
                src="/assets/images/backgrounds/404.svg" 
                alt="404" 
                width={550} 
                height={400}
                className="img-fluid mx-auto"
                data-aos="zoom-in" 
                data-aos-delay="100" 
                data-aos-duration="1000"
              />
              <h2 className="mb-0 text-center" data-aos="fade-up" data-aos-delay="200" data-aos-duration="1000">
                Oops! Page Not Found
              </h2>
              <Link href="/" className="btn mx-auto" data-aos="fade-up" data-aos-delay="300" data-aos-duration="1000">
                <span className="btn-text">Back to Home</span>
                <iconify-icon 
                  icon="lucide:arrow-up-right"
                  className="btn-icon bg-white text-dark round-52 rounded-circle hstack justify-content-center fs-7 shadow-sm"
                ></iconify-icon>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Scroll to Top Button */}
      <div className="get-template hstack gap-2">
        <button 
          className="btn bg-primary p-2 round-52 rounded-circle hstack justify-content-center flex-shrink-0"
          id="scrollToTopBtn"
        >
          <iconify-icon icon="lucide:arrow-up" className="fs-7 text-dark"></iconify-icon>
        </button>
      </div>
    </>
  );
}
