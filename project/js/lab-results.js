// lab-results.js - Main JavaScript file for the Lab Results page

// Since modal.js might be missing, let's implement the modal functions here
function initModal(modalId, buttonId) {
    const modal = document.getElementById(modalId);
    if (!modal) {
        console.error(`Modal with ID ${modalId} not found`);
        return;
    }

    // If button ID is provided, attach event listener to open modal
    if (buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => openModal(modalId));
        } else {
            console.warn(`Button with ID ${buttonId} not found`);
        }
    }

    // Add event listeners to close modal buttons within this modal
    const closeButtons = modal.querySelectorAll('.close-modal, .close-modal-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => closeModal(modalId));
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.classList.add('modal-open');
    } else {
        console.error(`Modal with ID ${modalId} not found`);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
    } else {
        console.error(`Modal with ID ${modalId} not found`);
    }
}

// Implementing a simple lazyLoad function if it's missing
function lazyLoad() {
    const lazyImages = document.querySelectorAll('.lazy-load');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(image => imageObserver.observe(image));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(image => {
            if (image.dataset.src) {
                image.src = image.dataset.src;
                image.removeAttribute('data-src');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize page
    initPage();
    
    // Initialize modals
    initModal('upload-results-modal', 'upload-results-btn');
    initModal('view-result-modal');
    initModal('order-test-modal', 'order-test-btn');
    
    // Setup event listeners
    setupEventListeners();
    
    // Load lab results data
    loadLabResults();
    
    // Initialize test type dropdown
    initTestTypeDropdown();
    
    // Initialize lazy loading for images
    lazyLoad();
});

// Function to initialize the page
function initPage() {
    console.log('Initializing Lab Results page...');
    
    // Mode toggle functionality
    const modeSwitch = document.getElementById('mode-switch');
    if (modeSwitch) {
        modeSwitch.addEventListener('click', toggleMode);
        
        // Check if dark mode was previously set
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('night-mode');
            const modeIcon = modeSwitch.querySelector('.mode-icon');
            if (modeIcon) {
                modeIcon.textContent = '🌙';
            }
        }
    }
    
    // Initialize date range filters
    const dateRangeSelect = document.getElementById('test-date-range');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', toggleCustomDateRange);
    }
    
    // Menu toggle for mobile
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('menu-open');
            nav.classList.toggle('active');
        });
    }
}

// Function to toggle between light and dark mode
function toggleMode() {
    const modeIcon = document.querySelector('.mode-icon');
    document.body.classList.toggle('night-mode');
    
    if (document.body.classList.contains('night-mode')) {
        if (modeIcon) modeIcon.textContent = '🌙';
        localStorage.setItem('darkMode', 'true');
    } else {
        if (modeIcon) modeIcon.textContent = '☀️';
        localStorage.setItem('darkMode', 'false');
    }
}

// Function to toggle custom date range inputs
function toggleCustomDateRange() {
    const customDateRangeInputs = document.querySelectorAll('.custom-date-range');
    if (this.value === 'custom') {
        customDateRangeInputs.forEach(input => input.style.display = 'block');
    } else {
        customDateRangeInputs.forEach(input => input.style.display = 'none');
    }
}

// Function to set up all event listeners
function setupEventListeners() {
    // Filters form submission
    const filtersForm = document.getElementById('results-filters');
    if (filtersForm) {
        filtersForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
    
    // Reset filters button
    const resetFiltersBtn = document.getElementById('reset-test-filters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetFilters);
    }
    
    // Upload results form submission
    const uploadForm = document.getElementById('upload-results-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleUploadResults();
        });
    }
    
    // Order test form submission
    const orderTestForm = document.getElementById('order-test-form');
    if (orderTestForm) {
        orderTestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleOrderTest();
        });
    }
    
    // Test category change for ordering tests
    const testCategory = document.getElementById('order-test-category');
    if (testCategory) {
        testCategory.addEventListener('change', updateSpecificTests);
    }
    
    // Pagination buttons
    const prevButton = document.getElementById('prev-results-page');
    if (prevButton) {
        prevButton.addEventListener('click', () => changePage(-1));
    }
    
    const nextButton = document.getElementById('next-results-page');
    if (nextButton) {
        nextButton.addEventListener('click', () => changePage(1));
    }
    
    // Select all checkbox
    const selectAll = document.getElementById('select-all-results');
    if (selectAll) {
        selectAll.addEventListener('change', toggleSelectAllResults);
    }
    
    // Export and print buttons
    const exportBtn = document.getElementById('export-results-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportSelectedResults);
    }
    
    const printBtn = document.getElementById('print-results-btn');
    if (printBtn) {
        printBtn.addEventListener('click', printSelectedResults);
    }
    
    // Result modal buttons
    const downloadBtn = document.getElementById('download-result-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadResult);
    }
    
    const printResultBtn = document.getElementById('print-result-btn');
    if (printResultBtn) {
        printResultBtn.addEventListener('click', printResult);
    }
    
    const shareBtn = document.getElementById('share-result-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', shareResult);
    }
}

// Function to load lab results data
function loadLabResults() {
    // For demo purposes, we'll use some mock data
    const mockData = generateMockLabResults();
    
    // Clear loading message
    const resultsTableBody = document.getElementById('results-list');
    if (!resultsTableBody) {
        console.error("Results list element not found");
        return;
    }
    
    resultsTableBody.innerHTML = '';
    
    // Insert mock data
    mockData.forEach(result => {
        const row = createLabResultRow(result);
        resultsTableBody.appendChild(row);
    });
    
    // Update pagination info
    updatePaginationInfo(1, Math.ceil(mockData.length / 10));
    
    // Add click event to view buttons
    document.querySelectorAll('.view-result-btn').forEach(button => {
        button.addEventListener('click', function() {
            const resultId = this.getAttribute('data-id');
            viewResultDetails(resultId);
        });
    });
}

// Function to generate mock lab results data
function generateMockLabResults() {
    const statuses = ['pending', 'completed', 'abnormal', 'critical', 'ordered'];
    const testTypes = ['blood', 'urine', 'imaging', 'pathology', 'microbiology', 'genetic'];
    const physicians = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown', 'Dr. Jones'];
    
    const results = [];
    for (let i = 1; i <= 30; i++) {
        const testDate = new Date(2025, Math.floor(Math.random() * 3), Math.floor(Math.random() * 28) + 1);
        const resultsDate = new Date(testDate);
        resultsDate.setDate(testDate.getDate() + Math.floor(Math.random() * 5) + 1);
        
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        results.push({
            id: `LAB-${10000 + i}`,
            patientId: `PT-${20000 + Math.floor(Math.random() * 1000)}`,
            patientName: `Patient ${i}`,
            testType: testTypes[Math.floor(Math.random() * testTypes.length)],
            testDate: testDate.toISOString().split('T')[0],
            resultsDate: status === 'ordered' ? '' : resultsDate.toISOString().split('T')[0],
            status: status,
            orderedBy: physicians[Math.floor(Math.random() * physicians.length)]
        });
    }
    
    return results;
}

// Function to create a table row for a lab result
function createLabResultRow(result) {
    const row = document.createElement('tr');
    
    // Status class
    row.classList.add(`status-${result.status}`);
    
    // Create cells
    row.innerHTML = `
        <td><input type="checkbox" class="result-checkbox" aria-label="Select this result"></td>
        <td>${result.patientId}</td>
        <td>${result.patientName}</td>
        <td>${capitalizeFirstLetter(result.testType)}</td>
        <td>${formatDate(result.testDate)}</td>
        <td>${result.resultsDate ? formatDate(result.resultsDate) : '-'}</td>
        <td><span class="status-badge ${result.status}">${capitalizeFirstLetter(result.status)}</span></td>
        <td>${result.orderedBy}</td>
        <td>
            <button class="action-btn view-result-btn" data-id="${result.id}" aria-label="View details">👁️</button>
            <button class="action-btn edit-result-btn" data-id="${result.id}" aria-label="Edit">✏️</button>
            <button class="action-btn delete-result-btn" data-id="${result.id}" aria-label="Delete">🗑️</button>
        </td>
    `;
    
    return row;
}

// Function to update pagination information
function updatePaginationInfo(currentPage, totalPages) {
    const currentPageEl = document.getElementById('current-results-page');
    const totalPagesEl = document.getElementById('total-results-pages');
    const prevButton = document.getElementById('prev-results-page');
    const nextButton = document.getElementById('next-results-page');
    
    if (currentPageEl) currentPageEl.textContent = currentPage;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;
    
    // Update button states
    if (prevButton) prevButton.disabled = currentPage <= 1;
    if (nextButton) nextButton.disabled = currentPage >= totalPages;
}

// Function to change the current page
function changePage(direction) {
    const currentPageEl = document.getElementById('current-results-page');
    const totalPagesEl = document.getElementById('total-results-pages');
    
    if (!currentPageEl || !totalPagesEl) return;
    
    const currentPage = parseInt(currentPageEl.textContent);
    const totalPages = parseInt(totalPagesEl.textContent);
    
    const newPage = currentPage + direction;
    
    if (newPage >= 1 && newPage <= totalPages) {
        // For a real application, this would fetch the data for the new page
        // For this demo, we'll just update the page number
        updatePaginationInfo(newPage, totalPages);
    }
}

// Function to apply filters to lab results
function applyFilters() {
    console.log('Applying filters...');
    
    // Get filter values
    const patientSearch = document.getElementById('patient-search')?.value || '';
    const testType = document.getElementById('test-type')?.value || '';
    const resultStatus = document.getElementById('results-status')?.value || '';
    const dateRange = document.getElementById('test-date-range')?.value || '';
    
    // In a real application, these values would be used to fetch filtered data
    // For this demo, we'll just reload the mock data
    loadLabResults();
    
    // Show a notification
    showNotification('Filters applied successfully');
}

// Function to reset filters
function resetFilters() {
    // Reset all form fields
    const filtersForm = document.getElementById('results-filters');
    if (filtersForm) {
        filtersForm.reset();
    }
    
    // Hide custom date range inputs
    document.querySelectorAll('.custom-date-range').forEach(input => input.style.display = 'none');
    
    // Reload results
    loadLabResults();
    
    // Show notification
    showNotification('Filters have been reset');
}

// Function to view result details
function viewResultDetails(resultId) {
    console.log(`Viewing details for result ${resultId}`);
    
    // In a real application, we would fetch the details for this result
    // For this demo, we'll just show some mock data
    const detailsContainer = document.getElementById('result-details-container');
    if (!detailsContainer) return;
    
    // Show loading state
    detailsContainer.innerHTML = '<div class="patient-loading">Loading result details...</div>';
    
    // Simulate network delay
    setTimeout(() => {
        // Create mock details
        detailsContainer.innerHTML = `
            <div class="result-details">
                <div class="result-header">
                    <h3>Lab Result #${resultId}</h3>
                    <p><strong>Status:</strong> <span class="status-badge completed">Completed</span></p>
                </div>
                
                <div class="result-section">
                    <h4>Patient Information</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Patient ID</label>
                            <p>PT-20345</p>
                        </div>
                        <div class="form-group">
                            <label>Patient Name</label>
                            <p>John Doe</p>
                        </div>
                        <div class="form-group">
                            <label>Date of Birth</label>
                            <p>05/15/1985</p>
                        </div>
                    </div>
                </div>
                
                <div class="result-section">
                    <h4>Test Information</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Test Type</label>
                            <p>Blood Test - Complete Blood Count (CBC)</p>
                        </div>
                        <div class="form-group">
                            <label>Test Date</label>
                            <p>04/10/2025</p>
                        </div>
                        <div class="form-group">
                            <label>Results Date</label>
                            <p>04/12/2025</p>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Ordered By</label>
                            <p>Dr. Smith</p>
                        </div>
                        <div class="form-group">
                            <label>Analyzed By</label>
                            <p>Dr. Johnson</p>
                        </div>
                    </div>
                </div>
                
                <div class="result-section">
                    <h4>Test Results</h4>
                    <table class="results-data-table">
                        <thead>
                            <tr>
                                <th>Test Parameter</th>
                                <th>Result</th>
                                <th>Reference Range</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>WBC (White Blood Cell)</td>
                                <td>7.8 × 10³/μL</td>
                                <td>4.5-11.0 × 10³/μL</td>
                                <td><span class="status-badge normal">Normal</span></td>
                            </tr>
                            <tr>
                                <td>RBC (Red Blood Cell)</td>
                                <td>5.2 × 10⁶/μL</td>
                                <td>4.5-5.9 × 10⁶/μL</td>
                                <td><span class="status-badge normal">Normal</span></td>
                            </tr>
                            <tr>
                                <td>HGB (Hemoglobin)</td>
                                <td>15.1 g/dL</td>
                                <td>13.5-17.5 g/dL</td>
                                <td><span class="status-badge normal">Normal</span></td>
                            </tr>
                            <tr>
                                <td>HCT (Hematocrit)</td>
                                <td>40.3%</td>
                                <td>41.0-53.0%</td>
                                <td><span class="status-badge abnormal">Low</span></td>
                            </tr>
                            <tr>
                                <td>PLT (Platelets)</td>
                                <td>290 × 10³/μL</td>
                                <td>150-450 × 10³/μL</td>
                                <td><span class="status-badge normal">Normal</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="result-section">
                    <h4>Notes & Interpretation</h4>
                    <p>Overall results are within normal limits except for a slightly low hematocrit level. This is likely not clinically significant but may warrant follow-up if the patient shows any symptoms of anemia. No further immediate action recommended.</p>
                </div>
            </div>
        `;
        
        // Update the modal title
        const viewResultTitle = document.getElementById('view-result-title');
        if (viewResultTitle) {
            viewResultTitle.textContent = `Lab Result #${resultId} Details`;
        }
        
        // Open the modal
        openModal('view-result-modal');
    }, 800);
}

// Function to initialize the test type dropdown for ordering tests
function initTestTypeDropdown() {
    // Define test options for each category
    const testOptions = {
        blood: ['Complete Blood Count (CBC)', 'Comprehensive Metabolic Panel (CMP)', 'Lipid Panel', 'Thyroid Function Tests', 'Hemoglobin A1C', 'Coagulation Panel', 'Vitamin D Level'],
        urine: ['Urinalysis', 'Urine Culture', 'Urine Microscopy', '24-Hour Urine Collection', 'Drug Screening'],
        imaging: ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'PET Scan', 'Mammogram', 'Bone Density Scan'],
        pathology: ['Biopsy Analysis', 'Cytology', 'Histology', 'Immunohistochemistry', 'Molecular Pathology'],
        microbiology: ['Bacterial Culture', 'Viral Culture', 'Fungal Culture', 'Sensitivity Testing', 'PCR Testing'],
        genetic: ['Karyotype', 'FISH Analysis', 'DNA Sequencing', 'Whole Exome Sequencing', 'Genetic Counseling']
    };
    
    // Add event listener to test category dropdown
    const categorySelect = document.getElementById('order-test-category');
    const specificTestsSelect = document.getElementById('specific-tests');
    
    if (!categorySelect || !specificTestsSelect) return;
    
    categorySelect.addEventListener('change', function() {
        const category = this.value;
        specificTestsSelect.innerHTML = '';
        
        if (category && testOptions[category]) {
            testOptions[category].forEach(test => {
                const option = document.createElement('option');
                option.value = test.toLowerCase().replace(/\s+/g, '-');
                option.textContent = test;
                specificTestsSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Please select a category first';
            specificTestsSelect.appendChild(option);
        }
    });
}

// Function to update specific tests dropdown based on selected category
function updateSpecificTests() {
    // This function is actually handled in the event listener in initTestTypeDropdown
    const categorySelect = document.getElementById('order-test-category');
    const specificTestsSelect = document.getElementById('specific-tests');
    
    if (!categorySelect || !specificTestsSelect) return;
    
    const category = categorySelect.value;
    specificTestsSelect.innerHTML = '';
    
    // Define test options for each category
    const testOptions = {
        blood: ['Complete Blood Count (CBC)', 'Comprehensive Metabolic Panel (CMP)', 'Lipid Panel', 'Thyroid Function Tests', 'Hemoglobin A1C', 'Coagulation Panel', 'Vitamin D Level'],
        urine: ['Urinalysis', 'Urine Culture', 'Urine Microscopy', '24-Hour Urine Collection', 'Drug Screening'],
        imaging: ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'PET Scan', 'Mammogram', 'Bone Density Scan'],
        pathology: ['Biopsy Analysis', 'Cytology', 'Histology', 'Immunohistochemistry', 'Molecular Pathology'],
        microbiology: ['Bacterial Culture', 'Viral Culture', 'Fungal Culture', 'Sensitivity Testing', 'PCR Testing'],
        genetic: ['Karyotype', 'FISH Analysis', 'DNA Sequencing', 'Whole Exome Sequencing', 'Genetic Counseling']
    };
    
    if (category && testOptions[category]) {
        testOptions[category].forEach(test => {
            const option = document.createElement('option');
            option.value = test.toLowerCase().replace(/\s+/g, '-');
            option.textContent = test;
            specificTestsSelect.appendChild(option);
        });
    } else {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Please select a category first';
        specificTestsSelect.appendChild(option);
    }
}

// Function to handle uploading test results
function handleUploadResults() {
    // Get form values
    const patientId = document.getElementById('upload-patient-id')?.value || '';
    const testType = document.getElementById('upload-test-type')?.value || '';
    const testDate = document.getElementById('upload-test-date')?.value || '';
    const resultStatus = document.getElementById('upload-result-status')?.value || '';
    const resultSummary = document.getElementById('result-summary')?.value || '';
    
    // In a real application, these values would be sent to a server
    console.log('Uploading test results:', { patientId, testType, testDate, resultStatus, resultSummary });
    
    // Close the modal
    closeModal('upload-results-modal');
    
    // Reset the form
    const uploadForm = document.getElementById('upload-results-form');
    if (uploadForm) {
        uploadForm.reset();
    }
    
    // Show success notification
    showNotification('Test results uploaded successfully');
    
    // Reload results
    loadLabResults();
}

// Function to handle ordering a new test
function handleOrderTest() {
    // Get form values
    const patientId = document.getElementById('order-patient-id')?.value || '';
    const testCategory = document.getElementById('order-test-category')?.value || '';
    const specificTestsSelect = document.getElementById('specific-tests');
    const priority = document.getElementById('test-priority')?.value || '';
    
    // Get selected tests
    const specificTests = [];
    if (specificTestsSelect) {
        Array.from(specificTestsSelect.selectedOptions).forEach(option => {
            specificTests.push(option.value);
        });
    }
    
    // In a real application, these values would be sent to a server
    console.log('Ordering new test:', { patientId, testCategory, specificTests, priority });
    
    // Close the modal
    closeModal('order-test-modal');
    
    // Reset the form
    const orderForm = document.getElementById('order-test-form');
    if (orderForm) {
        orderForm.reset();
    }
    
    // Show success notification
    showNotification('Test ordered successfully');
    
    // Reload results
    loadLabResults();
}

// Function to toggle select all results
function toggleSelectAllResults() {
    const selectAll = document.getElementById('select-all-results');
    if (!selectAll) return;
    
    const checkboxes = document.querySelectorAll('.result-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

// Function to export selected results
function exportSelectedResults() {
    const selectedCount = getSelectedResultsCount();
    
    if (selectedCount === 0) {
        showNotification('Please select at least one result to export', 'error');
        return;
    }
    
    showNotification(`Exporting ${selectedCount} result(s)...`);
    
    // In a real application, this would initiate a download
    setTimeout(() => {
        showNotification(`${selectedCount} result(s) exported successfully`);
    }, 1500);
}

// Function to print selected results
function printSelectedResults() {
    const selectedCount = getSelectedResultsCount();
    
    if (selectedCount === 0) {
        showNotification('Please select at least one result to print', 'error');
        return;
    }
    
    showNotification(`Printing ${selectedCount} result(s)...`);
    
    // In a real application, this would open a print dialog
    setTimeout(() => {
        showNotification(`${selectedCount} result(s) sent to printer`);
    }, 1500);
}

// Function to get the count of selected results
function getSelectedResultsCount() {
    return document.querySelectorAll('.result-checkbox:checked').length;
}

// Functions for result modal buttons
function downloadResult() {
    showNotification('Downloading result...');
    
    // In a real application, this would initiate a download
    setTimeout(() => {
        showNotification('Result downloaded successfully');
    }, 1000);
}

function printResult() {
    showNotification('Preparing result for printing...');
    
    // In a real application, this would open a print dialog
    setTimeout(() => {
        showNotification('Result sent to printer');
    }, 1000);
}

function shareResult() {
    showNotification('Preparing to share result...');
    
    // In a real application, this would open a sharing dialog
    setTimeout(() => {
        showNotification('Share options opened');
    }, 1000);
}

// Helper functions
function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
}

function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Function to show a notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Append to body
    document.body.appendChild(notification);
    
    // Add active class after a small delay (for animation)
    setTimeout(() => {
        notification.classList.add('active');
    }, 10);
    
    // Remove notification after a delay
    setTimeout(() => {
        notification.classList.remove('active');
        
        // Remove from DOM after fade out
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = `Last Update: ${document.lastModified}`;
