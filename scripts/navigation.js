// Common JavaScript functions for all pages

// Toggle menu for responsive navigation
document.getElementById('hamburgerBtn').addEventListener('click', () => {
    document.getElementById('primaryNav').classList.toggle('responsive');
    
    // Toggle between hamburger and X icons
    const spans = document.querySelectorAll('#hamburgerBtn span');
    spans.forEach(span => {
        span.style.display = span.style.display === 'none' ? 'inline' : 'none';
    });
    
    // Initialize on page load - show hamburger, hide X
    if (!document.getElementById('primaryNav').classList.contains('responsive')) {
        spans[0].style.display = 'inline';
        spans[1].style.display = 'none';
    } else {
        spans[0].style.display = 'none';
        spans[1].style.display = 'inline';
    }
});

// Initialize hamburger menu icons
window.addEventListener('load', () => {
    const spans = document.querySelectorAll('#hamburgerBtn span');
    spans[0].style.display = 'inline';
    spans[1].style.display = 'none';
});

// Set current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear() + " Chamber of Commerce | Malcom Engwedu | WDD 231";

// Set last modified date in footer
document.getElementById('lastModified').textContent = document.lastModified;