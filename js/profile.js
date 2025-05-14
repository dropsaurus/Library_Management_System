document.addEventListener('DOMContentLoaded', () => {
  const baseUrl = '../api';
  const form = document.getElementById('profileForm');
  const msg = document.getElementById('profileMessage');

  async function loadProfile() {
    try {
      const res = await fetch(`${baseUrl}/get_profile.php`);
      const result = await res.json();

      if (result.status === 'success') {
        const data = result.data;
        document.getElementById('CUST_FNAME').value = data.CUST_FNAME || '';
        document.getElementById('CUST_LNAME').value = data.CUST_LNAME || '';
        document.getElementById('CUST_EMAIL').value = data.CUST_EMAIL || '';
        document.getElementById('CUST_PHONE').value = data.CUST_PHONE || '';

        // Update localStorage with new data
        localStorage.setItem('customer_fname', data.CUST_FNAME || '');
        localStorage.setItem('customer_lname', data.CUST_LNAME || '');
      } else {
        showMessage(result.message || 'Failed to load profile.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error loading profile.', 'error');
    }
  }

  function showMessage(text, type = 'error') {
    msg.textContent = text;
    msg.className = `message ${type}`;
    msg.style.display = 'block';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      CUST_FNAME: document.getElementById('CUST_FNAME').value,
      CUST_LNAME: document.getElementById('CUST_LNAME').value,
      CUST_EMAIL: document.getElementById('CUST_EMAIL').value,
      CUST_PHONE: document.getElementById('CUST_PHONE').value
    };

    try {
      const res = await fetch(`${baseUrl}/update_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();

      if (result.status === 'success') {
        showMessage('Profile updated successfully!', 'success');
        
        // Update localStorage and dashboard display
        localStorage.setItem('customer_fname', payload.CUST_FNAME);
        localStorage.setItem('customer_lname', payload.CUST_LNAME);
        
        // Update user button in dashboard if it exists
        const userBtn = document.getElementById('user-button');
        if (userBtn) {
          const name = `${payload.CUST_FNAME} ${payload.CUST_LNAME}`.trim() || 'Customer';
          userBtn.textContent = `👤 ${name} ▼`;
        }
      } else {
        showMessage(result.message || 'Update failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showMessage('Error updating profile.', 'error');
    }
  });

  // Load profile data when page loads
  loadProfile();
});
