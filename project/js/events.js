// events.js - Handles event listeners and user interactions

/**
 * Sets up all event listeners for the application
 */
export function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Menu toggle for mobile navigation
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Analytics modal
    const viewAnalyticsBtn = document.getElementById('view-analytics');
    if (viewAnalyticsBtn) {
      viewAnalyticsBtn.addEventListener('click', openAnalyticsModal);
    }
    
    // Modal close button
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close modal when clicking outside content
    const modal = document.getElementById('analytics-modal');
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          closeModal();
        }
      });
    }
    
    // Escape key to close modal
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    });
    
    // View all appointments button
    const viewAllAppointmentsBtn = document.getElementById('view-all-appointments');
    if (viewAllAppointmentsBtn) {
      viewAllAppointmentsBtn.addEventListener('click', () => {
        window.location.href = 'appointments.html';
      });
    }
  }
  
  /**
   * Toggles the mobile navigation menu
   */
  function toggleMobileMenu() {
    const nav = document.querySelector('nav');
    const menuToggle = document.getElementById('menu-toggle');
    
    if (nav && menuToggle) {
      nav.classList.toggle('open');
      menuToggle.classList.toggle('active');
      
      // Set aria-expanded attribute for accessibility
      const isExpanded = nav.classList.contains('open');
      menuToggle.setAttribute('aria-expanded', isExpanded);
    }
  }
  
  /**
   * Opens the analytics modal
   */
  function openAnalyticsModal() {
    const modal = document.getElementById('analytics-modal');
    if (modal) {
      modal.classList.add('open');
      document.body.classList.add('modal-open');
    }
  }
  
  /**
   * Closes any open modal
   */
  function closeModal() {
    const modal = document.getElementById('analytics-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.classList.remove('modal-open');
    }
  }