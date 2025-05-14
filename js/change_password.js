document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('passwordForm');
  const msg = document.getElementById('passwordMsg');
  const baseUrl = '../api';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
      msg.textContent = 'New passwords do not match.';
      msg.style.color = 'red';
      return;
    }

    try {
      const res = await fetch(`${baseUrl}/change_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const result = await res.json();

      if (result.status === 'success') {
        showPopupMessage('Password updated successfully.', 'success');
        msg.textContent = 'Password updated successfully.';
        msg.style.color = 'green';
        form.reset();
      } else {
        msg.textContent = result.message || 'Password update failed.';
        msg.style.color = 'red';
      }
    } catch (err) {
      console.error(err);
      msg.textContent = 'Server error.';
      msg.style.color = 'red';
    }
  });
});
