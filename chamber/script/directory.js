// JavaScript for the Directory Page

// Create directory content container in main
document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('main');
    const directoryDiv = document.createElement('div');
    directoryDiv.id = 'directory';
    directoryDiv.className = 'grid';
    main.appendChild(directoryDiv);
});

// Get DOM elements
const gridBtn = document.querySelector('#gridBtn');
const listBtn = document.querySelector('#listBtn');

// Add event listeners for view toggle buttons
gridBtn.addEventListener('click', () => {
    const directory = document.getElementById('directory');
    directory.className = 'grid';
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
});

listBtn.addEventListener('click', () => {
    const directory = document.getElementById('directory');
    directory.className = 'list';
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
});

// Fetch and display member data
async function getMembers() {
    try {
        const response = await fetch('data/members.json');
        const data = await response.json();
        displayMembers(data);
    } catch (error) {
        console.error('Error fetching members data:', error);
        document.getElementById('directory').innerHTML = '<p>Error loading member data. Please try again later.</p>';
    }
}

function displayMembers(members) {
    const directory = document.getElementById('directory');
    
    // Clear the directory
    directory.innerHTML = '';
    
    // Display each member
    members.forEach(member => {
        // Create card element
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Get membership level text
        let membershipText = '';
        switch (member.membershipLevel) {
            case 1:
                membershipText = 'Member';
                break;
            case 2:
                membershipText = 'Silver Member';
                break;
            case 3:
                membershipText = 'Gold Member';
                break;
            default:
                membershipText = 'Member';
        }
        
        // Create card content
        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} Logo">
            <h3>${member.name}</h3>
            <p>${member.address}</p>
            <p>${member.phone}</p>
            <a href="${member.website}" target="_blank">Visit Website</a>
            <span class="membership">${membershipText}</span>
        `;
        
        // Add card to directory
        directory.appendChild(card);
    });
}

// Load members data when page loads
window.addEventListener('load', getMembers);