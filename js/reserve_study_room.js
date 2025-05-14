document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const room_id = document.getElementById("room").value;
    const start_time = document.getElementById("start").value;
    const end_time = document.getElementById("end").value;
    const count = parseInt(document.getElementById("count").value);
    const description = document.getElementById("desc").value;

    const cust_id = localStorage.getItem('customer_id');
    if (!cust_id) {
      alert("User not logged in.");
      return;
    }

    const reservationData = {
      room_id,
      start_time,
      end_time,
      count,
      description,
      cust_id
    };

    try {
      const response = await fetch('../api/insert_reservation.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
      });

      const result = await response.json();

      if (result.status === 'success') {
        alert("✅ Reservation successful!");
        form.reset();
      } else {
        alert("❌ Reservation failed: " + result.message);
      }

    } catch (error) {
      console.error("Reservation error:", error);
      alert("❌ Network error. Please try again later.");
    }
  });
});
