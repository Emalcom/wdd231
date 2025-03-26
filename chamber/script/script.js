document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const primaryNav = document.getElementById('primaryNav');
    
    // Hamburger Menu Toggle
    hamburgerBtn.addEventListener('click', () => {
        primaryNav.classList.toggle('open');
        hamburgerBtn.classList.toggle('open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        const isClickInsideNav = primaryNav.contains(event.target);
        const isClickHamburger = hamburgerBtn.contains(event.target);
        
        if (!isClickInsideNav && !isClickHamburger && 
            primaryNav.classList.contains('open')) {
            primaryNav.classList.remove('open');
            hamburgerBtn.classList.remove('open');
        }
    });

    // Add hover effect to navigation items
    const navItems = document.querySelectorAll('#primaryNav li');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });



    // Get current year for copyright
     const currentYear = document.querySelector('#currentyear');
     if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
     }
    
    // Get last modified date
       const lastModified = document.querySelector('#lastModified');
       if (lastModified) {
       lastModified.textContent = document.lastModified;
    }
    
    // Add additional directory-specific code to the right script file
    // Directory toggle functionality should go in directory.js
   
});