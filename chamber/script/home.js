// home.js - Handles dynamic content for Chamber of Commerce home page
const membersData = {
    "businesses": [
        {
            "name": "Riverdale Community Bank",
            "address": "123 Main Street, Riverdale, ST 12345",
            "phone": "(555) 123-4567",
            "website": "https://www.riverdalebank.com",
            "image": "bank-building.jpg",
            "membershipLevel": 3,
            "description": "Providing banking services to the Riverdale community for over 50 years."
        },
        {
            "name": "Tech Innovations Inc.",
            "address": "456 Innovation Parkway, Riverdale, ST 12345",
            "phone": "(555) 987-6543",
            "website": "https://www.techinnovations.com",
            "image": "technology.jpg",
            "membershipLevel": 3,
            "description": "Leading provider of technology solutions for small businesses."
        },
        {
            "name": "Riverdale Coffee House",
            "address": "789 Oak Avenue, Riverdale, ST 12345",
            "phone": "(555) 456-7890",
            "website": "https://www.riverdalecoffee.com",
            "image": "coffee-shop.jpg",
            "membershipLevel": 2,
            "description": "Locally sourced coffee and pastries in a cozy atmosphere."
        },
        {
            "name": "Smith & Associates Law Firm",
            "address": "321 Legal Lane, Riverdale, ST 12345",
            "phone": "(555) 234-5678",
            "website": "https://www.smithlawfirm.com",
            "image": "legal-justices.jpg",
            "membershipLevel": 2,
            "description": "Expert legal services for businesses and individuals."
        }
    ]
};

// Function to capitalize first letter of each word
function capitalizeWords(str) {
    return str.replace(/\b\w/g, char => char.toUpperCase());
}

// Weather API Function with error handling
async function fetchWeather() {
    // IMPORTANT: Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
    const apiKey = 'YOUR_ACTUAL_OPENWEATHERMAP_API_KEY'; // <-- Replace this
    const city = 'Riverdale';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Weather data fetch failed');
        }
        const data = await response.json();

        // Safely access nested properties
        const currentWeather = data.list?.[0];
        if (!currentWeather) {
            throw new Error('No weather data available');
        }

        const currentTemp = Math.round(currentWeather.main?.temp || 0);
        const weatherDescription = capitalizeWords(currentWeather.weather?.[0]?.description || 'Unknown');
        const weatherIcon = currentWeather.weather?.[0]?.icon || '01d';

        // Update UI elements with safe checks
        const temperatureEl = document.getElementById('temperature');
        const descriptionEl = document.getElementById('weather-description');
        const iconEl = document.getElementById('weather-icon');

        if (temperatureEl) temperatureEl.textContent = `${currentTemp}°F`;
        if (descriptionEl) descriptionEl.textContent = weatherDescription;
        if (iconEl) iconEl.src = `https://openweathermap.org/img/wn/${weatherIcon}@2x.png`;

        // 3-Day Forecast
        const forecastContainer = document.getElementById('forecast-container');
        if (forecastContainer) {
            forecastContainer.innerHTML = ''; // Clear previous forecast

            // Select forecast for next 3 days at noon
            const forecastDays = data.list
                .filter(reading => reading.dt_txt.includes('12:00:00'))
                .slice(0, 3);

            forecastDays.forEach(day => {
                const forecastTemp = Math.round(day.main?.temp || 0);
                const forecastDate = new Date(day.dt * 1000);
                const dayName = forecastDate.toLocaleDateString('en-US', { weekday: 'short' });

                const forecastElement = document.createElement('div');
                forecastElement.classList.add('forecast-day');
                forecastElement.innerHTML = `
                    <p class="forecast-date">${dayName}</p>
                    <p class="forecast-temp">${forecastTemp}°F</p>
                `;
                forecastContainer.appendChild(forecastElement);
            });
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        const temperatureEl = document.getElementById('temperature');
        const descriptionEl = document.getElementById('weather-description');
        
        if (temperatureEl) temperatureEl.textContent = 'N/A';
        if (descriptionEl) descriptionEl.textContent = 'Weather unavailable';
    }
}

// Function to display random business spotlights
function displaySpotlights() {
    const spotlightsContainer = document.getElementById('spotlights-container');
    if (!spotlightsContainer) return;

    spotlightsContainer.innerHTML = ''; // Clear previous spotlights

    // Filter gold and silver members
    const eligibleMembers = membersData.businesses.filter(
        member => member.membershipLevel >= 2
    );

    // Randomly select 2-3 members
    const numSpotlights = Math.min(
        Math.floor(Math.random() * 2) + 2, 
        eligibleMembers.length
    );

    const selectedMembers = eligibleMembers
        .sort(() => 0.5 - Math.random())
        .slice(0, numSpotlights);

    selectedMembers.forEach(member => {
        const spotlightCard = document.createElement('div');
        spotlightCard.classList.add('spotlight-card');
        spotlightCard.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} logo" class="spotlight-logo">
            <h3 class="spotlight-name">${member.name}</h3>
            <p>${member.description}</p>
            <div class="member-contact">
                <p class="spotlight-contact">${member.address}</p>
                <p class="spotlight-contact">${member.phone}</p>
                <a href="${member.website}" target="_blank" class="spotlight-website">Visit Website</a>
                <p class="spotlight-membership">
                    Membership Level: ${member.membershipLevel === 3 ? 'Gold' : 'Silver'}
                </p>
            </div>
        `;
        spotlightsContainer.appendChild(spotlightCard);
    });
}

// Initialize dynamic content when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    displaySpotlights();
});