'use client';
import { useEffect } from 'react';

export default function OwlCarouselInit() {
  useEffect(() => {
    // Function to initialize Owl Carousel
    const initOwlCarousel = () => {
      console.log('Initializing Owl Carousel...');
      
      if (typeof window !== 'undefined' && window.jQuery && window.jQuery.fn.owlCarousel) {
        console.log('jQuery and Owl Carousel are available');
        
        // Initialize featured projects slider
        const featuredSlider = window.jQuery('.featured-projects-slider .owl-carousel');
        if (featuredSlider.length > 0) {
          console.log('Found featured projects slider, initializing...');
          try {
            featuredSlider.owlCarousel({
              center: true,
              loop: true,
              margin: 30,
              nav: false,
              dots: false,
              autoplay: true,
              autoplayTimeout: 5000,
              autoplayHoverPause: false,
              responsive: {
                0: { items: 1 },
                600: { items: 2 },
                1000: { items: 3 },
                1200: { items: 4 }
              }
            });
            console.log('Featured projects slider initialized successfully');
          } catch (error) {
            console.error('Error initializing featured projects slider:', error);
          }
        } else {
          console.log('Featured projects slider not found');
        }

        // Initialize other carousels if they exist
        const otherCarousels = window.jQuery('.owl-carousel').not('.featured-projects-slider .owl-carousel');
        if (otherCarousels.length > 0) {
          console.log('Found other carousels, initializing...');
          try {
            otherCarousels.owlCarousel({
              loop: true,
              margin: 30,
              nav: true,
              dots: true,
              autoplay: true,
              autoplayTimeout: 5000,
              autoplayHoverPause: true,
              responsive: {
                0: { items: 1 },
                768: { items: 2 },
                992: { items: 3 }
              }
            });
            console.log('Other carousels initialized successfully');
          } catch (error) {
            console.error('Error initializing other carousels:', error);
          }
        }
      } else {
        console.log('jQuery or Owl Carousel not available yet');
        if (typeof window !== 'undefined') {
          console.log('jQuery available:', !!window.jQuery);
          if (window.jQuery) {
            console.log('Owl Carousel available:', !!window.jQuery.fn.owlCarousel);
          }
        }
      }
    };

    // Fallback initialization after a delay
    const fallbackInit = () => {
      console.log('Running fallback initialization...');
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.jQuery) {
          const featuredSlider = window.jQuery('.featured-projects-slider .owl-carousel');
          if (featuredSlider.length > 0 && !featuredSlider.hasClass('owl-loaded')) {
            console.log('Attempting fallback initialization for featured slider');
            try {
              featuredSlider.owlCarousel({
                center: true,
                loop: true,
                margin: 30,
                nav: false,
                dots: false,
                autoplay: true,
                autoplayTimeout: 5000,
                autoplayHoverPause: false,
                responsive: {
                  0: { items: 1 },
                  600: { items: 2 },
                  1000: { items: 3 },
                  1200: { items: 4 }
                }
              });
              console.log('Fallback initialization successful');
            } catch (error) {
              console.error('Fallback initialization failed:', error);
            }
          }
        }
      }, 2000);
    };

    // Check if jQuery is already loaded
    if (typeof window !== 'undefined' && window.jQuery) {
      console.log('jQuery already loaded, initializing immediately');
      initOwlCarousel();
      fallbackInit();
    } else {
      console.log('jQuery not loaded yet, waiting...');
      // Wait for jQuery to be available
      const checkJQuery = setInterval(() => {
        if (typeof window !== 'undefined' && window.jQuery) {
          console.log('jQuery loaded, initializing carousel');
          clearInterval(checkJQuery);
          initOwlCarousel();
          fallbackInit();
        }
      }, 100);

      // Cleanup interval after 10 seconds to prevent infinite checking
      setTimeout(() => {
        clearInterval(checkJQuery);
        console.log('Timeout reached, stopping jQuery check');
        fallbackInit();
      }, 10000);
    }
  }, []);

  return null;
}
