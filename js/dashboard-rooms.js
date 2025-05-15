/**
 * Room reservation functionality for the customer dashboard
 */

// Initialize room functionality when tab is clicked
function initializeRooms() {
  if (window.roomsInitialized) return;
  
  // Set minimum date to today for the date input
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').min = today;
  
  // Set default date to today if empty
  const dateInput = document.getElementById('date');
  if (!dateInput.value) {
    dateInput.value = today;
  }
  
  // Setup filter listeners
  setupRoomFilters();
  
  // Load rooms
  loadRoomsWithAvailability();
  
  // Mark as initialized
  window.roomsInitialized = true;
}

function setupRoomFilters() {
  const filterInputs = document.querySelectorAll('#room-filters input, #room-filters select');
  
  filterInputs.forEach(input => {
    input.addEventListener('change', () => {
      loadRoomsWithAvailability();
    });
    
    if (input.type === 'text') {
      // Debounce search input
      let debounceTimer;
      input.addEventListener('keyup', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          loadRoomsWithAvailability();
        }, 500); // Wait 500ms after user stops typing
      });
    }
  });
}

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
    
    // Add user_id to identify the current user
    const userId = localStorage.getItem('user_id');
    if (userId) {
      params.append('user_id', userId);
    }
    
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
      document.getElementById('rooms-grid').innerHTML = `
        <p class="error-message">Unable to load rooms. ${data.message || 'Please try again later.'}</p>
      `;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    document.getElementById('rooms-grid').innerHTML = `
      <p class="error-message">Network error. Please check your connection and try again.</p>
    `;
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
          Status: <span class="${isAvailable ? 'status-available' : 'status-occupied'}">${room.STATUS}</span>
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

function switchRoomTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll('.room-tab-content').forEach(content => {
    content.style.display = 'none';
  });
  
  // Show selected tab content
  document.getElementById(tabId).style.display = 'block';
  
  // Update active tab button
  document.querySelectorAll('.room-tab-button').forEach(button => {
    if (button.getAttribute('data-tab') === tabId) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  // Load data for My Reservations tab if selected
  if (tabId === 'my-reservations') {
    loadMyReservations();
  }
}

function reserveRoom(roomId) {
  // Check if user is logged in - should always be true in dashboard
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    alert('You need to be logged in to reserve a room.');
    return;
  }
  
  // Get the date and time from the filter inputs
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  
  if (!date) {
    alert('Please select a date for your reservation.');
    return;
  }
  
  if (!time) {
    alert('Please select a time for your reservation.');
    return;
  }
  
  // Calculate end time (assuming 1 hour duration by default)
  const startDateTime = new Date(`${date}T${time}`);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Add 1 hour
  
  // Format for API
  const startTime = startDateTime.toISOString().slice(0, 19).replace('T', ' ');
  const endTime = endDateTime.toISOString().slice(0, 19).replace('T', ' ');
  
  // Make reservation
  makeReservation(roomId, userId, startTime, endTime);
}

async function makeReservation(roomId, userId, startTime, endTime) {
  try {
    const response = await fetch('../api/make_reservation.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        room_id: roomId,
        cust_id: userId,
        start_time: startTime,
        end_time: endTime,
        description: 'Room reservation',
        count: 1 // Default to 1 person
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      alert(`Room ${roomId} has been successfully reserved.`);
      // Refresh the rooms list
      loadRoomsWithAvailability();
      // Switch to My Reservations tab and load reservations
      switchRoomTab('my-reservations');
    } else {
      alert(`Reservation failed: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error making reservation:', error);
    alert('There was an error processing your reservation. Please try again.');
  }
}

async function loadMyReservations() {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    // Should not happen in dashboard
    document.getElementById('my-reservations-content').innerHTML = `
      <div class="login-prompt">
        <p>Please log in to view your reservations.</p>
      </div>
    `;
    return;
  }
  
  // Show loading state
  document.getElementById('my-reservations-content').innerHTML = `
    <div class="loading-indicator">
      <p>Loading your reservations...</p>
    </div>
  `;
  
  try {
    const response = await fetch(`../api/get_reservations.php?user_id=${userId}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      displayMyReservations(data.data);
    } else {
      console.error('Error loading reservations:', data.message);
      document.getElementById('my-reservations-content').innerHTML = `
        <p class="error-message">Unable to load your reservations. ${data.message || 'Please try again later.'}</p>
      `;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    document.getElementById('my-reservations-content').innerHTML = `
      <p class="error-message">Network error. Please check your connection and try again.</p>
    `;
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
  
  // Get current time to compare with reservation end times
  const currentTime = new Date();
  
  reservations.forEach(reservation => {
    // Convert end time string to Date object for comparison
    const endTime = new Date(reservation.RES_ENDTIME);
    const isPastReservation = endTime < currentTime;
    
    html += `
      <tr>
        <td>Room ${reservation.ROOM_ID}</td>
        <td>${formatDateTime(reservation.RES_STARTTIME)}</td>
        <td>${formatDateTime(reservation.RES_ENDTIME)}</td>
        <td>${reservation.RES_DESC || ''}</td>
        <td>
          ${!isPastReservation ? 
            `<button class="cancel-reservation" onclick="cancelReservation(${reservation.RES_ID})">
              Cancel
            </button>` : 
            `<span class="reservation-completed">Completed</span>`
          }
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

async function cancelReservation(reservationId) {
  if (confirm('Are you sure you want to cancel this reservation?')) {
    try {
      const response = await fetch('../api/cancel_reservation.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reservation_id: reservationId
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Reservation cancelled successfully.');
        // Refresh reservations
        loadMyReservations();
        // Also refresh available rooms
        loadRoomsWithAvailability();
      } else {
        alert(`Failed to cancel reservation: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('There was an error cancelling your reservation. Please try again.');
    }
  }
} 