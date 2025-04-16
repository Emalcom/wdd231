// Import necessary modules
import { fetchAppointments } from './appointments.js';
import { fetchPatients } from './patients.js';
import { fetchStatistics } from './statistics.js';
import { createDepartmentChart, loadDetailedAnalytics } from './charts.js';
import { getWeatherData } from './weather.js';

// DOM loaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initializeDateDisplay();
    initializeModeToggle();
    initializeMenuToggle();
    initializeAppointments();
    initializePatients();
    initializeStatistics();
    initializeDepartmentChart();
    initializeModals();
    initializeWeather();
});

// Display current date in the welcome banner
function initializeDateDisplay() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// Dark/light mode toggle functionality
function initializeModeToggle() {
    const modeToggleBtn = document.getElementById('mode-switch');
    const modeIcon = modeToggleBtn.querySelector('.mode-icon');
    
    // Check for saved user preference
    const savedMode = localStorage.getItem('preferredColorMode');
    if (savedMode === 'dark') {
        document.body.classList.add('dark-mode');
        modeIcon.textContent = '🌙';
    }
    
    modeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        // Update icon
        if (document.body.classList.contains('dark-mode')) {
            modeIcon.textContent = '🌙';
            localStorage.setItem('preferredColorMode', 'dark');
        } else {
            modeIcon.textContent = '☀️';
            localStorage.setItem('preferredColorMode', 'light');
        }
    });
}

// Mobile menu toggle functionality
function initializeMenuToggle() {
    const menuToggleBtn = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('nav .main-nav');
    
    menuToggleBtn.addEventListener('click', () => {
        menuToggleBtn.classList.toggle('active');
        navMenu.classList.toggle('expanded');
    });
}

// Initialize today's appointments section
function initializeAppointments() {
    const appointmentsList = document.getElementById('today-appointments');
    const viewAllBtn = document.getElementById('view-all-appointments');
    
    if (appointmentsList) {
        // Fetch and display today's appointments
        fetchAppointments()
            .then(appointments => {
                if (appointments.length === 0) {
                    appointmentsList.innerHTML = '<li class="no-data">No appointments scheduled for today</li>';
                    return;
                }
                
                appointmentsList.innerHTML = '';
                
                // Display only the first 5 appointments
                appointments.slice(0, 5).forEach(appointment => {
                    const appointmentItem = document.createElement('li');
                    appointmentItem.className = 'appointment-item';
                    
                    appointmentItem.innerHTML = `
                        <div class="appointment-time">${appointment.time}</div>
                        <div class="appointment-info">
                            <span class="patient-name">${appointment.patientName}</span>
                            <span class="appointment-type">${appointment.type}</span>
                        </div>
                        <div class="appointment-status ${appointment.status.toLowerCase()}">${appointment.status}</div>
                    `;
                    
                    appointmentsList.appendChild(appointmentItem);
                });
            })
            .catch(error => {
                console.error('Error loading appointments:', error);
                appointmentsList.innerHTML = '<li class="error-message">Failed to load appointments</li>';
            });
    }
    
    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            window.location.href = 'appointments.html';
        });
    }
}

// Initialize recent patients section
function initializePatients() {
    const patientsList = document.getElementById('recent-patients');
    
    if (patientsList) {
        // Fetch and display recent patients
        fetchPatients()
            .then(patients => {
                if (patients.length === 0) {
                    patientsList.innerHTML = '<li class="no-data">No recent patients</li>';
                    return;
                }
                
                patientsList.innerHTML = '';
                
                // Display only the first 5 patients
                patients.slice(0, 5).forEach(patient => {
                    const patientItem = document.createElement('li');
                    patientItem.className = 'patient-item';
                    
                    patientItem.innerHTML = `
                        <div class="patient-avatar">
                            <img src="${patient.avatar || 'images/default-avatar.png'}" alt="${patient.name}" class="lazy-load">
                        </div>
                        <div class="patient-info">
                            <span class="patient-name">${patient.name}</span>
                            <span class="patient-details">${patient.age} yrs | ${patient.condition}</span>
                        </div>
                        <div class="patient-actions">
                            <button class="view-patient-btn" data-patient-id="${patient.id}">View</button>
                        </div>
                    `;
                    
                    patientsList.appendChild(patientItem);
                });
                
                // Add event listeners for view patient buttons
                document.querySelectorAll('.view-patient-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const patientId = e.target.dataset.patientId;
                        window.location.href = `patient-details.html?id=${patientId}`;
                    });
                });
            })
            .catch(error => {
                console.error('Error loading patients:', error);
                patientsList.innerHTML = '<li class="error-message">Failed to load patients</li>';
            });
    }
}

// Initialize patient statistics counters
function initializeStatistics() {
    const newPatientsEl = document.getElementById('new-patients');
    const returningPatientsEl = document.getElementById('returning-patients');
    const totalPatientsEl = document.getElementById('total-patients');
    
    if (newPatientsEl && returningPatientsEl && totalPatientsEl) {
        fetchStatistics()
            .then(stats => {
                // Animate counter for new patients
                animateCounter(newPatientsEl, 0, stats.newPatients);
                
                // Animate counter for returning patients
                animateCounter(returningPatientsEl, 0, stats.returningPatients);
                
                // Animate counter for total patients
                animateCounter(totalPatientsEl, 0, stats.totalPatients);
            })
            .catch(error => {
                console.error('Error loading statistics:', error);
                newPatientsEl.textContent = 'Error';
                returningPatientsEl.textContent = 'Error';
                totalPatientsEl.textContent = 'Error';
            });
    }
}

// Animation for statistics counters
function animateCounter(element, start, end) {
    const duration = 1500; // ms
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const currentCount = Math.round(start + (end - start) * progress);
        
        element.textContent = currentCount.toString();
        
        if (frame === totalFrames) {
            clearInterval(counter);
        }
    }, frameDuration);
}

// Initialize department utilization chart
function initializeDepartmentChart() {
    const chartContainer = document.getElementById('department-chart');
    
    if (chartContainer) {
        createDepartmentChart(chartContainer);
    }
    
    // Add event listener for the analytics button
    const analyticsBtn = document.getElementById('view-analytics');
    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', () => {
            const analyticsModal = document.getElementById('analytics-modal');
            analyticsModal.classList.add('active');
            
            // Load detailed analytics content
            const analyticsContainer = document.getElementById('detailed-analytics');
            loadDetailedAnalytics(analyticsContainer);
        });
    }
}

// Initialize modals
function initializeModals() {
    // Get all modals
    const modals = document.querySelectorAll('.modal');
    
    // Get all close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // Add event listener to all close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            modals.forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // Close modal when clicking outside content
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// Initialize weather information
function initializeWeather() {
    const weatherElement = document.getElementById('weather-info');
    
    if (weatherElement) {
        // Get user's location for weather data (if supported)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Fetch weather data based on coordinates
                    getWeatherData(latitude, longitude)
                        .then(data => {
                            weatherElement.textContent = `${data.temperature}°C | ${data.condition}`;
                        })
                        .catch(error => {
                            console.error('Error fetching weather data:', error);
                            weatherElement.textContent = 'Weather data unavailable';
                        });
                },
                (error) => {
                    console.error('Error getting location:', error);
                    weatherElement.textContent = 'Weather data unavailable';
                }
            );
        } else {
            weatherElement.textContent = 'Weather data unavailable';
        }
    }
}
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Update: ${document.lastModified}`;
