// Toggle menu for responsive navigation
document.getElementById('menu-button').addEventListener('click', () => {
    document.getElementById('primary-nav').classList.toggle('responsive');
});

// Set current year in footer
document.getElementById('currentyear').textContent = new Date().getFullYear();

// Set last modified date in footer
document.getElementById('lastModified').textContent = 'Last Modified: ' + document.lastModified;