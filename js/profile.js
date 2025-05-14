document.addEventListener('DOMContentLoaded', () => {
  const baseUrl = '../api';
  const form = document.getElementById('profileForm');
  const msg = document.getElementById('profileMessage');

  async function loadProfile() {
    try {
      const res = await fetch(`${baseUrl}/get_profile.php`);
      const result = await res.json();
      console.log('Load profile response:', result);

      if (result.status === 'success') {
        const data = result.data;
        document.getElementById('CUST_FNAME').value = data.CUST_FNAME || '';
        document.getElementById('CUST_LNAME').value = data.CUST_LNAME || '';
        document.getElementById('CUST_EMAIL').value = data.CUST_EMAIL || '';
        document.getElementById('CUST_PHONE').value = data.CUST_PHONE || '';

        // Update localStorage with new data
        localStorage.setItem('user_fname', data.CUST_FNAME || '');
        localStorage.setItem('user_lname', data.CUST_LNAME || '');
      } else {
        showMessage(result.message || 'Failed to load profile.', 'error');
      }
    } catch (err) {
      console.error('Load profile error:', err);
      showMessage('Error loading profile.', 'error');
    }
  }

  function showMessage(text, type = 'error') {
    console.log(`Showing message: ${text} (${type})`);
    msg.textContent = text;
    msg.className = `message ${type}`;
    msg.style.display = 'block';
    
    // Scroll message into view
    msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Clear success message after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        msg.style.display = 'none';
      }, 3000);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    console.log('Form submitted');
    
    // Clear any existing messages
    msg.style.display = 'none';

    const payload = {
      CUST_FNAME: document.getElementById('CUST_FNAME').value.trim(),
      CUST_LNAME: document.getElementById('CUST_LNAME').value.trim(),
      CUST_EMAIL: document.getElementById('CUST_EMAIL').value.trim(),
      CUST_PHONE: document.getElementById('CUST_PHONE').value.trim()
    };

    console.log('Sending payload:', payload);

    try {
      const res = await fetch(`${baseUrl}/update_profile.php`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      console.log('Response status:', res.status);
      const result = await res.json();
      console.log('Update profile response:', result);

      if (result.status === 'success') {
        showMessage('Update successfully!', 'success');
        
        // Update localStorage and dashboard display
        localStorage.setItem('user_fname', payload.CUST_FNAME);
        localStorage.setItem('user_lname', payload.CUST_LNAME);
        
        // Update user button in dashboard if it exists
        const userBtn = document.getElementById('user-button');
        if (userBtn) {
          const name = `${payload.CUST_FNAME} ${payload.CUST_LNAME}`.trim() || 'Guest';
          userBtn.textContent = `👤 ${name} ▼`;
        }
      } else {
        showMessage(result.message || 'Update failed.', 'error');
      }
    } catch (err) {
      console.error('Update profile error:', err);
      showMessage('Error updating profile.', 'error');
    }
  }

  // Add submit event listener
  form.addEventListener('submit', handleSubmit);

  // Load profile data when page loads
  loadProfile();
});
