import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    const scrollToTopNow = () => {
      window.scrollTo(0, 0);
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, etc.
    };
    
    // Execute immediately
    scrollToTopNow();
    
    // Also execute with a slight delay to ensure it happens after rendering
    const timeoutId = setTimeout(scrollToTopNow, 100);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);
  
  return null;
}

export default ScrollToTop;