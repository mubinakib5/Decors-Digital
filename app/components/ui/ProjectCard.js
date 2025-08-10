import Link from 'next/link';

const ProjectCard = ({ 
  title, 
  image, 
  tags = [], 
  href, 
  className = '',
  delay = 100 
}) => {
  return (
    <div
      className={`portfolio d-flex flex-column gap-6 ${className}`}
      data-aos="fade-up"
      data-aos-delay={delay}
      data-aos-duration="1000"
    >
      <div className="portfolio-img position-relative overflow-hidden">
        <img
          src={image}
          alt={title}
          className="img-fluid"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <div className="portfolio-overlay">
          <Link
            href={href}
            className="position-absolute top-50 start-50 translate-middle bg-primary round-64 rounded-circle hstack justify-content-center"
          >
            <iconify-icon icon="lucide:arrow-up-right" className="fs-8 text-dark"></iconify-icon>
          </Link>
        </div>
      </div>
      <div className="portfolio-details d-flex flex-column gap-3">
        <h3 className="mb-0">{title}</h3>
        <div className="hstack gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="badge text-dark border">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
