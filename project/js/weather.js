// weather.js - Handles weather information functionality

// Mock weather data (in a real app, this would come from a weather API)
const weatherConditions = [
    { condition: 'Sunny', emoji: '☀️', temp: '72°F' },
    { condition: 'Partly Cloudy', emoji: '⛅', temp: '68°F' },
    { condition: 'Cloudy', emoji: '☁️', temp: '65°F' },
    { condition: 'Rainy', emoji: '🌧️', temp: '62°F' },
    { condition: 'Thunderstorm', emoji: '⛈️', temp: '60°F' },
    { condition: 'Snowy', emoji: '❄️', temp: '32°F' },
    { condition: 'Foggy', emoji: '🌫️', temp: '58°F' }
  ];
  
  /**
   * Loads weather information and displays it
   * @returns {Promise} A promise that resolves when weather is loaded
   */
  export async function loadWeather() {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        const weatherElement = document.getElementById('weather-info');
        
        if (weatherElement) {
          // Get a random weather condition for demo purposes
          const randomIndex = Math.floor(Math.random() * weatherConditions.length);
          const weather = weatherConditions[randomIndex];
          
          weatherElement.innerHTML = `${weather.emoji} ${weather.condition}, ${weather.temp}`;
        }
        
        resolve();
      }, 500);
    });
  }