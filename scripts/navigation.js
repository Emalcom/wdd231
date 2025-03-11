document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menu-button');
    const primaryNav = document.getElementById('primary-nav');
    
    menuButton.addEventListener('click', () => {
      primaryNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', 
        menuButton.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
      );
    });
    
    // Add wayfinding - Highlight the current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
      if (link.getAttribute('href') === currentPath.split('/').pop()) {
        link.classList.add('active');
      } else if (currentPath.split('/').pop() === '' && link.getAttribute('href') === 'index.html') {
        link.classList.add('active');
      }
    });
  });