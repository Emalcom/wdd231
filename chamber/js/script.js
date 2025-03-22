document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.querySelector('#hamburgerBtn'); // Hamburger button
    const primaryNav = document.querySelector('#primaryNav'); // Navigation menu

    // Toggle the 'open' class on both the button and menu
    hamburgerBtn.addEventListener('click', function() {
        primaryNav.classList.toggle('open'); // Add/remove 'open' class to menu
        hamburgerBtn.classList.toggle('open'); // Add/remove 'open' class to button
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