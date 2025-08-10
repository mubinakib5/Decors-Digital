import Image from 'next/image';

const TeamCard = ({ 
  name, 
  position, 
  image, 
  socialLinks = [], 
  className = '',
  delay = 100 
}) => {
  const getSocialIcon = (platform) => {
    const iconMap = {
      twitter: '/assets/images/svgs/icon-twitter.svg',
      be: '/assets/images/svgs/icon-be.svg',
      linkedin: '/assets/images/svgs/icon-linkedin.svg'
    };
    return iconMap[platform] || '/assets/images/svgs/icon-twitter.svg';
  };

  return (
    <div
      className={`meet-team d-flex flex-column gap-4 ${className}`}
      data-aos="fade-up"
      data-aos-delay={delay}
      data-aos-duration="1000"
    >
      <div className="meet-team-img position-relative overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={300}
          height={400}
          className="img-fluid w-100"
        />
        <div className="meet-team-overlay p-7 d-flex flex-column justify-content-end">
          <ul className="social list-unstyled mb-0 hstack gap-2 justify-content-end">
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="btn bg-white p-2 round-45 rounded-circle hstack justify-content-center"
                >
                  <Image
                    src={getSocialIcon(link.platform)}
                    alt={link.platform}
                    width={20}
                    height={20}
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="meet-team-details">
        <h4 className="mb-0">{name}</h4>
        <p className="mb-0">{position}</p>
      </div>
    </div>
  );
};

export default TeamCard;
