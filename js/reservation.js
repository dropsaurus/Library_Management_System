document.addEventListener('DOMContentLoaded', async () => {
  await loadRoomsWithAvailability();
  setupTabs();
  setupFilters();
});

async function loadRoomsWithAvailability() {
  // Get current filter values
  const capacity = document.getElementById('capacity').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const search = document.getElementById('search').value;
  
  // Show loading indicator
  document.getElementById('rooms-grid').innerHTML = `
    <div class="loading-indicator">
      <p>Loading rooms...</p>
    </div>
  `;
  
  try {
    // Construct URL with query parameters
    let url = '../api/get_room_availability.php';
    const params = new URLSearchParams();
    
    if (capacity) params.append('capacity', capacity);
    if (date) params.append('date', date);
    if (time) params.append('time', time);
    if (search) params.append('search', search);
    
    // Add params to URL if any exist
    if ([...params].length > 0) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'success') {
      displayRooms(data.data);
    } else {
      console.error('Error loading rooms:', data.message);
      document.getElementById('rooms-grid').innerHTML = '<p class="error-message">Unable to load rooms. Please try again later.</p>';
    }
  } catch (error) {
    console.error('Fetch error:', error);
    document.getElementById('rooms-grid').innerHTML = '<p class="error-message">Network error. Please check your connection and try again.</p>';
  }
}

function displayRooms(rooms) {
  const roomsGrid = document.getElementById('rooms-grid');
  
  if (!rooms || rooms.length === 0) {
    roomsGrid.innerHTML = '<p>No rooms match your search criteria.</p>';
    return;
  }
  
  // Clear existing content
  roomsGrid.innerHTML = '';
  
  // Create room cards
  rooms.forEach(room => {
    const isAvailable = room.STATUS === 'Available';
    
    const roomCard = document.createElement('div');
    roomCard.className = 'room-card';
    
    roomCard.innerHTML = `
      <div class="room-details">
        <h3 class="room-title">Room ${room.ROOM_ID}</h3>
        <p class="room-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Capacity: ${room.ROOM_CAPACITY} people
        </p>
        <p class="room-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Status: ${room.STATUS}
        </p>
        <button class="reservation-button" onclick="reserveRoom(${room.ROOM_ID})" ${!isAvailable ? 'disabled' : ''}>
          ${isAvailable ? 'Reserve Room' : 'Not Available'}
          ${isAvailable ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" 
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>` : ''}
        </button>
      </div>
    `;
    
    roomsGrid.appendChild(roomCard);
  });
}

function setupTabs() {
  const tabs = document.querySelectorAll('.tab-button');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Show relevant content
      const tabId = tab.getAttribute('data-tab');
      document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
      });
      
      document.getElementById(tabId).style.display = 'block';
    });
  });
}

function setupFilters() {
  // Filter functionality
  const filterInputs = document.querySelectorAll('.search-filters input, .search-filters select');
  
  filterInputs.forEach(input => {
    input.addEventListener('change', () => {
      loadRoomsWithAvailability();
    });
    
    if (input.type === 'text') {
      // Debounce search input to avoid too many API calls
      let debounceTimer;
      input.addEventListener('keyup', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          loadRoomsWithAvailability();
        }, 500); // Wait 500ms after user stops typing
      });
    }
  });
  
  // Set default date to today if empty
  const dateInput = document.getElementById('date');
  if (!dateInput.value) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }
}

function reserveRoom(roomId) {
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('customer_id') || false;
  
  if (!isLoggedIn) {
    // Redirect to login page with a return URL
    window.location.href = `login.html?redirect=reservation.html`;
    return;
  }
  
  // Redirect to reservation form page or show modal
  alert(`Room ${roomId} reservation functionality will be implemented here.`);
}

async function loadMyReservations() {
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('customer_id') || false;
  
  if (!isLoggedIn) {
    // Show login prompt
    document.getElementById('my-reservations-content').innerHTML = `
      <div class="login-prompt">
        <p>Please log in to view your reservations.</p>
        <a href="login.html?redirect=reservation.html" class="btn">Login</a>
      </div>
    `;
    return;
  }
  
  try {
    const response = await fetch('../api/get_reservations.php');
    const data = await response.json();
    
    if (data.status === 'success') {
      displayMyReservations(data.data);
    } else {
      console.error('Error loading reservations:', data.message);
      document.getElementById('my-reservations-content').innerHTML = '<p class="error-message">Unable to load your reservations. Please try again later.</p>';
    }
  } catch (error) {
    console.error('Fetch error:', error);
    document.getElementById('my-reservations-content').innerHTML = '<p class="error-message">Network error. Please check your connection and try again.</p>';
  }
}

function displayMyReservations(reservations) {
  const reservationsContainer = document.getElementById('my-reservations-content');
  
  if (!reservations || reservations.length === 0) {
    reservationsContainer.innerHTML = '<p>You have no current reservations.</p>';
    return;
  }
  
  // Create table to display reservations
  let html = `
    <table class="reservation-table">
      <thead>
        <tr>
          <th>Room</th>
          <th>Start Time</th>
          <th>End Time</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  reservations.forEach(reservation => {
    html += `
      <tr>
        <td>Room ${reservation.ROOM_ID}</td>
        <td>${formatDateTime(reservation.RES_STARTTIME)}</td>
        <td>${formatDateTime(reservation.RES_ENDTIME)}</td>
        <td>${reservation.RES_DESC}</td>
        <td>
          <button class="cancel-reservation" onclick="cancelReservation(${reservation.RES_ID})">
            Cancel
          </button>
        </td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  reservationsContainer.innerHTML = html;
}

function formatDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr);
  return date.toLocaleString();
}

function cancelReservation(reservationId) {
  // Implement reservation cancellation
  if (confirm('Are you sure you want to cancel this reservation?')) {
    alert(`Reservation ${reservationId} cancellation will be implemented.`);
  }
} 