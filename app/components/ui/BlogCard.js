import Image from 'next/image';
import Link from 'next/link';

const BlogCard = ({ 
  title, 
  date, 
  image, 
  slug, 
  className = '',
  delay = 100 
}) => {
  return (
    <div
      className={`resources d-flex flex-column gap-6 ${className}`}
      data-aos="fade-up"
      data-aos-delay={delay}
      data-aos-duration="1000"
    >
      <Link
        href={`/blog/${slug}`}
        className="resources-img resources-img-blog position-relative overflow-hidden d-block"
      >
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className="img-fluid"
        />
      </Link>
      <div className="resources-details">
        <p className="mb-0">{date}</p>
        <h4 className="mb-0">{title}</h4>
      </div>
    </div>
  );
};

export default BlogCard;
