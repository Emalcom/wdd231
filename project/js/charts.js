// charts.js - Handles chart visualization for the dashboard

/**
 * Department utilization data for demonstration
 */
const departmentData = [
    { name: 'Cardiology', patients: 147, capacity: 200 },
    { name: 'Neurology', patients: 89, capacity: 120 },
    { name: 'Pediatrics', patients: 104, capacity: 150 },
    { name: 'Orthopedics', patients: 73, capacity: 100 },
    { name: 'Oncology', patients: 56, capacity: 80 }
  ];
  
  /**
   * Initializes charts on the dashboard
   */
  export async function initializeCharts() {
    console.log('Initializing charts...');
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Department utilization chart
        const chartContainer = document.getElementById('department-chart');
        if (chartContainer) {
          createDepartmentChart(chartContainer);
        }
        
        // Detailed analytics chart for modal
        const detailedAnalytics = document.getElementById('detailed-analytics');
        if (detailedAnalytics) {
          createDetailedAnalytics(detailedAnalytics);
        }
        
        resolve();
      }, 700);
    });
  }
  
  /**
   * Creates a simple horizontal bar chart for department utilization
   */
  function createDepartmentChart(container) {
    // Clear the container
    container.innerHTML = '';
    
    // Create a title
    const title = document.createElement('h4');
    title.textContent = 'Current Department Usage';
    container.appendChild(title);
    
    // Create chart container
    const chartElement = document.createElement('div');
    chartElement.className = 'utilization-bars';
    
    // Add each department bar
    departmentData.forEach(dept => {
      const utilizationPercentage = Math.round((dept.patients / dept.capacity) * 100);
      
      // Create bar container
      const barContainer = document.createElement('div');
      barContainer.className = 'utilization-bar-container';
      
      // Create label
      const label = document.createElement('div');
      label.className = 'dept-label';
      label.textContent = dept.name;
      
      // Create bar
      const bar = document.createElement('div');
      bar.className = 'utilization-bar';
      
      // Create progress indicator
      const progress = document.createElement('div');
      progress.className = 'utilization-progress';
      progress.style.width = `${utilizationPercentage}%`;
      
      // Apply color based on utilization
      if (utilizationPercentage < 50) {
        progress.classList.add('low-utilization');
      } else if (utilizationPercentage < 80) {
        progress.classList.add('medium-utilization');
      } else {
        progress.classList.add('high-utilization');
      }
      
      // Create percentage indicator
      const percentage = document.createElement('span');
      percentage.className = 'utilization-percentage';
      percentage.textContent = `${utilizationPercentage}%`;
      
      // Assemble components
      bar.appendChild(progress);
      barContainer.appendChild(label);
      barContainer.appendChild(bar);
      barContainer.appendChild(percentage);
      chartElement.appendChild(barContainer);
    });
    
    container.appendChild(chartElement);
  }
  
  /**
   * Creates detailed analytics for the modal view
   */
  function createDetailedAnalytics(container) {
    // Clear the container
    container.innerHTML = '';
    
    // Create tabs for different analytics views
    const tabsContainer = document.createElement('div');
    tabsContainer.className = 'analytics-tabs';
    
    const tabs = ['Department Utilization', 'Patient Demographics', 'Daily Admissions'];
    
    tabs.forEach((tab, index) => {
      const tabButton = document.createElement('button');
      tabButton.className = 'analytics-tab';
      if (index === 0) tabButton.classList.add('active');
      tabButton.textContent = tab;
      tabButton.addEventListener('click', () => {
        // Remove active class from all tabs
        document.querySelectorAll('.analytics-tab').forEach(t => {
          t.classList.remove('active');
        });
        // Add active class to clicked tab
        tabButton.classList.add('active');
        
        // Update content based on selected tab
        updateAnalyticsContent(container, tab);
      });
      
      tabsContainer.appendChild(tabButton);
    });
    
    container.appendChild(tabsContainer);
    
    // Add content container
    const contentContainer = document.createElement('div');
    contentContainer.className = 'analytics-content';
    container.appendChild(contentContainer);
    
    // Initial view
    updateAnalyticsContent(container, 'Department Utilization');
  }
  
  /**
   * Updates analytics content based on selected tab
   */
  function updateAnalyticsContent(container, selectedTab) {
    const contentContainer = container.querySelector('.analytics-content');
    if (!contentContainer) return;
    
    contentContainer.innerHTML = '';
    
    switch (selectedTab) {
      case 'Department Utilization':
        createDepartmentDetailView(contentContainer);
        break;
      case 'Patient Demographics':
        createDemographicsView(contentContainer);
        break;
      case 'Daily Admissions':
        createAdmissionsView(contentContainer);
        break;
      default:
        contentContainer.textContent = 'No data available for this view';
    }
  }
  
  /**
   * Creates detailed department utilization view
   */
  function createDepartmentDetailView(container) {
    const detailContainer = document.createElement('div');
    detailContainer.className = 'department-details';
    
    // Add table with more details
    const table = document.createElement('table');
    table.className = 'analytics-table';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Department</th>
        <th>Current Patients</th>
        <th>Capacity</th>
        <th>Utilization</th>
        <th>Available Beds</th>
      </tr>
    `;
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    departmentData.forEach(dept => {
      const utilizationPercentage = Math.round((dept.patients / dept.capacity) * 100);
      const availableBeds = dept.capacity - dept.patients;
      
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${dept.name}</td>
        <td>${dept.patients}</td>
        <td>${dept.capacity}</td>
        <td>
          <div class="mini-progress-bar">
            <div class="mini-progress" style="width: ${utilizationPercentage}%"></div>
            <span>${utilizationPercentage}%</span>
          </div>
        </td>
        <td>${availableBeds}</td>
      `;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    
    detailContainer.appendChild(table);
    container.appendChild(detailContainer);
  }
  
  /**
   * Creates patient demographics view
   */
  function createDemographicsView(container) {
    const demographicsContainer = document.createElement('div');
    demographicsContainer.className = 'demographics-container';
    demographicsContainer.innerHTML = `
      <p>Patient demographics data visualization would appear here.</p>
      <p>This would include age distribution, gender breakdown, and common conditions.</p>
    `;
    container.appendChild(demographicsContainer);
  }
  
  /**
   * Creates daily admissions view
   */
  function createAdmissionsView(container) {
    const admissionsContainer = document.createElement('div');
    admissionsContainer.className = 'admissions-container';
    admissionsContainer.innerHTML = `
      <p>Daily admissions trend visualization would appear here.</p>
      <p>This would show patient admissions over time and by department.</p>
    `;
    container.appendChild(admissionsContainer);
  }