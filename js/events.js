document.addEventListener('DOMContentLoaded', () => {
    const eventList = document.getElementById('eventList');
    const baseUrl = '../api';

    async function fetchEvents() {
        try {
            const response = await fetch(`${baseUrl}/get_events.php`);
            if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

            const data = await response.json();
            if (data.status === 'success') {
                displayEvents(data.data);
            } else {
                eventList.innerHTML = `<p class="error">Failed to load events: ${data.message}</p>`;
            }
        } catch (error) {
            console.error('Error loading events:', error);
            eventList.innerHTML = `<p class="error">Error loading events.</p>`;
        }
    }

    function displayEvents(events) {
        if (!events.length) {
            eventList.innerHTML = '<p>No events found.</p>';
            return;
        }

        eventList.innerHTML = '';
        events.forEach((event, index) => {
            const imgSrc = `../images/event${(index % 5) + 1}.jpg`;
            const card = document.createElement('div');
            card.className = 'event-card';
            card.innerHTML = `
                <img src="${imgSrc}" alt="Event Image" style="width: 100%; height: 180px; object-fit: cover;">
                <h3>${event.E_NAME}</h3>
                <p><strong>Type:</strong> ${event.E_TYPE}</p>
                <p><strong>Topic:</strong> ${event.TOPIC_NAME}</p>
                <p><strong>Start:</strong> ${event.E_STARTTIME}</p>
                <p><strong>End:</strong> ${event.E_ENDTIME}</p>
                <a href="event_register.html?event_id=${event.E_ID}&img=${encodeURIComponent(imgSrc)}" class="btn btn-primary mt-2">Register</a>
            `;
            eventList.appendChild(card);
        });
    }

    fetchEvents();
});