'use client';
import { useEffect, useState } from 'react';

const ScrollToTop = ({ className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`btn bg-primary p-2 round-52 rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 position-fixed bottom-0 end-0 m-4 ${
        isVisible ? 'd-block' : 'd-none'
      } ${className}`}
      style={{ zIndex: 1000 }}
    >
      <iconify-icon icon="lucide:arrow-up" className="fs-7 text-white"></iconify-icon>
    </button>
  );
};

export default ScrollToTop;
