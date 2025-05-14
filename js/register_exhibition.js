document.addEventListener('DOMContentLoaded', async () => {
  const customerId = localStorage.getItem('customer_id');
  if (!customerId) {
    alert("You must be logged in.");
    location.href = 'login.html';
    return;
  }

  const listContainer = document.getElementById('exhibition-list');

  try {
    const response = await fetch('../api/get_exhibitions.php');
    const data = await response.json();

    if (data.status === 'success') {
      if (data.data.length === 0) {
        listContainer.innerHTML = '<p>No exhibitions available at this time.</p>';
      } else {
        listContainer.innerHTML = data.data.map(event => `
          <div class="feature-card">
            <h3>${event.E_NAME}</h3>
            <p><strong>Start:</strong> ${event.E_STARTTIME}<br><strong>End:</strong> ${event.E_ENDTIME}</p>
            <button class="btn" onclick="registerExhibition(${event.E_ID})">Register</button>
          </div>
        `).join('');
      }
    } else {
      listContainer.innerHTML = `<p class="error">${data.message}</p>`;
    }
  } catch (err) {
    console.error(err);
    listContainer.innerHTML = `<p class="error">Failed to load exhibitions. Please try again later.</p>`;
  }
});

async function registerExhibition(eid) {
  const customerId = localStorage.getItem('customer_id');

  try {
    const response = await fetch('../api/insert_exhibition.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CUST_ID: customerId, E_ID: eid })
    });

    const result = await response.json();
    if (result.status === 'success') {
      alert("Successfully registered for the exhibition!");
    } else {
      alert("Failed to register: " + result.message);
    }
  } catch (error) {
    console.error(error);
    alert("Registration failed due to a server error.");
  }
}
