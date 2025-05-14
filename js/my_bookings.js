function initBookingsPage() {
  const eventStatusFilter = document.getElementById('event-status-filter');
  const roomStatusFilter = document.getElementById('room-status-filter');
  const eventSearch = document.getElementById('event-search');
  const roomSearch = document.getElementById('room-search');
  const loadingSpinner = document.getElementById('loading-spinner');
  const noBookingsMessage = document.getElementById('no-bookings-message');

  let eventsData = [];
  let roomsData = [];
  let currentTab = 'events';

  // Switch between tabs
  window.switchTab = function(tabName) {
    currentTab = tabName;
    
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });

    // Activate selected tab
    const selectedTab = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (selectedTab) {
      selectedTab.classList.add('active');
    }
    const selectedContent = document.getElementById(`${tabName}-tab`);
    if (selectedContent) {
      selectedContent.classList.add('active');
    }

    // Load data for the active tab
    if (tabName === 'events') {
      loadEventBookings();
    } else {
      loadRoomBookings();
    }
  };

  // Load event bookings
  async function loadEventBookings() {
    try {
      showLoading(true);
      const response = await fetch('../api/get_event_bookings.php');
      const result = await response.json();

      if (result.status === 'success') {
        eventsData = result.data || [];
        filterAndDisplayEvents();
      } else {
        throw new Error(result.message || 'Failed to load event bookings');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Failed to load event bookings');
    } finally {
      showLoading(false);
    }
  }

  // Load room bookings
  async function loadRoomBookings() {
    try {
      showLoading(true);
      const response = await fetch('../api/get_room_bookings.php');
      const result = await response.json();

      if (result.status === 'success') {
        roomsData = result.data || [];
        filterAndDisplayRooms();
      } else {
        throw new Error(result.message || 'Failed to load room bookings');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Failed to load room bookings');
    } finally {
      showLoading(false);
    }
  }

  // Filter and display events
  function filterAndDisplayEvents() {
    const statusValue = eventStatusFilter.value;
    const searchValue = eventSearch.value.toLowerCase();

    const filteredEvents = eventsData.filter(event => {
      const matchesStatus = statusValue === 'all' || event.status === statusValue;
      const matchesSearch = event.EVENT_NAME.toLowerCase().includes(searchValue);
      return matchesStatus && matchesSearch;
    });

    displayEvents(filteredEvents);
  }

  // Filter and display rooms
  function filterAndDisplayRooms() {
    const statusValue = roomStatusFilter.value;
    const searchValue = roomSearch.value.toLowerCase();

    const filteredRooms = roomsData.filter(room => {
      const matchesStatus = statusValue === 'all' || room.status === statusValue;
      const matchesSearch = room.ROOM_NUMBER.toString().toLowerCase().includes(searchValue);
      return matchesStatus && matchesSearch;
    });

    displayRooms(filteredRooms);
  }

  // Display events in table
  function displayEvents(events) {
    const tbody = document.getElementById('events-table-body');
    
    if (events.length === 0) {
      showNoBookings(true);
      tbody.innerHTML = '';
      return;
    }

    showNoBookings(false);
    tbody.innerHTML = events.map(event => `
      <tr>
        <td>${escapeHtml(event.EVENT_NAME)}</td>
        <td>${formatDate(event.EVENT_DATE)}</td>
        <td>${event.EVENT_TIME}</td>
        <td>${escapeHtml(event.LOCATION)}</td>
        <td>
          <span class="status-badge status-${event.status}">
            ${capitalizeFirst(event.status)}
          </span>
        </td>
        <td>
          ${event.status === 'upcoming' ? `
            <button class="btn-cancel" onclick="cancelEventBooking(${event.REG_ID})">
              Cancel
            </button>
          ` : ''}
        </td>
      </tr>
    `).join('');
  }

  // Display rooms in table
  function displayRooms(rooms) {
    const tbody = document.getElementById('rooms-table-body');
    
    if (rooms.length === 0) {
      showNoBookings(true);
      tbody.innerHTML = '';
      return;
    }

    showNoBookings(false);
    tbody.innerHTML = rooms.map(room => `
      <tr>
        <td>${escapeHtml(room.ROOM_NUMBER)}</td>
        <td>${formatDate(room.BOOKING_DATE)}</td>
        <td>${room.START_TIME}</td>
        <td>${room.END_TIME}</td>
        <td>
          <span class="status-badge status-${room.status}">
            ${capitalizeFirst(room.status)}
          </span>
        </td>
        <td>
          ${room.status === 'upcoming' ? `
            <button class="btn-cancel" onclick="cancelRoomBooking(${room.BOOKING_ID})">
              Cancel
            </button>
          ` : ''}
        </td>
      </tr>
    `).join('');
  }

  // Cancel event booking
  window.cancelEventBooking = async function(bookingId) {
    if (!confirm('Are you sure you want to cancel this event registration?')) {
      return;
    }

    try {
      showLoading(true);
      const response = await fetch('../api/cancel_event_booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId })
      });
      const result = await response.json();

      if (result.status === 'success') {
        await loadEventBookings();
      } else {
        throw new Error(result.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Failed to cancel booking. Please try again.');
    } finally {
      showLoading(false);
    }
  };

  // Cancel room booking
  window.cancelRoomBooking = async function(bookingId) {
    if (!confirm('Are you sure you want to cancel this room reservation?')) {
      return;
    }

    try {
      showLoading(true);
      const response = await fetch('../api/cancel_room_booking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking_id: bookingId })
      });
      const result = await response.json();

      if (result.status === 'success') {
        await loadRoomBookings();
      } else {
        throw new Error(result.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error:', error);
      showError('Failed to cancel booking. Please try again.');
    } finally {
      showLoading(false);
    }
  };

  // Helper functions
  function showLoading(show) {
    loadingSpinner.style.display = show ? 'flex' : 'none';
    // Disable all buttons while loading
    document.querySelectorAll('button').forEach(btn => {
      btn.disabled = show;
    });
  }

  function showNoBookings(show) {
    noBookingsMessage.style.display = show ? 'flex' : 'none';
    // Show appropriate message based on current tab
    if (show) {
      const browseButton = noBookingsMessage.querySelector('.btn-primary');
      if (currentTab === 'events') {
        browseButton.textContent = 'Browse Events';
        browseButton.onclick = () => loadPage('events.html');
      } else {
        browseButton.textContent = 'Book a Room';
        browseButton.onclick = () => loadPage('study_room.html');
      }
    }
  }

  function showError(message) {
    alert(message);
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Event listeners
  eventStatusFilter.addEventListener('change', filterAndDisplayEvents);
  eventSearch.addEventListener('input', filterAndDisplayEvents);
  roomStatusFilter.addEventListener('change', filterAndDisplayRooms);
  roomSearch.addEventListener('input', filterAndDisplayRooms);

  // Initial load
  loadEventBookings();
} 