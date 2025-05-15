function initEventsPage() {
  fetchExhibitions();
}

async function fetchExhibitions() {
  try {
    const res = await fetch("../api/get_exhibitions.php");
    const json = await res.json();
    if (json.status === "success") {
      renderExhibitionCards(json.data || []);
    } else {
      document.getElementById("dashboard-content").innerHTML =
        "<p>No exhibitions found.</p>";
    }
  } catch (error) {
    console.error("Failed to fetch exhibitions:", error);
    document.getElementById("dashboard-content").innerHTML =
      "<p>Error loading exhibitions. Please try again later.</p>";
  }
}

function renderExhibitionCards(exhibitions) {
  const container = document.getElementById("dashboard-content");
  container.innerHTML = `
    <div class="hero-section">
      <h2>Exhibitions</h2>
      <p>Explore all current and upcoming exhibitions at our library</p>
    </div>
    <div class="events-grid" id="eventCards"></div>
  `;

  const cardsContainer = document.getElementById("eventCards");

  if (exhibitions.length === 0) {
    cardsContainer.innerHTML = "<p>No exhibitions available at this time.</p>";
    return;
  }

  exhibitions.forEach((ex) => {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <div class="event-image">
        <span class="event-type">Exhibition</span>
      </div>
      <div class="event-content">
        <h3>${ex.E_NAME}</h3>
        <div class="event-details">
          <div class="detail">
            <span>${ex.topic || "General"}</span>
          </div>
          <div class="detail">
            <span>${ex.E_STARTTIME || "TBD"} - ${ex.E_ENDTIME || "TBD"}</span>
          </div>
          <div class="detail">
            <span>Funding: $${parseFloat(ex.EXPENSE || 0).toFixed(2)}</span>
          </div>
        </div>
        <button class="btn" onclick="location.href='event_register.html?event_id=${ex.E_ID}&type=Exhibition&title=${encodeURIComponent(
      ex.E_NAME
    )}'">
          Register Now
        </button>
      </div>
    `;
    cardsContainer.appendChild(card);
  });
}
