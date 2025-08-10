import Button from './Button';

const ServiceCard = ({ 
  title, 
  description, 
  icon, 
  href, 
  className = '',
  delay = 100 
}) => {
  return (
    <div
      className={`service-card text-center p-4 ${className}`}
      data-aos="fade-up"
      data-aos-delay={delay}
      data-aos-duration="1000"
    >
      <div className="service-icon mb-4">
        <div className="round-64 bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto">
          <iconify-icon icon={icon} className="text-white fs-1"></iconify-icon>
        </div>
      </div>
      <h4 className="mb-3">{title}</h4>
      <p className="text-muted mb-4">{description}</p>
      <Button href={href} variant="dark">
        Learn More
      </Button>
    </div>
  );
};

export default ServiceCard;
