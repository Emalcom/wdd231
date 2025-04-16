// darkMode.js - Handles dark mode functionality

/**
 * Initialize dark mode toggle functionality
 */
export function initializeDarkMode() {
    console.log('Initializing dark mode...');
    
    const modeToggle = document.getElementById('mode-switch');
    const modeIcon = document.querySelector('.mode-icon');
    
    if (!modeToggle || !modeIcon) {
      console.warn('Dark mode toggle elements not found');
      return;
    }
    
    // Check for saved preference
    const savedMode = localStorage.getItem('meditrack-mode');
    
    // Check system preference if no saved preference
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial mode
    if (savedMode === 'dark' || (savedMode === null && prefersDarkMode)) {
      document.body.classList.add('dark-mode');
      modeIcon.textContent = '🌙';
    } else {
      document.body.classList.remove('dark-mode');
      modeIcon.textContent = '☀️';
    }
    
    // Toggle mode on button click
    modeToggle.addEventListener('click', () => {
      const isDarkMode = document.body.classList.toggle('dark-mode');
      
      // Update icon
      modeIcon.textContent = isDarkMode ? '🌙' : '☀️';
      
      // Save preference
      localStorage.setItem('meditrack-mode', isDarkMode ? 'dark' : 'light');
      
      // Announce change for screen readers
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.className = 'sr-only';
      announcement.textContent = `Switched to ${isDarkMode ? 'dark' : 'light'} mode`;
      document.body.appendChild(announcement);
      
      // Remove announcement after it's been read
      setTimeout(() => {
        if (announcement.parentNode) {
          announcement.parentNode.removeChild(announcement);
        }
      }, 3000);
    });
    
    // Listen for system preference changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only apply if user hasn't set a preference
        if (localStorage.getItem('meditrack-mode') === null) {
          const shouldBeDark = e.matches;
          document.body.classList.toggle('dark-mode', shouldBeDark);
          modeIcon.textContent = shouldBeDark ? '🌙' : '☀️';
        }
      });
    }
  }