import Button from './Button';

const DocCard = ({ 
  title, 
  description, 
  icon, 
  href, 
  className = '',
  delay = 100 
}) => {
  return (
    <div
      className={`doc-card p-4 border rounded-4 h-100 ${className}`}
      data-aos="fade-up"
      data-aos-delay={delay}
      data-aos-duration="1000"
    >
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="round-36 bg-primary rounded-circle d-flex align-items-center justify-content-center">
          <iconify-icon icon={icon} className="text-white fs-4"></iconify-icon>
        </div>
        <h4 className="mb-0">{title}</h4>
      </div>
      <p className="mb-3">{description}</p>
      <Button href={href} variant="dark" size="sm">
        Read More
      </Button>
    </div>
  );
};

export default DocCard;
