// lazyload.js - Handles lazy loading of images

/**
 * Initialize lazy loading for images
 */
(function() {
    // Check for IntersectionObserver support
    if ('IntersectionObserver' in window) {
      const lazyImages = document.querySelectorAll('.lazy-load');
      
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // If data-src exists, use it
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            
            // Remove lazy-load class
            img.classList.remove('lazy-load');
            
            // Stop observing this image
            observer.unobserve(img);
          }
        });
      });
      
      // Observe each lazy image
      lazyImages.forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      // Load all images immediately
      const lazyImages = document.querySelectorAll('.lazy-load');
      lazyImages.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        img.classList.remove('lazy-load');
      });
    }
  })();