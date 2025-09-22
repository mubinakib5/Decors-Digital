import Image from 'next/image';

const PageBanner = ({ 
  title, 
  description, 
  backgroundImage, 
  isVideo = false,
  className = '',
  children 
}) => {
  return (
    <section
      className={`banner-section banner-inner-section position-relative overflow-hidden d-flex align-items-end ${className}`}
      style={{
        backgroundImage: !isVideo ? `url('${backgroundImage}')` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '60vh'
      }}
    >
      {isVideo && (
        <video
          className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={backgroundImage} type="video/mp4" />
        </video>
      )}
      
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
                  {description}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`d-flex align-items-end gap-3 ${className?.includes('text-center') ? 'justify-content-center' : ''}`}
            data-aos="fade-up"
            data-aos-delay="200"
            data-aos-duration="1000"
          >
            <h1 className="mb-0 fs-16 text-white lh-1">{title}</h1>
            {!className?.includes('text-center') && (
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
            )}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
};

export default PageBanner;
