// appointments.js - Handles appointment-related functionality

/**
 * Sample appointment data for demonstration
 */
const sampleAppointments = [
    { 
      id: 1, 
      date: '2025-04-12',
      time: '09:00', 
      endTime: '09:30',
      patient: 'John Doe', 
      doctor: 'Dr. Sarah Williams',
      department: 'Cardiology',
      type: 'Consultation',
      reason: 'Annual Checkup', 
      status: 'confirmed',
      notes: 'Patient has history of hypertension'
    },
    { 
      id: 2, 
      date: '2025-04-12',
      time: '10:30', 
      endTime: '11:00',
      patient: 'Sarah Johnson', 
      doctor: 'Dr. Smith',
      department: 'Neurology',
      type: 'Follow-up',
      reason: 'Follow-up', 
      status: 'confirmed',
      notes: 'Post-treatment evaluation'
    },
    { 
      id: 3, 
      date: '2025-04-12',
      time: '13:15', 
      endTime: '14:00',
      patient: 'Robert Chen', 
      doctor: 'Dr. Jones',
      department: 'Orthopedics',
      type: 'Consultation',
      reason: 'Consultation', 
      status: 'confirmed',
      notes: 'Initial assessment for knee pain'
    },
    { 
      id: 4, 
      date: '2025-04-12',
      time: '15:45', 
      endTime: '16:15',
      patient: 'Maria Garcia', 
      doctor: 'Dr. Smith',
      department: 'Pediatrics',
      type: 'Follow-up',
      reason: 'Test Results', 
      status: 'pending',
      notes: 'Review blood work results'
    }
  ];
  
  /**
   * Sample patient data for dropdown
   */
  const samplePatients = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Sarah Johnson' },
    { id: 3, name: 'Robert Chen' },
    { id: 4, name: 'Maria Garcia' },
    { id: 5, name: 'David Williams' },
    { id: 6, name: 'Emma Thompson' }
  ];
  
  /**
   * Sample doctor data for dropdown
   */
  const sampleDoctors = [
    { id: 1, name: 'Dr. Smith', department: 'Cardiology' },
    { id: 2, name: 'Dr. Jones', department: 'Neurology' },
    { id: 3, name: 'Dr. Sarah Williams', department: 'Pediatrics' },
    { id: 4, name: 'Dr. Michael Chen', department: 'Orthopedics' }
  ];
  
  /**
   * Initialize the page
   */
  document.addEventListener('DOMContentLoaded', () => {
    // Load appointments
    loadAppointments();
    loadUpcomingAppointments();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize modals
    initializeModals();
    
    // Initialize form data
    populateFormDropdowns();
  
    // Initialize dark mode
    initializeDarkMode();
  });
  
  /**
   * Initialize dark mode functionality
   */
  function initializeDarkMode() {
    const modeToggle = document.getElementById('mode-switch');
    const modeIcon = modeToggle.querySelector('.mode-icon');
    
    // Check for saved preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    
    // Apply initial mode
    if (darkMode) {
      document.body.classList.add('dark-mode');
      modeIcon.textContent = '🌙';
    } else {
      document.body.classList.remove('dark-mode');
      modeIcon.textContent = '☀️';
    }
    
    // Set up event listener for toggle
    modeToggle.addEventListener('click', () => {
      const isDarkMode = document.body.classList.toggle('dark-mode');
      
      // Update icon
      modeIcon.textContent = isDarkMode ? '🌙' : '☀️';
      
      // Save preference
      localStorage.setItem('darkMode', isDarkMode);
    });
  }
  
  /**
   * Set up event listeners for the page
   */
  function setupEventListeners() {
    // View option buttons
    const viewOptionButtons = document.querySelectorAll('.view-option-btn');
    viewOptionButtons.forEach(button => {
      button.addEventListener('click', () => {
        viewOptionButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        // Here you would update the calendar view based on the selected option
        console.log(`Changed view to: ${button.dataset.view}`);
      });
    });
    
    // Date navigation
    document.getElementById('prev-date').addEventListener('click', () => {
      console.log('Navigate to previous date');
      // Implement date navigation
    });
    
    document.getElementById('next-date').addEventListener('click', () => {
      console.log('Navigate to next date');
      // Implement date navigation
    });
    
    // Toggle mobile menu
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const nav = document.querySelector('nav');
        
        // Toggle navigation menu visibility
        if (nav.classList.contains('show')) {
          nav.classList.remove('show');
          menuToggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-open');
        } else {
          nav.classList.add('show');
          menuToggle.setAttribute('aria-expanded', 'true');
          document.body.classList.add('nav-open');
        }
        
        // Toggle hamburger icon appearance
        menuToggle.querySelector('.hamburger').classList.toggle('active');
      });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      const nav = document.querySelector('nav');
      const menuToggle = document.getElementById('menu-toggle');
      
      if (nav.classList.contains('show') && 
          !nav.contains(event.target) && 
          event.target !== menuToggle && 
          !menuToggle.contains(event.target)) {
        nav.classList.remove('show');
        menuToggle.querySelector('.hamburger').classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
      }
    });
    
    // Close mobile menu on window resize (if window becomes desktop size)
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) { // Typical breakpoint for mobile/desktop
        const nav = document.querySelector('nav');
        const menuToggle = document.getElementById('menu-toggle');
        
        if (nav.classList.contains('show')) {
          nav.classList.remove('show');
          if (menuToggle && menuToggle.querySelector('.hamburger')) {
            menuToggle.querySelector('.hamburger').classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
          }
          document.body.classList.remove('nav-open');
        }
      }
    });
    
    // Schedule appointment button
    document.getElementById('schedule-appointment-btn').addEventListener('click', () => {
      document.getElementById('schedule-appointment-modal').classList.add('show');
    });
    
    // View calendar button
    document.getElementById('view-calendar-btn').addEventListener('click', () => {
      console.log('View full calendar');
      // Implement full calendar view
    });
  }
  
  /**
   * Initialize modal functionality
   */
  function initializeModals() {
    // Close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.classList.remove('show');
      });
    });
    
    // Cancel buttons
    const cancelButtons = document.querySelectorAll('.cancel-btn');
    cancelButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        modal.classList.remove('show');
      });
    });
    
    // Form submission
    const appointmentForm = document.getElementById('schedule-appointment-form');
    appointmentForm.addEventListener('submit', (event) => {
      event.preventDefault();
      console.log('Form submitted');
      // Add form submission logic here
      
      // Close modal after submission
      document.getElementById('schedule-appointment-modal').classList.remove('show');
      
      // Refresh appointments
      loadAppointments();
      loadUpcomingAppointments();
    });
    
    // Clicking outside modal closes it
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          modal.classList.remove('show');
        }
      });
    });
    
    // Close modal on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
          modal.classList.remove('show');
        });
      }
    });
  }
  
  /**
   * Populate form dropdowns with sample data
   */
  function populateFormDropdowns() {
    // Populate patient dropdown
    const patientDropdown = document.getElementById('appointment-patient');
    samplePatients.forEach(patient => {
      const option = document.createElement('option');
      option.value = patient.id;
      option.textContent = patient.name;
      patientDropdown.appendChild(option);
    });
    
    // Populate doctor dropdown
    const doctorDropdown = document.getElementById('appointment-doctor');
    sampleDoctors.forEach(doctor => {
      const option = document.createElement('option');
      option.value = doctor.id;
      option.textContent = doctor.name;
      doctorDropdown.appendChild(option);
    });
    
    // Set default date to today
    const dateInput = document.getElementById('appointment-date');
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    dateInput.value = formattedDate;
    
    // Link department selection to doctor filtering
    const departmentSelect = document.getElementById('appointment-department');
    departmentSelect.addEventListener('change', () => {
      const selectedDepartment = departmentSelect.value;
      
      // Reset doctor dropdown
      doctorDropdown.innerHTML = '<option value="">Select Doctor</option>';
      
      // Filter doctors by department
      const filteredDoctors = selectedDepartment ? 
        sampleDoctors.filter(doctor => doctor.department.toLowerCase() === selectedDepartment.toLowerCase()) : 
        sampleDoctors;
      
      // Populate filtered doctors
      filteredDoctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.id;
        option.textContent = doctor.name;
        doctorDropdown.appendChild(option);
      });
    });
  }
  
  /**
   * Loads appointment data and populates the appointment grid
   */
  function loadAppointments() {
    console.log('Loading appointments...');
    
    const appointmentGrid = document.getElementById('appointment-grid');
    
    if (!appointmentGrid) {
      console.warn('Appointment grid element not found');
      return;
    }
    
    // Clear loading overlay
    appointmentGrid.innerHTML = '';
    
    // Create columns for each doctor/resource
    const appointmentColumn = document.createElement('div');
    appointmentColumn.className = 'appointment-column';
    appointmentGrid.appendChild(appointmentColumn);
    
    // Create time slots
    for (let hour = 8; hour <= 17; hour++) {
      const timeSlot = document.createElement('div');
      timeSlot.className = 'grid-time-slot';
      appointmentColumn.appendChild(timeSlot);
      
      // Find appointments for this time slot
      const hourAppointments = sampleAppointments.filter(appointment => {
        const appointmentHour = parseInt(appointment.time.split(':')[0]);
        return appointmentHour === hour;
      });
      
      if (hourAppointments.length > 0) {
        hourAppointments.forEach(appointment => {
          const appointmentElement = document.createElement('div');
          appointmentElement.className = `appointment status-${appointment.status}`;
          appointmentElement.innerHTML = `
            <div class="appointment-time">${formatTime(appointment.time)}</div>
            <div class="appointment-patient">${appointment.patient}</div>
            <div class="appointment-type">${appointment.type}</div>
          `;
          
          // Position appointment within the time slot
          const minutes = parseInt(appointment.time.split(':')[1]);
          appointmentElement.style.top = `${(minutes / 60) * 100}%`;
          
          // Calculate height based on duration
          const startMinutes = parseInt(appointment.time.split(':')[0]) * 60 + parseInt(appointment.time.split(':')[1]);
          const endMinutes = parseInt(appointment.endTime.split(':')[0]) * 60 + parseInt(appointment.endTime.split(':')[1]);
          const durationMinutes = endMinutes - startMinutes;
          appointmentElement.style.height = `${(durationMinutes / 60) * 100}%`;
          
          // Add click event to show details
          appointmentElement.addEventListener('click', () => {
            showAppointmentDetails(appointment);
          });
          
          timeSlot.appendChild(appointmentElement);
        });
      }
    }
  }
  
  /**
   * Load and display upcoming appointments in the sidebar list
   */
  function loadUpcomingAppointments() {
    const upcomingList = document.getElementById('upcoming-appointments');
    
    if (!upcomingList) {
      console.warn('Upcoming appointments list element not found');
      return;
    }
    
    // Clear loading message
    upcomingList.innerHTML = '';
    
    if (sampleAppointments.length === 0) {
      upcomingList.innerHTML = '<li class="no-appointments">No upcoming appointments</li>';
    } else {
      // Sort appointments by time
      const sortedAppointments = [...sampleAppointments].sort((a, b) => {
        return a.time.localeCompare(b.time);
      });
      
      // Add each appointment to the list
      sortedAppointments.forEach(appointment => {
        const appointmentItem = document.createElement('li');
        appointmentItem.className = `appointment-item status-${appointment.status}`;
        appointmentItem.innerHTML = `
          <div class="appointment-time">${formatTime(appointment.time)}</div>
          <div class="appointment-details">
            <div class="patient-name">${appointment.patient}</div>
            <div class="appointment-reason">${appointment.reason}</div>
          </div>
          <div class="appointment-status">${capitalizeFirstLetter(appointment.status)}</div>
        `;
        
        // Add click event to show details
        appointmentItem.addEventListener('click', () => {
          showAppointmentDetails(appointment);
        });
        
        upcomingList.appendChild(appointmentItem);
      });
    }
  }
  
  /**
   * Show appointment details in a modal
   */
  function showAppointmentDetails(appointment) {
    const detailsContainer = document.getElementById('appointment-details-container');
    
    detailsContainer.innerHTML = `
      <div class="appointment-detail-item">
        <span class="detail-label">Patient:</span>
        <span class="detail-value">${appointment.patient}</span>
      </div>
      <div class="appointment-detail-item">
        <span class="detail-label">Doctor:</span>
        <span class="detail-value">${appointment.doctor}</span>
      </div>
      <div class="appointment-detail-item">
        <span class="detail-label">Department:</span>
        <span class="detail-value">${appointment.department}</span>
      </div>
      <div class="appointment-detail-item">
        <span class="detail-label">Date:</span>
        <span class="detail-value">${formatDate(appointment.date)}</span>
      </div>
      <div class="appointment-detail-item">
        <span class="detail-label">Time:</span>
        <span class="detail-value">${formatTime(appointment.time)} - ${formatTime(appointment.endTime)}</span>
      </div>
      <div class="appointment-detail-item">
        <span class="detail-label">Type:</span>
        <span class="detail-value">${appointment.type}</span>
      </div>
      <div class="appointment-detail-item">
        <span class="detail-label">Reason:</span>
        <span class="detail-value">${appointment.reason}</span>
      </div>
      <div class="appointment-detail-item">
        <span class="detail-label">Status:</span>
        <span class="detail-value status-${appointment.status}">${capitalizeFirstLetter(appointment.status)}</span>
      </div>
      <div class="appointment-detail-item">
        <span class="detail-label">Notes:</span>
        <span class="detail-value">${appointment.notes || 'No notes available'}</span>
      </div>
    `;
    
    // Set up edit button
    document.getElementById('edit-appointment-btn').onclick = () => {
      console.log(`Edit appointment ${appointment.id}`);
      // Implement edit functionality
    };
    
    // Set up cancel button
    document.getElementById('cancel-appointment-btn').onclick = () => {
      if (confirm(`Are you sure you want to cancel this appointment with ${appointment.patient}?`)) {
        console.log(`Cancel appointment ${appointment.id}`);
        // Implement cancel functionality
        document.getElementById('appointment-details-modal').classList.remove('show');
        
        // Refresh appointments
        loadAppointments();
        loadUpcomingAppointments();
      }
    };
    
    // Show modal
    document.getElementById('appointment-details-modal').classList.add('show');
  }
  
  /**
   * Helper function to format time from 24h to 12h format
   */
  function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  }
  
  /**
   * Helper function to format date in a readable format
   */
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }
  
  /**
   * Helper function to capitalize the first letter of a string
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  // Export functions for use in other modules
  export { loadAppointments, loadUpcomingAppointments };

  document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Update: ${document.lastModified}`;
