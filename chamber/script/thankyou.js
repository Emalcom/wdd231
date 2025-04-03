// Process URL parameters and display application information
document.addEventListener('DOMContentLoaded', function() {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    
    // Fields to display from form
    const requiredFields = [
        { param: 'firstname', label: 'First Name' },
        { param: 'lastname', label: 'Last Name' },
        { param: 'email', label: 'Email' },
        { param: 'phone', label: 'Phone Number' },
        { param: 'business', label: 'Business/Organization' },
        { param: 'membership', label: 'Membership Level', format: formatMembership },
        { param: 'timestamp', label: 'Application Date', format: formatTimestamp }
    ];
    
    // Format timestamp
    function formatTimestamp(timestamp) {
        try {
            const date = new Date(timestamp);
            return date.toLocaleString();
        } catch (e) {
            return timestamp;
        }
    }
    
    // Format membership level
    function formatMembership(level) {
        const memberships = {
            'np': 'Non-Profit',
            'bronze': 'Bronze',
            'silver': 'Silver',
            'gold': 'Gold'
        };
        
        return memberships[level] || level;
    }
    
    // Get the container to display the application details
    const applicationSummary = document.getElementById('application-summary');
    
    // Create table to display application details
    const table = document.createElement('table');
    table.classList.add('application-table');
    
    // Create table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    
    const fieldHeader = document.createElement('th');
    fieldHeader.textContent = 'Field';
    
    const valueHeader = document.createElement('th');
    valueHeader.textContent = 'Information';
    
    headerRow.appendChild(fieldHeader);
    headerRow.appendChild(valueHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add rows for each field
    requiredFields.forEach(field => {
        if (urlParams.has(field.param)) {
            const row = document.createElement('tr');
            
            const labelCell = document.createElement('td');
            labelCell.textContent = field.label;
            
            const valueCell = document.createElement('td');
            let value = urlParams.get(field.param);
            
            // Format the value if a format function exists
            if (field.format) {
                value = field.format(value);
            }
            
            valueCell.textContent = value;
            
            row.appendChild(labelCell);
            row.appendChild(valueCell);
            tbody.appendChild(row);
        }
    });
    
    // Append tbody to the table
    table.appendChild(tbody);
    
    // Add table to the application summary container
    applicationSummary.appendChild(table);
    
    // If no parameters were found, display a message
    if (tbody.children.length === 0) {
        const message = document.createElement('p');
        message.textContent = 'No application details available.';
        applicationSummary.appendChild(message);
    }
});