'use client';
import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadLinks = [
      '/assets/images/logos/logo-dark.png',
      '/assets/images/logos/logo-white.png',
      '/assets/images/backgrounds/banner-video.mp4',
    ];

    preloadLinks.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = href.includes('.mp4') ? 'video' : 'image';
      link.href = href;
      document.head.appendChild(link);
    });

    // Preconnect to external domains
    const preconnectDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://code.jquery.com',
      'https://cdn.jsdelivr.net',
    ];

    preconnectDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      document.head.appendChild(link);
    });

    // DNS prefetch for analytics and external services
    const dnsPrefetchDomains = [
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://calendly.com',
    ];

    dnsPrefetchDomains.forEach((domain) => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });

    // Lazy load images
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });
    }

    // Service Worker registration for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }

    // Performance monitoring
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
          
          // Send to analytics if needed
          if (window.gtag) {
            window.gtag('event', 'timing_complete', {
              name: 'load',
              value: Math.round(loadTime),
            });
          }
        }, 0);
      });
    }

    // Cleanup function
    return () => {
      // Clean up any observers or listeners if needed
    };
  }, []);

  return null; // This component doesn't render anything
};

export default PerformanceOptimizer;
