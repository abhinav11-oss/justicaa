import { useEffect } from 'react';
import Lenis from 'lenis';

export const useSmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
      touchMultiplier: 2,
      infinite: false,
    });

    // Function to handle requestAnimationFrame for smooth scrolling
    function raf(time: DOMHighResTimeStamp) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup function to destroy Lenis instance when component unmounts
    return () => {
      lenis.destroy();
    };
  }, []); // Empty dependency array ensures this runs once on mount
};