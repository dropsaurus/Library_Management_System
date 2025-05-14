document.addEventListener('DOMContentLoaded', () => {
  const baseUrl = window.location.origin + '/library_management/api';
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
      } else {
        msg.textContent = result.message || 'Failed to load profile.';
        msg.style.color = 'red';
      }
    } catch (err) {
      console.error(err);
      msg.textContent = 'Error loading profile.';
      msg.style.color = 'red';
    }
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
        showPopupMessage('Profile updated successfully!', 'success');
        msg.textContent = 'Profile updated successfully!';
        msg.style.color = 'green';
      } else {
        msg.textContent = result.message || 'Update failed.';
        msg.style.color = 'red';
      }
    } catch (err) {
      console.error(err);
      msg.textContent = 'Error updating profile.';
      msg.style.color = 'red';
    }
  });

  loadProfile();
});
