// Load events when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the events tab
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tab') === 'events') {
    loadEvents();
  }
});

// Global variables
let allEvents = [];

// Function to load events into the dashboard
async function loadEvents() {
  // Check for user authentication using the same method as the rest of the app
  const userId = localStorage.getItem('user_id');
  
  if (!userId) {
    alert("You must be logged in to view events.");
    location.href = 'login.html';
    return;
  }

  // Get the content container
  const contentContainer = document.getElementById('content-container');
  
  // Check if events content already exists, if not create it
  let eventsContent = document.getElementById('events-content');
  if (!eventsContent) {
    eventsContent = document.createElement('div');
    eventsContent.id = 'events-content';
    contentContainer.appendChild(eventsContent);
  }
  
  // Show the events content and ensure it's visible
  eventsContent.style.display = 'block';
  
  // Set up events layout
  eventsContent.innerHTML = `
    <div class="hero-section">
      <h2>Exhibitions</h2>
      <p>Explore all current and upcoming exhibitions at our library</p>
    </div>
    
    <div id="events-container" class="events-grid"></div>
    
    <div id="my-registrations" class="mt-5">
      <h3 class="section-heading">My Registered Exhibitions</h3>
      <div id="registrations-container" class="bookings-table-container"></div>
    </div>
  `;
  
  // Fetch and display events
  await fetchAndDisplayEvents();
  
  // Fetch and display user's registrations
  await fetchAndDisplayRegistrations(userId);
}

// Function to fetch events and display them
async function fetchAndDisplayEvents() {
  const eventsContainer = document.getElementById('events-container');
  
  try {
    // Fetch all events
    const response = await fetch('../api/get_events.php');
    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to load events');
    }
    
    // Filter to show only exhibitions
    allEvents = data.data.filter(event => event.E_TYPE === 'E');
    
    displayExhibitions();
  } catch (error) {
    console.error('Error loading exhibitions:', error);
    eventsContainer.innerHTML = `<p class="error">Error loading exhibitions. ${error.message}</p>`;
  }
}

// Function to display exhibitions
function displayExhibitions() {
  const eventsContainer = document.getElementById('events-container');
  
  // Display exhibitions
  if (allEvents.length === 0) {
    eventsContainer.innerHTML = `<p class="no-data">No exhibitions available at this time.</p>`;
    return;
  }
  
  eventsContainer.innerHTML = '';
  
  allEvents.forEach(event => {
    const card = document.createElement('div');
    card.className = 'event-card';
    
    // Format event time
    const startTime = new Date(event.E_STARTTIME);
    const endTime = new Date(event.E_ENDTIME);
    const formattedStartTime = startTime.toLocaleString();
    const formattedEndTime = endTime.toLocaleString();
    
    // Determine if this is an upcoming event
    const isUpcoming = startTime > new Date();
    
    card.innerHTML = `
      <div class="event-image">
        <span class="event-type">Exhibition</span>
      </div>
      <div class="event-content">
        <h3>${event.E_NAME}</h3>
        <div class="event-details">
          <div class="detail">
            <span>${event.TOPIC_NAME || 'General'}</span>
          </div>
          <div class="detail">
            <span>From: ${formattedStartTime}</span>
          </div>
          <div class="detail">
            <span>To: ${formattedEndTime}</span>
          </div>
          <div class="detail">
            <span>Funding: $${parseFloat(event.EXPENSE || 0).toFixed(2)}</span>
          </div>
        </div>
        ${isUpcoming ? 
          `<button onclick="registerForExhibition(${event.E_ID})" class="btn register-btn">Register Now</button>` 
          : 
          `<button class="btn disabled" disabled title="Registration period has ended">
            Registration Closed
          </button>`
        }
      </div>
    `;
    
    eventsContainer.appendChild(card);
  });
}

// Function to register for an exhibition
async function registerForExhibition(exhibitionId) {
  const userId = localStorage.getItem('user_id');
  
  if (!userId) {
    alert("You must be logged in to register.");
    return;
  }
  
  try {
    const response = await fetch('../api/insert_customer_exhibition.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        CUST_ID: userId,
        E_ID: exhibitionId
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      alert('You have successfully registered for this exhibition!');
      // Refresh the registrations list
      fetchAndDisplayRegistrations(userId);
    } else {
      alert(`Registration failed: ${data.message}`);
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('An error occurred during registration. Please try again later.');
  }
}

// Function to fetch and display user's registrations
async function fetchAndDisplayRegistrations(userId) {
  const container = document.getElementById('registrations-container');
  
  try {
    const response = await fetch(`../api/get_customer_exhibitions.php?customer_id=${userId}`);
    const data = await response.json();
    
    if (data.status !== 'success') {
      throw new Error(data.message || 'Failed to load registrations');
    }
    
    if (!data.data || data.data.length === 0) {
      container.innerHTML = `<p class="no-data">You haven't registered for any exhibitions yet.</p>`;
      return;
    }
    
    // Create a table to display the registrations
    let html = `
      <table class="table">
        <thead>
          <tr>
            <th>Exhibition</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;
    
    const now = new Date();
    
    data.data.forEach(reg => {
      const startTime = new Date(reg.E_STARTTIME);
      const endTime = new Date(reg.E_ENDTIME);
      
      // Determine event status
      let status;
      let statusClass;
      
      if (now < startTime) {
        status = 'Upcoming';
        statusClass = 'upcoming';
      } else if (now >= startTime && now <= endTime) {
        status = 'In Progress';
        statusClass = 'in-progress';
      } else {
        status = 'Completed';
        statusClass = 'completed';
      }
      
      html += `
        <tr>
          <td>${reg.E_NAME}</td>
          <td>${new Date(reg.E_STARTTIME).toLocaleString()}</td>
          <td>${new Date(reg.E_ENDTIME).toLocaleString()}</td>
          <td><span class="status-badge ${statusClass}">${status}</span></td>
        </tr>
      `;
    });
    
    html += `
        </tbody>
      </table>
    `;
    
    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading registrations:', error);
    container.innerHTML = `<p class="error">Error loading your registrations. ${error.message}</p>`;
  }
} 