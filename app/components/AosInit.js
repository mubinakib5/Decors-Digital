'use client';
import { useEffect } from 'react';

export default function AosInit() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamic import for AOS
      const initAOS = async () => {
        try {
          const AOS = await import('aos');
          AOS.default.init({ 
            once: true,
            duration: 800,
            easing: 'ease-in-out',
            offset: 100
          });
          
          // Refresh AOS on route changes for Next.js app router
          const handleRouteChange = () => {
            AOS.default.refresh();
          };
          
          // Listen for route changes
          if (window?.next?.router) {
            window.next.router.events.on('routeChangeComplete', handleRouteChange);
          }
          
          // Cleanup function
          return () => {
            if (window?.next?.router) {
              window.next.router.events.off('routeChangeComplete', handleRouteChange);
            }
          };
        } catch (error) {
          console.warn('AOS failed to load:', error);
        }
      };
      
      initAOS();
    }
  }, []);
  
  return null;
}
