document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  const userId = getUserId(); // <- You need to define how to get this, e.g., from sessionStorage, cookie, etc.
  if (!userId) {
    alert("User not logged in.");
    return;
  }
  fetchUserRentals(userId);

  document.getElementById("status-filter").addEventListener("change", applyFilters);
  document.getElementById("search-input").addEventListener("input", applyFilters);
});

let allRentals = [];

function fetchUserRentals(userId) {
  const spinner = document.getElementById("loading-spinner");
  spinner.style.display = "block";

  fetch(`../api/get_my_rentals.php?user_id=${userId}`)
    .then((res) => res.json())
    .then((data) => {
      spinner.style.display = "none";

      if (data.status === "success") {
        allRentals = data.rentals.map(item => ({
          title: item.BOOK_NAME,
          borrowDate: item.BORROW_DATE,
          expectedReturn: item.EXPECTED_RETURN_DATE,
          actualReturn: item.RETURN_DATE,
          status: "Currently Borrowed"
        }));

        renderRentals(allRentals);
      } else {
        showNoData(data.message || "Failed to fetch rentals.");
      }
    })
    .catch((err) => {
      console.error(err);
      spinner.style.display = "none";
      showNoData("Error loading rentals.");
    });
}

function renderRentals(data) {
  const tbody = document.getElementById("rentals-table-body");
  tbody.innerHTML = "";

  if (data.length === 0) {
    document.getElementById("no-rentals").style.display = "block";
    return;
  }

  document.getElementById("no-rentals").style.display = "none";

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.title}</td>
      <td>${item.borrowDate || "-"}</td>
      <td>${item.expectedReturn || "-"}</td>
      <td>${item.actualReturn || "-"}</td>
      <td>${item.status}</td>
      <td><button class="btn btn-outline" disabled>View</button></td>
    `;
    tbody.appendChild(row);
  });
}

function applyFilters() {
  const status = document.getElementById("status-filter").value.toLowerCase();
  const search = document.getElementById("search-input").value.toLowerCase();

  const filtered = allRentals.filter((item) => {
    const matchStatus = status === "all" || item.status.toLowerCase() === status;
    const matchTitle = item.title.toLowerCase().includes(search);
    return matchStatus && matchTitle;
  });

  renderRentals(filtered);
}

function showNoData(msg) {
  document.getElementById("rentals-table-body").innerHTML = "";
  const noRentals = document.getElementById("no-rentals");
  noRentals.style.display = "block";
  noRentals.querySelector("p").textContent = msg;
}

// Example: Replace this with your actual session handling
function getUserId() {
  return sessionStorage.getItem("user_id");
}
