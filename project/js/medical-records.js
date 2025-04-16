// medical-records.js - Main JavaScript file for the medical records page

// DOM Elements
const modeToggle = document.getElementById('mode-switch');
const modeIcon = document.querySelector('.mode-icon');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.querySelector('nav');
const dateRangeSelect = document.getElementById('date-range');
const customDateRange = document.querySelector('.custom-date-range');
const recordModal = document.getElementById('record-modal');
const viewRecordModal = document.getElementById('view-record-modal');
const addRecordBtn = document.getElementById('add-record-btn');
const importRecordsBtn = document.getElementById('import-records-btn');
const exportRecordsBtn = document.getElementById('export-records-btn');
const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');
const recordForm = document.getElementById('record-form');
const recordFilters = document.getElementById('record-filters');
const resetFiltersBtn = document.getElementById('reset-filters');
const selectAllCheckbox = document.getElementById('select-all');
const recordsTable = document.getElementById('records-table');
const recordsList = document.getElementById('records-list');
const editRecordBtn = document.getElementById('edit-record-btn');
const deleteRecordBtn = document.getElementById('delete-record-btn');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');

// ---- DARK MODE FUNCTIONALITY ----
// Check for saved user preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        modeIcon.textContent = '🌙';
    } else {
        document.body.classList.remove('dark-mode');
        modeIcon.textContent = '☀️';
    }
}

// Toggle dark/light mode
function toggleTheme() {
    if (document.body.classList.contains('dark-mode')) {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        modeIcon.textContent = '☀️';
    } else {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
        modeIcon.textContent = '🌙';
    }
}

// ---- RESPONSIVE NAVIGATION ----
function toggleMenu() {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
    
    // Toggle aria-expanded for accessibility
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !isExpanded);
}

// Close menu when clicking outside
function closeMenuOnOutsideClick(event) {
    if (nav.classList.contains('active') && 
        !nav.contains(event.target) && 
        !menuToggle.contains(event.target)) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

// Close menu when window is resized beyond mobile breakpoint
function closeMenuOnResize() {
    if (window.innerWidth > 768 && nav.classList.contains('active')) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}

// ---- DATE RANGE FILTER FUNCTIONALITY ----
function toggleCustomDateRange() {
    if (dateRangeSelect.value === 'custom') {
        customDateRange.style.display = 'flex';
    } else {
        customDateRange.style.display = 'none';
    }
}

// ---- MODAL FUNCTIONALITY ----
function openModal(modalElement) {
    modalElement.classList.add('active');
    document.body.classList.add('modal-open');
    
    // Focus on the first input for accessibility
    const firstInput = modalElement.querySelector('input, select, textarea');
    if (firstInput) {
        firstInput.focus();
    }
    
    // Close modal when clicking outside content
    modalElement.addEventListener('click', closeModalOnOutsideClick);
}

function closeModal(modalElement) {
    modalElement.classList.remove('active');
    document.body.classList.remove('modal-open');
    modalElement.removeEventListener('click', closeModalOnOutsideClick);
}

function closeModalOnOutsideClick(event) {
    if (event.target === this) {
        closeModal(this);
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => closeModal(modal));
}

// ---- SAMPLE DATA ----
// This would normally come from an API, but for demo purposes we'll use sample data
const sampleRecords = [
    {
        id: 'REC-001',
        patientId: 'P-10045',
        patientName: 'John Smith',
        recordType: 'consultation',
        recordTypeLabel: 'Consultation Notes',
        createdDate: '2025-03-15',
        lastUpdated: '2025-03-15',
        createdBy: 'Dr. Emily Johnson',
        title: 'Initial Consultation',
        details: 'Patient presented with symptoms of seasonal allergies. Prescribed antihistamines.',
        attachments: ['allergy_test.pdf']
    },
    {
        id: 'REC-002',
        patientId: 'P-10046',
        patientName: 'Sarah Williams',
        recordType: 'diagnosis',
        recordTypeLabel: 'Diagnosis',
        createdDate: '2025-03-12',
        lastUpdated: '2025-03-14',
        createdBy: 'Dr. James Wilson',
        title: 'Type 2 Diabetes Diagnosis',
        details: 'Patient diagnosed with Type 2 Diabetes based on blood work and symptoms.',
        attachments: ['blood_work.pdf', 'glucose_chart.png']
    },
    {
        id: 'REC-003',
        patientId: 'P-10047',
        patientName: 'Michael Brown',
        recordType: 'treatment',
        recordTypeLabel: 'Treatment Plan',
        createdDate: '2025-03-10',
        lastUpdated: '2025-03-10',
        createdBy: 'Dr. Smith',
        title: 'Physical Therapy Plan',
        details: 'Six-week physical therapy plan for knee rehabilitation following surgery.',
        attachments: ['pt_schedule.pdf']
    },
    {
        id: 'REC-004',
        patientId: 'P-10048',
        patientName: 'Jessica Lee',
        recordType: 'medication',
        recordTypeLabel: 'Medication History',
        createdDate: '2025-03-08',
        lastUpdated: '2025-04-01',
        createdBy: 'Dr. Lisa Chen',
        title: 'Medication Update',
        details: 'Updated medication regimen for hypertension management.',
        attachments: []
    },
    {
        id: 'REC-005',
        patientId: 'P-10045',
        patientName: 'John Smith',
        recordType: 'imaging',
        recordTypeLabel: 'Imaging Reports',
        createdDate: '2025-03-01',
        lastUpdated: '2025-03-05',
        createdBy: 'Dr. Robert Taylor',
        title: 'Chest X-Ray Results',
        details: 'Chest X-ray shows no abnormalities. Lungs are clear.',
        attachments: ['chest_xray.dicom', 'xray_report.pdf']
    }
];

// ---- TABLE FUNCTIONALITY ----
let currentPage = 1;
const recordsPerPage = 10;
let filteredRecords = [...sampleRecords];

// Populate records table
function populateRecordsTable() {
    // Calculate pagination
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const recordsToShow = filteredRecords.slice(startIndex, endIndex);
    
    // Clear table
    recordsList.innerHTML = '';
    
    if (recordsToShow.length === 0) {
        const noRecordsRow = document.createElement('tr');
        noRecordsRow.innerHTML = `
            <td colspan="8" class="no-records">No medical records found matching your criteria.</td>
        `;
        recordsList.appendChild(noRecordsRow);
    } else {
        // Add records to table
        recordsToShow.forEach(record => {
            const row = document.createElement('tr');
            row.dataset.recordId = record.id;
            
            row.innerHTML = `
                <td><input type="checkbox" class="record-checkbox" aria-label="Select record"></td>
                <td>${record.patientId}</td>
                <td>${record.patientName}</td>
                <td>${record.recordTypeLabel}</td>
                <td>${formatDate(record.createdDate)}</td>
                <td>${formatDate(record.lastUpdated)}</td>
                <td>${record.createdBy}</td>
                <td class="actions-cell">
                    <button class="icon-btn view-record" aria-label="View record">👁️</button>
                    <button class="icon-btn edit-record" aria-label="Edit record">✏️</button>
                    <button class="icon-btn delete-record" aria-label="Delete record">🗑️</button>
                </td>
            `;
            
            recordsList.appendChild(row);
        });
        
        // Add event listeners to the newly created buttons
        addTableActionListeners();
    }
    
    // Update pagination controls
    updatePagination();
}

// Format date for display
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Add event listeners to table action buttons
function addTableActionListeners() {
    const viewButtons = document.querySelectorAll('.view-record');
    const editButtons = document.querySelectorAll('.edit-record');
    const deleteButtons = document.querySelectorAll('.delete-record');
    
    viewButtons.forEach(btn => {
        btn.addEventListener('click', handleViewRecord);
    });
    
    editButtons.forEach(btn => {
        btn.addEventListener('click', handleEditRecord);
    });
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', handleDeleteRecord);
    });
}

// Handle record viewing
function handleViewRecord(event) {
    const recordRow = event.target.closest('tr');
    const recordId = recordRow.dataset.recordId;
    const record = sampleRecords.find(r => r.id === recordId);
    
    if (record) {
        document.getElementById('view-record-title').textContent = record.title;
        
        const detailsContainer = document.getElementById('record-details-container');
        detailsContainer.innerHTML = `
            <div class="record-details">
                <div class="detail-row">
                    <div class="detail-label">Patient Name:</div>
                    <div class="detail-value">${record.patientName}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Patient ID:</div>
                    <div class="detail-value">${record.patientId}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Record Type:</div>
                    <div class="detail-value">${record.recordTypeLabel}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Created:</div>
                    <div class="detail-value">${formatDate(record.createdDate)} by ${record.createdBy}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Last Updated:</div>
                    <div class="detail-value">${formatDate(record.lastUpdated)}</div>
                </div>
                <div class="detail-row full-width">
                    <div class="detail-label">Details:</div>
                    <div class="detail-value detail-text">${record.details}</div>
                </div>
                ${record.attachments.length > 0 ? `
                <div class="detail-row full-width">
                    <div class="detail-label">Attachments:</div>
                    <div class="detail-value">
                        <ul class="attachments-list">
                            ${record.attachments.map(attachment => `
                                <li>
                                    <a href="#" class="attachment-link">
                                        ${getFileIcon(attachment)} ${attachment}
                                    </a>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
        
        openModal(viewRecordModal);
    }
}

// Get appropriate icon for file type
function getFileIcon(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    switch (extension) {
        case 'pdf':
            return '📄';
        case 'jpg':
        case 'jpeg':
        case 'png':
            return '🖼️';
        case 'dicom':
            return '🔬';
        default:
            return '📎';
    }
}

// Handle record editing
function handleEditRecord(event) {
    const recordRow = event.target.closest('tr');
    const recordId = recordRow.dataset.recordId;
    const record = sampleRecords.find(r => r.id === recordId);
    
    if (record) {
        // Populate the form with existing data
        document.getElementById('modal-patient-id').value = record.patientId;
        document.getElementById('modal-record-type').value = record.recordType;
        document.getElementById('record-title').value = record.title;
        document.getElementById('record-details').value = record.details;
        
        // Change modal title to indicate editing
        document.querySelector('#record-modal .modal-header h2').textContent = 'Edit Medical Record';
        
        openModal(recordModal);
    }
}

// Handle record deletion
function handleDeleteRecord(event) {
    const recordRow = event.target.closest('tr');
    const recordId = recordRow.dataset.recordId;
    
    if (confirm(`Are you sure you want to delete this medical record?`)) {
        // In a real application, you would send a delete request to your API
        // For this demo, we'll just remove it from our array and update the table
        const index = sampleRecords.findIndex(r => r.id === recordId);
        if (index !== -1) {
            sampleRecords.splice(index, 1);
            filteredRecords = [...sampleRecords]; // Reset filtered records
            populateRecordsTable();
        }
    }
}

// Update pagination UI
function updatePagination() {
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    
    currentPageSpan.textContent = currentPage;
    totalPagesSpan.textContent = totalPages;
    
    // Enable/disable pagination buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Handle filter form submission
function handleFilterSubmit(event) {
    event.preventDefault();
    
    const patientName = document.getElementById('patient-name').value.toLowerCase();
    const recordType = document.getElementById('record-type').value;
    const dateRange = document.getElementById('date-range').value;
    
    // Filter records based on form inputs
    filteredRecords = sampleRecords.filter(record => {
        let matchesPatientName = true;
        let matchesRecordType = true;
        let matchesDateRange = true;
        
        if (patientName) {
            matchesPatientName = record.patientName.toLowerCase().includes(patientName);
        }
        
        if (recordType) {
            matchesRecordType = record.recordType === recordType;
        }
        
        if (dateRange && dateRange !== 'all') {
            const recordDate = new Date(record.createdDate);
            const today = new Date();
            
            switch (dateRange) {
                case 'week':
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(today.getDate() - 7);
                    matchesDateRange = recordDate >= oneWeekAgo;
                    break;
                case 'month':
                    const oneMonthAgo = new Date();
                    oneMonthAgo.setMonth(today.getMonth() - 1);
                    matchesDateRange = recordDate >= oneMonthAgo;
                    break;
                case 'quarter':
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(today.getMonth() - 3);
                    matchesDateRange = recordDate >= threeMonthsAgo;
                    break;
                case 'year':
                    const oneYearAgo = new Date();
                    oneYearAgo.setFullYear(today.getFullYear() - 1);
                    matchesDateRange = recordDate >= oneYearAgo;
                    break;
                case 'custom':
                    const fromDate = new Date(document.getElementById('date-from').value);
                    const toDate = new Date(document.getElementById('date-to').value);
                    // Add one day to include the end date in the range
                    toDate.setDate(toDate.getDate() + 1);
                    
                    if (!isNaN(fromDate.getTime()) && !isNaN(toDate.getTime())) {
                        matchesDateRange = recordDate >= fromDate && recordDate < toDate;
                    }
                    break;
            }
        }
        
        return matchesPatientName && matchesRecordType && matchesDateRange;
    });
    
    // Reset to first page and update table
    currentPage = 1;
    populateRecordsTable();
}

// Reset filters
function resetFilters() {
    document.getElementById('patient-name').value = '';
    document.getElementById('record-type').value = '';
    document.getElementById('date-range').value = 'all';
    customDateRange.style.display = 'none';
    
    filteredRecords = [...sampleRecords];
    currentPage = 1;
    populateRecordsTable();
}

// Handle "Select All" checkbox
function handleSelectAll() {
    const isChecked = selectAllCheckbox.checked;
    const checkboxes = document.querySelectorAll('.record-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
    });
    
    // Update export button state
    exportRecordsBtn.disabled = !isChecked && !Array.from(checkboxes).some(cb => cb.checked);
}

// Handle individual record checkbox changes
function handleRecordCheckboxChange() {
    const checkboxes = document.querySelectorAll('.record-checkbox');
    const checkedBoxes = Array.from(checkboxes).filter(cb => cb.checked);
    
    // Update "Select All" checkbox state
    selectAllCheckbox.checked = checkboxes.length > 0 && checkboxes.length === checkedBoxes.length;
    selectAllCheckbox.indeterminate = checkedBoxes.length > 0 && checkedBoxes.length < checkboxes.length;
    
    // Update export button state
    exportRecordsBtn.disabled = checkedBoxes.length === 0;
}

// ---- FORM SUBMISSION ----
// Handle record form submission
function handleRecordFormSubmit(event) {
    event.preventDefault();
    
    const patientId = document.getElementById('modal-patient-id').value;
    const recordType = document.getElementById('modal-record-type').value;
    const recordTitle = document.getElementById('record-title').value;
    const recordDetails = document.getElementById('record-details').value;
    
    // Get appropriate label for the record type
    const recordTypeLabel = document.getElementById('modal-record-type').options[
        document.getElementById('modal-record-type').selectedIndex
    ].text;
    
    // Get an appropriate patient name based on the patient ID
    // In a real app, you would look this up from your database
    let patientName = "New Patient";
    const existingPatient = sampleRecords.find(record => record.patientId === patientId);
    if (existingPatient) {
        patientName = existingPatient.patientName;
    }
    
    // Generate a new record ID
    const newId = `REC-${String(sampleRecords.length + 1).padStart(3, '0')}`;
    
    // Create a new record object
    const newRecord = {
        id: newId,
        patientId,
        patientName,
        recordType,
        recordTypeLabel,
        createdDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString().split('T')[0],
        createdBy: 'Dr. Smith', // This would typically be the logged-in user
        title: recordTitle,
        details: recordDetails,
        attachments: [] // In a real app, you would process uploaded files here
    };
    
    // Add to our records array
    sampleRecords.push(newRecord);
    filteredRecords = [...sampleRecords]; // Update filtered records
    
    // Reset form and close modal
    recordForm.reset();
    closeModal(recordModal);
    
    // Update table to show the new record
    populateRecordsTable();
}

// ---- PAGINATION HANDLERS ----
function handlePrevPage() {
    if (currentPage > 1) {
        currentPage--;
        populateRecordsTable();
    }
}

function handleNextPage() {
    const totalPages = Math.ceil(filteredRecords.length / recordsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        populateRecordsTable();
    }
}

// ---- EVENT LISTENERS ----
// Initialize theme and event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Theme toggle listener
    modeToggle.addEventListener('click', toggleTheme);
    
    // Navigation menu toggle
    menuToggle.addEventListener('click', toggleMenu);
    
    // Close menu when clicking outside
    document.addEventListener('click', closeMenuOnOutsideClick);
    
    // Close menu when resizing window
    window.addEventListener('resize', closeMenuOnResize);
    
    // Date range filter handler
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', toggleCustomDateRange);
    }
    
    // Modal handlers
    if (addRecordBtn) {
        addRecordBtn.addEventListener('click', () => {
            // Reset form and update modal title
            recordForm.reset();
            document.querySelector('#record-modal .modal-header h2').textContent = 'Add Medical Record';
            openModal(recordModal);
        });
    }
    
    // Close modal buttons
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
    
    // Form submission handlers
    if (recordForm) {
        recordForm.addEventListener('submit', handleRecordFormSubmit);
    }
    
    if (recordFilters) {
        recordFilters.addEventListener('submit', handleFilterSubmit);
    }
    
    // Reset filters button
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Select all checkbox
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', handleSelectAll);
    }
    
    // Event delegation for record checkboxes
    if (recordsTable) {
        recordsTable.addEventListener('change', (event) => {
            if (event.target.classList.contains('record-checkbox')) {
                handleRecordCheckboxChange();
            }
        });
    }
    
    // Pagination handlers
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', handlePrevPage);
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', handleNextPage);
    }
    
    // Initial table population
    populateRecordsTable();
});

// Add a media query listener for responsive design
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        // Only automatically switch if user hasn't manually set a preference
        if (e.matches) {
            document.body.classList.add('dark-mode');
            modeIcon.textContent = '🌙';
        } else {
            document.body.classList.remove('dark-mode');
            modeIcon.textContent = '☀️';
        }
    }
});
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Update: ${document.lastModified}`;
