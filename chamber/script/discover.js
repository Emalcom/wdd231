document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch and load the JSON data
    async function loadPlacesData() {
        try {
            const response = await fetch('data/discover.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const placesData = await response.json();
            displayPlaces(placesData);
        } catch (error) {
            console.error('Error loading places data:', error);
            document.querySelector('.discover-grid').innerHTML = '<p class="error-message">Unable to load places data. Please try again later.</p>';
        }
    }

    // Function to create and display the place cards with lazy loading
    function displayPlaces(data) {
        const discoverGrid = document.querySelector('.discover-grid');
        
        // Clear any existing content
        discoverGrid.innerHTML = '';
        
        // Loop through each place and create a card
        data.places.forEach(place => {
            const card = document.createElement('div');
            card.className = 'place-card';
            
            // Create image with lazy loading
            const imgContainer = document.createElement('div');
            imgContainer.className = 'img-container';
            
            const img = document.createElement('img');
            img.setAttribute('data-src', `images/${place.image}`);
            img.setAttribute('alt', place.name);
            img.setAttribute('loading', 'lazy');
            img.className = 'lazy-img';
            
            // Add placeholder before image loads
            img.src = 'images/placeholder.webp';
            
            imgContainer.appendChild(img);
            
            // Create card content
            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';
            
            const h3 = document.createElement('h3');
            h3.textContent = place.name;
            
            const address = document.createElement('p');
            address.className = 'address';
            address.textContent = place.address;
            
            const description = document.createElement('p');
            description.className = 'description';
            description.textContent = place.description;
            
            // Assemble the card
            cardContent.appendChild(h3);
            cardContent.appendChild(address);
            cardContent.appendChild(description);
            
            card.appendChild(imgContainer);
            card.appendChild(cardContent);
            
            // Add the card to the grid
            discoverGrid.appendChild(card);
        });
        
        // Initialize lazy loading after cards are created
        initLazyLoading();
    }
    
    // Function to implement lazy loading
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('.lazy-img');
        
        // Create an intersection observer
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '0px 0px 50px 0px',
            threshold: 0.1
        });
        
        // Observe each lazy image
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // Function to handle visit tracking and messaging
    function handleVisits() {
        const visitMessage = document.getElementById('visit-message');
        
        // Get the last visit timestamp from localStorage
        const lastVisit = localStorage.getItem('lastVisit');
        const currentTime = new Date().getTime();
        
        if (!lastVisit) {
            // First visit
            visitMessage.textContent = 'Welcome! This is your first visit to our Discover page.';
        } else {
            // Calculate time difference in days
            const timeDiff = currentTime - parseInt(lastVisit);
            const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
            
            if (daysDiff < 1) {
                visitMessage.textContent = 'Back so soon! Awesome!';
            } else if (daysDiff === 1) {
                visitMessage.textContent = 'You last visited 1 day ago.';
            } else {
                visitMessage.textContent = `You last visited ${daysDiff} days ago.`;
            }
        }
        
        // Update the last visit timestamp
        localStorage.setItem('lastVisit', currentTime);
    }
    
    // Initialize the page
    loadPlacesData();
    handleVisits();
});