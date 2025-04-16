// patients.js - Patient Management functionality for MediTrack system

document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    initializeNavigation();
    initializePatientManagement();
    initializeModals();
});

// Dark Mode Functionality
function initializeDarkMode() {
    const modeToggle = document.getElementById('mode-switch');
    const modeIcon = modeToggle.querySelector('.mode-icon');
    
    // Check for saved mode preference or use system preference
    const savedMode = localStorage.getItem('darkMode');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial mode based on saved preference or system preference
    if (savedMode === 'dark' || (savedMode === null && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        modeIcon.textContent = '🌙';
    } else {
        modeIcon.textContent = '☀️';
    }
    
    // Toggle dark mode when button is clicked
    modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'dark');
            modeIcon.textContent = '🌙';
        } else {
            localStorage.setItem('darkMode', 'light');
            modeIcon.textContent = '☀️';
        }
    });
}

// Mobile Navigation Menu
function initializeNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('show');
    });
    
    // Close menu when a link is clicked
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('show');
            menuToggle.classList.remove('active');
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.main-nav') && 
            !event.target.closest('#menu-toggle') && 
            mainNav.classList.contains('show')) {
            mainNav.classList.remove('show');
            menuToggle.classList.remove('active');
        }
    });
}

// Patient Management Functionality
function initializePatientManagement() {
    // Sample patient data - in a real application, this would come from an API
    const patients = [
        {
            id: 'PT-2023-001',
            firstName: 'John',
            lastName: 'Doe',
            age: 45,
            gender: 'Male',
            lastVisit: '2025-03-12',
            doctor: 'Dr. Smith',
            status: 'active',
            department: 'cardiology'
        },
        {
            id: 'PT-2023-002',
            firstName: 'Jane',
            lastName: 'Smith',
            age: 32,
            gender: 'Female',
            lastVisit: '2025-04-01',
            doctor: 'Dr. Johnson',
            status: 'active',
            department: 'neurology'
        },
        {
            id: 'PT-2024-003',
            firstName: 'Michael',
            lastName: 'Brown',
            age: 58,
            gender: 'Male',
            lastVisit: '2025-02-15',
            doctor: 'Dr. Williams',
            status: 'inactive',
            department: 'orthopedics'
        },
        {
            id: 'PT-2024-004',
            firstName: 'Emily',
            lastName: 'Davis',
            age: 27,
            gender: 'Female',
            lastVisit: '2025-03-28',
            doctor: 'Dr. Smith',
            status: 'active',
            department: 'pediatrics'
        },
        {
            id: 'PT-2024-005',
            firstName: 'Robert',
            lastName: 'Wilson',
            age: 63,
            gender: 'Male',
            lastVisit: '2025-01-10',
            doctor: 'Dr. Johnson',
            status: 'active',
            department: 'cardiology'
        },
        {
            id: 'PT-2024-006',
            firstName: 'Sarah',
            lastName: 'Martinez',
            age: 41,
            gender: 'Female',
            lastVisit: '2025-04-05',
            doctor: 'Dr. Williams',
            status: 'active',
            department: 'neurology'
        },
        {
            id: 'PT-2024-007',
            firstName: 'David',
            lastName: 'Anderson',
            age: 52,
            gender: 'Male',
            lastVisit: '2024-12-18',
            doctor: 'Dr. Wilson',
            status: 'inactive',
            department: 'orthopedics'
        },
        {
            id: 'PT-2024-008',
            firstName: 'Lisa',
            lastName: 'Thomas',
            age: 36,
            gender: 'Female',
            lastVisit: '2025-03-20',
            doctor: 'Dr. Smith',
            status: 'active',
            department: 'pediatrics'
        }
    ];
    
    // Doctor list for the assigned doctor dropdown
    const doctors = [
        { id: 1, name: 'Dr. Smith', department: 'cardiology' },
        { id: 2, name: 'Dr. Johnson', department: 'neurology' },
        { id: 3, name: 'Dr. Williams', department: 'pediatrics' },
        { id: 4, name: 'Dr. Wilson', department: 'orthopedics' },
        { id: 5, name: 'Dr. Thompson', department: 'cardiology' },
        { id: 6, name: 'Dr. Garcia', department: 'neurology' }
    ];
    
    // Pagination settings
    let currentPage = 1;
    const rowsPerPage = 5;
    let filteredPatients = [...patients];
    
    // Initialize form elements
    const patientDoctorSelect = document.getElementById('patient-doctor');
    doctors.forEach(doctor => {
        const option = document.createElement('option');
        option.value = doctor.name;
        option.textContent = doctor.name;
        patientDoctorSelect.appendChild(option);
    });
    
    // Add event listeners for filters
    document.getElementById('status-filter').addEventListener('change', applyFilters);
    document.getElementById('department-filter').addEventListener('change', applyFilters);
    document.getElementById('sort-by').addEventListener('change', applyFilters);
    
    // Add event listeners for pagination
    document.getElementById('prev-page').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayPatients();
        }
    });
    
    document.getElementById('next-page').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            displayPatients();
        }
    });
    
    // Initial display
    applyFilters();
    
    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    const searchButton = document.querySelector('.search-container button');
    
    const performSearch = () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            filteredPatients = patients.filter(patient => 
                patient.firstName.toLowerCase().includes(searchTerm) || 
                patient.lastName.toLowerCase().includes(searchTerm) || 
                patient.id.toLowerCase().includes(searchTerm)
            );
        } else {
            filteredPatients = [...patients];
        }
        currentPage = 1;
        applyFilters(false); // Don't re-filter, just apply sorting from current filters
    };
    
    searchButton.addEventListener('click', (e) => {
        e.preventDefault();
        performSearch();
    });
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    // Filter and display patients
    function applyFilters(resetPage = true) {
        const statusFilter = document.getElementById('status-filter').value;
        const departmentFilter = document.getElementById('department-filter').value;
        const sortBy = document.getElementById('sort-by').value;
        
        // Apply status filter
        if (statusFilter !== 'all') {
            filteredPatients = patients.filter(p => p.status === statusFilter);
        } else {
            filteredPatients = [...patients];
        }
        
        // Apply department filter
        if (departmentFilter !== 'all') {
            filteredPatients = filteredPatients.filter(p => p.department === departmentFilter);
        }
        
        // Apply sorting
        switch (sortBy) {
            case 'name':
                filteredPatients.sort((a, b) => (a.lastName + a.firstName).localeCompare(b.lastName + b.firstName));
                break;
            case 'id':
                filteredPatients.sort((a, b) => a.id.localeCompare(b.id));
                break;
            case 'date':
                filteredPatients.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
                break;
        }
        
        // Reset to first page when filters change
        if (resetPage) {
            currentPage = 1;
        }
        
        // Display the filtered and sorted patients
        displayPatients();
    }
    
    // Display patients based on current filters and pagination
    function displayPatients() {
        const tableBody = document.getElementById('patients-table-body');
        tableBody.innerHTML = '';
        
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, filteredPatients.length);
        const patientsToShow = filteredPatients.slice(startIndex, endIndex);
        
        if (patientsToShow.length === 0) {
            const noDataRow = document.createElement('tr');
            noDataRow.innerHTML = `<td colspan="8" class="no-data-message">No patients found matching the selected criteria.</td>`;
            tableBody.appendChild(noDataRow);
        } else {
            patientsToShow.forEach(patient => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${patient.id}</td>
                    <td>${patient.lastName}, ${patient.firstName}</td>
                    <td>${patient.age}</td>
                    <td>${patient.gender}</td>
                    <td>${formatDate(patient.lastVisit)}</td>
                    <td>${patient.doctor}</td>
                    <td><span class="status-badge ${patient.status}">${capitalizeFirstLetter(patient.status)}</span></td>
                    <td class="actions">
                        <button class="icon-btn view-btn" data-id="${patient.id}" aria-label="View patient details">👁️</button>
                        <button class="icon-btn edit-btn" data-id="${patient.id}" aria-label="Edit patient">✏️</button>
                        <button class="icon-btn delete-btn" data-id="${patient.id}" aria-label="Delete patient">🗑️</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // Add event listeners to the action buttons
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', () => viewPatient(btn.dataset.id));
            });
            
            document.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', () => editPatient(btn.dataset.id));
            });
            
            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', () => deletePatient(btn.dataset.id));
            });
        }
        
        // Update pagination controls
        const totalPages = Math.ceil(filteredPatients.length / rowsPerPage);
        document.getElementById('current-page').textContent = currentPage;
        document.getElementById('total-pages').textContent = totalPages;
        document.getElementById('prev-page').disabled = currentPage === 1;
        document.getElementById('next-page').disabled = currentPage === totalPages;
    }
    
    // View patient details (placeholder function)
    function viewPatient(patientId) {
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            alert(`Viewing patient: ${patient.firstName} ${patient.lastName}`);
            // In a real app, this would open a detailed view or redirect to a patient detail page
        }
    }
    
    // Edit patient (placeholder function)
    function editPatient(patientId) {
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            alert(`Editing patient: ${patient.firstName} ${patient.lastName}`);
            // In a real app, this would populate the edit form with patient data
        }
    }
    
    // Delete patient (placeholder function)
    function deletePatient(patientId) {
        const patient = patients.find(p => p.id === patientId);
        if (patient) {
            const confirmDelete = confirm(`Are you sure you want to delete patient ${patient.firstName} ${patient.lastName}?`);
            if (confirmDelete) {
                // In a real app, this would send a delete request to the server
                alert(`Patient ${patient.firstName} ${patient.lastName} deleted successfully.`);
                const index = patients.findIndex(p => p.id === patientId);
                patients.splice(index, 1);
                applyFilters();
            }
        }
    }
}

// Modal Functionality
function initializeModals() {
    const addPatientBtn = document.getElementById('add-patient-btn');
    const addPatientModal = document.getElementById('add-patient-modal');
    const closeButtons = document.querySelectorAll('.close-modal, .cancel-btn');
    
    // Open modal when add patient button is clicked
    addPatientBtn.addEventListener('click', () => {
        addPatientModal.classList.add('show');
        document.body.classList.add('modal-open');
    });
    
    // Close modal when close button or cancel button is clicked
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            addPatientModal.classList.remove('show');
            document.body.classList.remove('modal-open');
            document.getElementById('add-patient-form').reset();
        });
    });
    
    // Close modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === addPatientModal) {
            addPatientModal.classList.remove('show');
            document.body.classList.remove('modal-open');
            document.getElementById('add-patient-form').reset();
        }
    });
    
    // Form submission
    const addPatientForm = document.getElementById('add-patient-form');
    addPatientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // In a real app, this would send the form data to the server
        alert('Patient added successfully!');
        addPatientModal.classList.remove('show');
        document.body.classList.remove('modal-open');
        addPatientForm.reset();
        
        // Refresh the patient list
        initializePatientManagement();
    });
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Update: ${document.lastModified}`;
