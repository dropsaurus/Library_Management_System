document.addEventListener("DOMContentLoaded", () => {
  setupNavigation();
  setupSubMenus();
  loadDefaultPage();
  initializeTheme();
});

function logout() {
  window.location.href = "index.html";
}

function setupNavigation() {
  const subItems = document.querySelectorAll(".sub-item");
  subItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove all active states
      document
        .querySelectorAll(".sub-item")
        .forEach((i) => i.classList.remove("active"));
      item.classList.add("active");

      const page = item.getAttribute("data-page");
      loadPage(page);
    });
  });

  // Add handler for the Dashboard main nav item
  const dashboardNavItem = document.querySelector(
    '.nav-item[data-page="dashboard"]'
  );
  if (dashboardNavItem) {
    dashboardNavItem.addEventListener("click", (e) => {
      e.preventDefault();

      // Remove active class from all nav items
      document
        .querySelectorAll(".nav-item, .sub-item")
        .forEach((i) => i.classList.remove("active"));

      // Add active class to dashboard nav item
      dashboardNavItem.classList.add("active");

      // Load dashboard
      loadPage("dashboard");
    });
  }
}

function setupSubMenus() {
  const navGroups = document.querySelectorAll(".nav-group");
  navGroups.forEach((group) => {
    const toggle = group.querySelector("[data-toggle]");
    if (toggle) {
      toggle.addEventListener("click", () => {
        // Close other open submenus
        navGroups.forEach((g) => {
          if (g !== group && g.classList.contains("active")) {
            g.classList.remove("active");
          }
        });
        // Toggle current submenu
        group.classList.toggle("active");
      });
    }
  });
}

function loadPage(page) {
  const pageContent = document.getElementById("pageContent");
  const pageTitle = document.querySelector(".page-title h1");

  // Update page title
  const title = page
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  pageTitle.textContent = title;

  // Load page content
  switch (page) {
    case "dashboard":
      loadDashboardContent();
      break;
    case "manage_customers":
      loadManageCustomersContent();
      break;
    case "manage_employees":
      loadManageEmployeesContent();
      break;
    case "add_employee":
      loadAddEmployeeContent();
      break;
    case "employee_report":
      loadEmployeeReportContent();
      break;
    case "manage_books":
      loadManageBooksContent();
      break;
    case "manage_copies":
      loadManageCopiesContent();
      break;
    case "manage_rentals":
      loadManageRentalsContent();
      break;
    case "manage_rooms":
      loadManageRoomsContent();
      break;
    case "room_bookings":
      loadRoomBookingsContent();
      break;
    case "manage_exhibition":
      loadManageExhibitionContent();
      break;
    case "manage_seminar":
      loadManageSeminarContent();
      break;
    case "manage_authors":
      loadManageAuthorsContent();
      break;
    case "manage_exhibition_reservations":
      loadManageExhibitionReservationContent();
      break;
    case "manage_seminar_reservations":
      loadManageSeminarReservationContent();
      break;
    case "manage_room_bookings":
      loadManageRoomBookingsContent();
      break;
  }
}

function loadDefaultPage() {
  // Load dashboard page by default
  loadPage("dashboard");
}

function loadDashboardContent() {
  console.log("Loading dashboard content");
  const pageContent = document.getElementById("pageContent");

  pageContent.innerHTML = `
    <div class="dashboard-stats" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 20px;">
      <div class="stat-card"><h3>Total Customers</h3><p id="statCustomers">...</p></div>
      <div class="stat-card"><h3>Total Employees</h3><p id="statEmployees">...</p></div>
      <div class="stat-card"><h3>Total Rentals</h3><p id="statRentals">...</p></div>
      <div class="stat-card"><h3>Total Room Bookings</h3><p id="statRoomBookings">...</p></div>
      <div class="stat-card"><h3>Total Exhibition Reservations</h3><p id="statExhibitionRes">...</p></div>
      <div class="stat-card"><h3>Total Seminar Reservations</h3><p id="statSeminarRes">...</p></div>
    </div>

    <div id="dashboardChart" style="height: 400px; width: 100%; margin-top: 40px; border: 1px solid var(--border-color); background-color: var(--card-bg); border-radius: 8px; padding: 20px;"></div>
  `;

  const endpoints = [
    {
      id: "statCustomers",
      url: "../api/stats_total_customers.php",
      label: "Total Customers",
    },
    {
      id: "statEmployees",
      url: "../api/stats_total_employees.php",
      label: "Total Employees",
    },
    {
      id: "statRentals",
      url: "../api/stats_total_rentals.php",
      label: "Total Rentals",
    },
    {
      id: "statRoomBookings",
      url: "../api/stats_total_room_bookings.php",
      label: "Room Bookings",
    },
    {
      id: "statExhibitionRes",
      url: "../api/stats_total_exhibition_res.php",
      label: "Exhibition Reservations",
    },
    {
      id: "statSeminarRes",
      url: "../api/stats_total_seminar_res.php",
      label: "Seminar Reservations",
    },
  ];

  const chartData = [];

  let loaded = 0;
  endpoints.forEach((stat) => {
    fetch(stat.url)
      .then((res) => res.json())
      .then((data) => {
        const count = data.count ?? 0;
        document.getElementById(stat.id).textContent = count;
        chartData.push({ label: stat.label, y: parseInt(count) });
      })
      .catch((err) => {
        console.error(`Error loading ${stat.id}`, err);
        document.getElementById(stat.id).textContent = "Error";
        chartData.push({ label: stat.label, y: 0 });
      })
      .finally(() => {
        loaded++;
        if (loaded === endpoints.length) {
          console.log("All data loaded, rendering chart with:", chartData);
          renderChart(chartData);
        }
      });
  });
}

function renderChart(dataPoints) {
  console.log("Attempting to render chart with data:", dataPoints);

  // Check if CanvasJS is loaded
  if (typeof CanvasJS === "undefined") {
    console.error("CanvasJS is not loaded");

    // Try to load CanvasJS dynamically
    const script = document.createElement("script");
    script.src = "https://canvasjs.com/assets/script/canvasjs.min.js";
    script.onload = function () {
      console.log("CanvasJS loaded successfully");
      // Try rendering again after loading
      createChart(dataPoints);
    };
    script.onerror = function () {
      console.error("Failed to load CanvasJS");
      // Display error message to user
      const chartDiv = document.getElementById("dashboardChart");
      if (chartDiv) {
        chartDiv.innerHTML =
          '<div style="text-align: center; padding: 2rem; color: red;">Failed to load chart library. Please refresh the page and try again.</div>';
      }
    };
    document.head.appendChild(script);
    return;
  }

  createChart(dataPoints);
}

function createChart(dataPoints) {
  console.log("Creating chart with CanvasJS");

  // Ensure the chart container exists
  const chartContainer = document.getElementById("dashboardChart");
  if (!chartContainer) {
    console.error("Chart container not found");
    return;
  }

  // Clear any previous content
  chartContainer.innerHTML = "";

  const chart = new CanvasJS.Chart("dashboardChart", {
    animationEnabled: true,
    theme:
      document.documentElement.dataset.theme === "dark" ? "dark1" : "light1",
    title: {
      text: "Library Statistics Overview",
      fontFamily: "Roboto, sans-serif",
      fontSize: 24,
    },
    axisY: {
      title: "Categories",
      labelFontFamily: "Roboto, sans-serif",
    },
    axisX: {
      title: "Count",
      labelFontFamily: "Roboto, sans-serif",
    },
    dataPointWidth: 45,
    data: [
      {
        type: "bar",
        indexLabel: "{y}",
        indexLabelFontColor:
          document.documentElement.dataset.theme === "dark" ? "#fff" : "#333",
        indexLabelFontFamily: "Roboto, sans-serif",
        dataPoints: dataPoints,
      },
    ],
  });

  try {
    chart.render();
    console.log("Chart rendered successfully");
  } catch (error) {
    console.error("Error rendering chart:", error);
    chartContainer.innerHTML = `<div style="text-align: center; padding: 2rem; color: red;">Error rendering chart: ${error.message}</div>`;
  }
}

function loadManageCustomersContent() {
  const pageContent = document.getElementById("pageContent");

  pageContent.innerHTML = `
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>UID Type</th>
            <th>UID No</th>
          </tr>
        </thead>
        <tbody id="customerTableBody">
          <tr><td colspan="6">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_customers.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("customerTableBody");
      if (!tbody) return;

      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((cust) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${cust.CUST_ID}</td>
            <td>${cust.CUST_FNAME} ${cust.CUST_LNAME ?? ""}</td>
            <td>${cust.CUST_PHONE}</td>
            <td>${cust.CUST_EMAIL}</td>
            <td>${cust.CUST_UID_TYPE}</td>
            <td>${cust.CUST_UID_NO}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="6">Failed to load customers.</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      const tbody = document.getElementById("customerTableBody");
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="6">Error loading customers.</td></tr>`;
    });
}

function loadManageEmployeesContent() {
  const pageContent = document.getElementById("pageContent");

  pageContent.innerHTML = `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Hire Date</th>
          </tr>
        </thead>
        <tbody id="employeeTableBody">
          <tr><td colspan="5">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_employees.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("employeeTableBody");
      if (!tbody) return;

      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((emp) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${emp.E_ID}</td>
            <td>${emp.U_FNAME} ${emp.U_LNAME ?? ""}</td>
            <td>${emp.U_PHONE}</td>
            <td>${emp.U_EMAIL}</td>
            <td>${emp.E_HIREDATE}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="5">Failed to load employees.</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      const tbody = document.getElementById("employeeTableBody");
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="5">Error loading employees.</td></tr>`;
    });
}

function loadManageBooksContent() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Name</th>
            <th>Topic</th>
            <th>Available Copies</th>
            <th>Authors</th>
          </tr>
        </thead>
        <tbody id="bookTableBody">
          <tr><td colspan="5">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_books.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("bookTableBody");
      if (!tbody) return;

      if (data.status === "success") {
        tbody.innerHTML = "";
        data.books.forEach((book) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${book.BOOK_ID}</td>
            <td>${book.BOOK_NAME}</td>
            <td>${book.TOPIC_NAME ?? "-"}</td>
            <td>${book.AVAILABLE_COPIES}</td>
            <td>${book.AUTHOR_NAME ?? "-"}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="5">Failed to load books.</td></tr>`;
      }
    })
    .catch((err) => {
      console.error(err);
      document.getElementById(
        "bookTableBody"
      ).innerHTML = `<tr><td colspan="5">Error loading books.</td></tr>`;
    });
}

function loadAddBookForm() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="form-container">
      <h2>Add New Book</h2>
      <form id="bookForm">
        <div class="form-group">
          <label for="bookName">Book Name</label>
          <input type="text" id="bookName" required />
        </div>
        <div class="form-group">
          <label for="topicId">Topic ID</label>
          <input type="number" id="topicId" required />
        </div>
        <div class="form-group">
          <label for="authorIds">Author IDs (comma-separated)</label>
          <input type="text" id="authorIds" required />
        </div>
        <button type="submit" class="btn-primary">Add Book</button>
      </form>
    </div>
  `;

  document.getElementById("bookForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      book_name: document.getElementById("bookName").value.trim(),
      t_id: parseInt(document.getElementById("topicId").value),
      author_ids: document
        .getElementById("authorIds")
        .value.split(",")
        .map((id) => parseInt(id.trim())),
    };

    fetch("../api/insert_books.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Book added successfully!");
          loadManageBooksContent();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to add book.");
      });
  });
}

function deleteBook(bookId) {
  if (!confirm("Are you sure you want to delete this book?")) return;

  fetch("../api/delete_books.php", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: bookId }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Book deleted successfully.");
        loadManageBooksContent();
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Failed to delete book.");
    });
}

function loadManageCopiesContent() {
  const pageContent = document.getElementById("pageContent");

  pageContent.innerHTML = `
    <div class="content-header">
      <button class="btn-primary" id="newCopyBtn">Add New Copy</button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Copy ID</th>
            <th>Status</th>
            <th>Book Title</th>
          </tr>
        </thead>
        <tbody id="copyTableBody">
          <tr><td colspan="3">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_copies.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("copyTableBody");
      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((copy) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${copy.COPY_ID}</td>
            <td>${copy.COPY_STATUS}</td>
            <td>${copy.BOOK_NAME || "-"}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="3">Failed to load copies.</td></tr>`;
      }
    })
    .catch((err) => {
      console.error(err);
      const tbody = document.getElementById("copyTableBody");
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="3">Error loading data.</td></tr>`;
    });

  document.getElementById("newCopyBtn").addEventListener("click", () => {
    loadAddCopyForm();
  });
}

function loadAddCopyForm() {
  const pageContent = document.getElementById("pageContent");

  pageContent.innerHTML = `
    <div class="form-container">
      <h2>Add New Book Copy</h2>
      <form id="copyForm">
        <div class="form-group">
          <label for="bookId">Book ID</label>
          <input type="number" id="bookId" required />
        </div>
        <div class="form-group">
          <label for="copyStatus">Status</label>
          <select id="copyStatus" required>
            <option value="AVAILABLE">AVAILABLE</option>
            <option value="NOT AVAILABLE">NOT AVAILABLE</option>
          </select>
        </div>
        <button type="submit" class="btn-primary">Submit</button>
      </form>
    </div>
  `;

  document.getElementById("copyForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      book_id: parseInt(document.getElementById("bookId").value),
      copy_status: document.getElementById("copyStatus").value,
    };

    fetch("../api/insert_copy.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Copy added successfully!");
          loadManageCopiesContent();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((err) => {
        console.error("Request failed:", err);
        alert("Failed to submit copy.");
      });
  });
}

function loadManageRentalsContent() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="content-header">
      <button class="btn-primary">New Rental</button>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Rental ID</th>
            <th>Book Title</th>
            <th>Customer</th>
            <th>Rental Date</th>
            <th>Due Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="rentalTableBody">
          <tr><td colspan="6">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_rentals.php")
    .then((res) => res.json())
    .then((result) => {
      const tbody = document.getElementById("rentalTableBody");
      tbody.innerHTML = "";

      if (result.status === "success" && Array.isArray(result.data)) {
        if (result.data.length === 0) {
          tbody.innerHTML = `<tr><td colspan="6">No rental records found.</td></tr>`;
        } else {
          result.data.forEach((r) => {
            const tr = document.createElement("tr");
            const customerName = `${r.CUST_FNAME} ${r.CUST_LNAME}`;
            tr.innerHTML = `
              <td>${r.R_ID}</td>
              <td>${r.BOOK_NAME}</td>
              <td>${customerName}</td>
              <td>${r.R_BORROWDATE}</td>
              <td>${r.R_EX_RETURNDATE}</td>
              <td>${r.R_STATUS}</td>
            `;
            tbody.appendChild(tr);
          });
        }
      } else {
        tbody.innerHTML = `<tr><td colspan="6">Failed to load data.</td></tr>`;
      }
    })
    .catch((err) => {
      console.error(err);
      const tbody = document.getElementById("rentalTableBody");
      tbody.innerHTML = `<tr><td colspan="6">Error loading data.</td></tr>`;
    });
}

function loadManageExhibitionContent() {
  const pageContent = document.getElementById("pageContent");

  pageContent.innerHTML = `
    <div class="content-header">
      <button class="btn-primary" id="newExhibitionBtn">New Exhibition</button>
    </div>
    <div class="search-filters">
      <input type="text" placeholder="Search exhibitions..." class="search-input">
      <select class="filter-select">
        <option value="">All Status</option>
        <option value="upcoming">Upcoming</option>
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
      </select>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Exhibition ID</th>
            <th>Title</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Topic</th>
            <th>Expense</th>
          </tr>
        </thead>
        <tbody id="exhibitionTableBody">
          <tr><td colspan="6">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("newExhibitionBtn").addEventListener("click", () => {
    loadAddExhibitionForm();
  });

  fetch("../api/get_exhibition.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("exhibitionTableBody");
      if (!tbody) return;

      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((item) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${item.E_ID}</td>
            <td>${item.E_NAME}</td>
            <td>${item.E_STARTTIME}</td>
            <td>${item.E_ENDTIME}</td>
            <td>${item.topic_name}</td>
            <td>$${Number(item.EXPENSE).toFixed(2)}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="6">Failed to load exhibitions.</td></tr>`;
      }
    })
    .catch((err) => {
      console.error(err);
      const tbody = document.getElementById("exhibitionTableBody");
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="6">Error loading exhibitions.</td></tr>`;
    });
}

function loadManageExhibitionContent() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="content-header">
      <button class="btn-primary" onclick="loadAddExhibitionForm()">New Exhibition</button>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Exhibition ID</th>
            <th>Title</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Topic</th>
            <th>Expense</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="exhibitionTableBody">
          <tr><td colspan="7">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_exhibitions.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("exhibitionTableBody");
      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((row) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.E_ID}</td>
            <td>${row.E_NAME}</td>
            <td>${row.E_STARTTIME}</td>
            <td>${row.E_ENDTIME}</td>
            <td>${row.topic_name}</td>
            <td>$${parseFloat(row.EXPENSE).toFixed(2)}</td>
            <td>
              <div class="action-btns">
                <button class="action-btn edit-btn" onclick="editExhibition(${
                  row.E_ID
                })" title="Edit">
                  <i>✏️</i>
                </button>
              </div>
            </td>
          `;
          tbody.appendChild(tr);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="7">Failed to load exhibitions.</td></tr>`;
      }
    })
    .catch((err) => {
      console.error(err);
      document.getElementById(
        "exhibitionTableBody"
      ).innerHTML = `<tr><td colspan="7">Error loading exhibitions.</td></tr>`;
    });
}

function deleteExhibition(eid) {
  if (!confirm("Are you sure you want to delete this exhibition?")) return;

  fetch("../api/delete_exhibition.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ E_ID: eid }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Exhibition deleted!");
        loadManageExhibitionContent(); // refresh list
      } else {
        alert("Delete failed: " + data.message);
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Error deleting exhibition.");
    });
}

function editExhibition(eid) {
  fetch(`../api/get_exhibition_by_id.php?E_ID=${eid}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status !== "success") throw new Error(data.message);

      const ex = data.data;
      const pageContent = document.getElementById("pageContent");
      pageContent.innerHTML = `
        <div class="form-container">
          <h2>Edit Exhibition</h2>
          <form id="editExhibitionForm">
            <input type="hidden" id="editEID" value="${ex.E_ID}" />
            <div class="form-group">
              <label>Title</label>
              <input type="text" id="editTitle" value="${ex.E_NAME}" required />
            </div>
            <div class="form-group">
              <label>Start Date & Time</label>
              <input type="datetime-local" id="editStart" value="${ex.E_STARTTIME.replace(
                " ",
                "T"
              )}" required />
            </div>
            <div class="form-group">
              <label>End Date & Time</label>
              <input type="datetime-local" id="editEnd" value="${ex.E_ENDTIME.replace(
                " ",
                "T"
              )}" required />
            </div>
            <div class="form-group">
              <label>Topic ID</label>
              <input type="number" id="editTopicId" value="${
                ex.T_ID
              }" required />
            </div>
            <div class="form-group">
              <label>Expense</label>
              <input type="number" id="editExpense" step="0.01" value="${
                ex.EXPENSE
              }" required />
            </div>
            <button type="submit" class="btn-primary">Save Changes</button>
          </form>
        </div>
      `;

      document
        .getElementById("editExhibitionForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const updated = {
            E_ID: parseInt(document.getElementById("editEID").value),
            E_NAME: document.getElementById("editTitle").value.trim(),
            E_STARTTIME: document.getElementById("editStart").value,
            E_ENDTIME: document.getElementById("editEnd").value,
            T_ID: parseInt(document.getElementById("editTopicId").value),
            EXPENSE: parseFloat(document.getElementById("editExpense").value),
          };

          fetch("../api/update_exhibition.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
          })
            .then((res) => res.json())
            .then((result) => {
              if (result.status === "success") {
                alert("Exhibition updated successfully!");
                loadManageExhibitionContent();
              } else {
                alert("Update failed: " + result.message);
              }
            })
            .catch((err) => {
              console.error(err);
              alert("Error updating exhibition.");
            });
        });
    })
    .catch((err) => {
      console.error(err);
      alert("Error fetching exhibition details.");
    });
}

function loadManageSeminarContent() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="content-header">
      <button class="btn-primary" id="newSeminarBtn">New Seminar</button>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Seminar ID</th>
            <th>Title</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Topic</th>
            <th>Speaker</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="seminarTableBody">
          <tr><td colspan="7">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("newSeminarBtn").addEventListener("click", () => {
    loadAddSeminarForm();
  });

  fetch("../api/get_seminars.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("seminarTableBody");
      if (!tbody) return;

      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((seminar) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${seminar.E_ID}</td>
            <td>${seminar.E_NAME}</td>
            <td>${seminar.E_STARTTIME}</td>
            <td>${seminar.E_ENDTIME}</td>
            <td>${seminar.topic_name}</td>
            <td>${seminar.SPEAKER_FNAME} ${seminar.SPEAKER_LNAME ?? ""}</td>
            <td>
              <div class="action-btns">
                <button class="action-btn edit-btn" onclick="editSeminar(${
                  seminar.E_ID
                })" title="Edit">
                  <i>✏️</i>
                </button>
              </div>
            </td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="7">Failed to load seminars.</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      const tbody = document.getElementById("seminarTableBody");
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="7">Error loading seminars.</td></tr>`;
    });
}

function deleteSeminar(eid) {
  if (!confirm("Are you sure you want to delete this seminar?")) return;

  fetch(`../api/delete_seminar.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ e_id: eid }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Seminar deleted.");
        loadManageSeminarContent();
      } else {
        alert("Delete failed: " + data.message);
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Error deleting seminar.");
    });
}

function editSeminar(eid) {
  fetch(`../api/get_seminar_by_id.php?e_id=${eid}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        loadAddSeminarForm(true, data.data); // reuse form with edit mode
      } else {
        alert("Seminar not found.");
      }
    })
    .catch((err) => {
      console.error(err);
      alert("Error fetching seminar data.");
    });
}

function loadAddSeminarForm(isEdit = false, seminar = null) {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="form-container">
      <h2>${isEdit ? "Edit" : "Add New"} Seminar</h2>
      <form id="seminarForm">
        <input type="hidden" id="seminarId" />
        <div class="form-group">
          <label for="seminarTitle">Seminar Title</label>
          <input type="text" id="seminarTitle" required maxlength="30" />
        </div>
        <div class="form-group">
          <label for="seminarStart">Start Time</label>
          <input type="datetime-local" id="seminarStart" required />
        </div>
        <div class="form-group">
          <label for="seminarEnd">End Time</label>
          <input type="datetime-local" id="seminarEnd" required />
        </div>
        <div class="form-group">
          <label for="topicId">Topic</label>
          <select id="topicId" required>
            <option value="">Loading topics...</option>
          </select>
        </div>
        <div class="form-group">
          <label for="speakerFname">Speaker First Name</label>
          <input type="text" id="speakerFname" required maxlength="20" />
        </div>
        <div class="form-group">
          <label for="speakerLname">Speaker Last Name</label>
          <input type="text" id="speakerLname" maxlength="20" />
        </div>
        <button type="submit" class="btn-primary">${
          isEdit ? "Update" : "Create"
        } Seminar</button>
      </form>
    </div>
  `;

  // Load topics for the dropdown
  fetch("../api/get_topics.php")
    .then((res) => res.json())
    .then((data) => {
      const topicSelect = document.getElementById("topicId");
      if (data.status === "success" && data.topics && data.topics.length > 0) {
        topicSelect.innerHTML = '<option value="">-- Select Topic --</option>';

        // Sort topics by ID (numerically) from low to high
        data.topics.sort((a, b) => parseInt(a.T_ID) - parseInt(b.T_ID));

        data.topics.forEach((topic) => {
          const option = document.createElement("option");
          option.value = topic.T_ID;
          option.textContent = `${topic.T_NAME} (ID: ${topic.T_ID})`;
          topicSelect.appendChild(option);
        });

        // If in edit mode, select the current topic
        if (isEdit && seminar && seminar.T_ID) {
          topicSelect.value = seminar.T_ID;
        }
      } else {
        topicSelect.innerHTML = '<option value="">No topics available</option>';
      }

      // Add a validation message to the form
      const formGroup = topicSelect.closest(".form-group");
      const validationMsg = document.createElement("div");
      validationMsg.className = "validation-message";
      validationMsg.style.color = "red";
      validationMsg.style.fontSize = "0.8rem";
      validationMsg.style.marginTop = "0.25rem";
      validationMsg.style.display = "none";
      validationMsg.textContent = "Please select a valid topic";
      formGroup.appendChild(validationMsg);

      // Add event listener to show/hide validation message
      topicSelect.addEventListener("change", function () {
        if (!this.value) {
          validationMsg.style.display = "block";
        } else {
          validationMsg.style.display = "none";
        }
      });

      // Initial validation
      if (!topicSelect.value) {
        validationMsg.style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Error loading topics:", error);
      document.getElementById("topicId").innerHTML =
        '<option value="">Error loading topics</option>';
    });

  if (isEdit && seminar) {
    document.getElementById("seminarId").value = seminar.E_ID;
    document.getElementById("seminarTitle").value = seminar.E_NAME;
    document.getElementById("seminarStart").value = seminar.E_STARTTIME.slice(
      0,
      16
    );
    document.getElementById("seminarEnd").value = seminar.E_ENDTIME.slice(
      0,
      16
    );
    document.getElementById("speakerFname").value = seminar.SPEAKER_FNAME;
    document.getElementById("speakerLname").value = seminar.SPEAKER_LNAME || "";
  }

  document
    .getElementById("seminarForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Topic ID validation
      const topicId = document.getElementById("topicId").value;
      if (!topicId) {
        alert("Please select a valid topic");
        return;
      }

      // Add validation for dates
      const startTime = new Date(document.getElementById("seminarStart").value);
      const endTime = new Date(document.getElementById("seminarEnd").value);

      if (endTime <= startTime) {
        alert("End time must be after start time");
        return;
      }

      // Validate speaker name length
      const speakerFname = document.getElementById("speakerFname").value.trim();
      const speakerLname = document.getElementById("speakerLname").value.trim();

      if (speakerFname.length > 20) {
        alert("Speaker first name must be 20 characters or less");
        return;
      }

      if (speakerLname && speakerLname.length > 20) {
        alert("Speaker last name must be 20 characters or less");
        return;
      }

      const formData = {
        e_id: parseInt(document.getElementById("seminarId").value || 0),
        e_name: document.getElementById("seminarTitle").value.trim(),
        e_starttime: document.getElementById("seminarStart").value,
        e_endtime: document.getElementById("seminarEnd").value,
        t_id: parseInt(topicId),
        speaker_fname: speakerFname,
        speaker_lname: speakerLname,
      };

      const url = isEdit
        ? "../api/update_seminar.php"
        : "../api/insert_event_seminar.php";

      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert(isEdit ? "Seminar updated!" : "Seminar added!");
            loadManageSeminarContent();
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch((err) => {
          console.error(err);
          alert("Request failed.");
        });
    });
}

function loadManageExhibitionReservationContent() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>Customer</th>
            <th>Exhibition</th>
            <th>Start Time</th>
          </tr>
        </thead>
        <tbody id="exhibitionReservationBody">
          <tr><td colspan="4">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_exhibition_reservations.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("exhibitionReservationBody");
      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((row) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.REGISTRATION_ID}</td>
            <td>${row.CUST_FNAME} ${row.CUST_LNAME}</td>
            <td>${row.E_NAME}</td>
            <td>${row.E_STARTTIME}</td>
          `;
          tbody.appendChild(tr);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="4">Failed to load reservations.</td></tr>`;
      }
    });
}

function loadManageSeminarReservationContent() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Invitation ID</th>
            <th>Author</th>
            <th>Seminar</th>
            <th>Start Time</th>
          </tr>
        </thead>
        <tbody id="seminarReservationBody">
          <tr><td colspan="4">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_seminar_reservations.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("seminarReservationBody");
      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((row) => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${row.INVITATION_ID}</td>
            <td>${row.U_FNAME} ${row.U_LNAME}</td>
            <td>${row.E_NAME}</td>
            <td>${row.E_STARTTIME}</td>
          `;
          tbody.appendChild(tr);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="4">Failed to load seminar invitations.</td></tr>`;
      }
    });
}

// Load Manage Rooms Content
function loadManageRoomsContent() {
  const pageContent = document.getElementById("pageContent");

  pageContent.innerHTML = `
    <div class="content-header">
      <button class="btn-primary" id="newRoomBtn">Add New Room</button>
    </div>
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Room ID</th>
            <th>Capacity</th>
          </tr>
        </thead>
        <tbody id="roomTableBody">
          <tr><td colspan="2">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("newRoomBtn").addEventListener("click", () => {
    loadAddRoomForm();
  });

  fetch("../api/get_rooms.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("roomTableBody");
      if (!tbody) return;

      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((room) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${room.ROOM_ID}</td>
            <td>${room.ROOM_CAPACITY}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="2">Failed to load rooms.</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      const tbody = document.getElementById("roomTableBody");
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="2">Error loading rooms.</td></tr>`;
    });
}

function loadAddRoomForm() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="form-container">
      <h2>Add New Room</h2>
      <form id="addRoomForm">
        <div class="form-group">
          <label for="roomId">Room ID (100–999)</label>
          <input type="number" id="roomId" min="100" max="999" required />
        </div>
        <div class="form-group">
          <label for="roomCapacity">Room Capacity</label>
          <input type="number" id="roomCapacity" min="1" required />
        </div>
        <button type="submit" class="btn-primary">Add Room</button>
      </form>
    </div>
  `;

  document
    .getElementById("addRoomForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = {
        room_id: parseInt(document.getElementById("roomId").value),
        room_capacity: parseInt(document.getElementById("roomCapacity").value),
      };

      fetch("../api/insert_room.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            alert("Room added successfully!");
            loadManageRoomsContent(); // refresh the room list
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Request failed:", error);
          alert("Failed to add room.");
        });
    });
}

function loadManageAuthorsContent() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
  
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Author ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody id="authorsTableBody">
          <tr><td colspan="4">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_authors.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("authorsTableBody");
      if (!tbody) return;

      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((author) => {
          const row = document.createElement("tr");
          const fname = author.U_FNAME ?? "-";
          const lname = author.U_LNAME ?? "";
          const email = author.U_EMAIL ?? "-";
          const address = author.FULL_ADDRESS ?? "-";

          row.innerHTML = `
            <td>${author.A_ID}</td>
            <td>${fname} ${lname}</td>
            <td>${email}</td>
            <td>${address}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="4">Failed to load authors.</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      const tbody = document.getElementById("authorsTableBody");
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="4">Error loading authors.</td></tr>`;
    });
}

function loadManageRoomBookingsContent() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = "";

  pageContent.innerHTML = `
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Reservation ID</th>
            <th>Customer</th>
            <th>Room ID</th>
            <th>Capacity</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>People</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="roomBookingTableBody">
          <tr><td colspan="9">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_room_bookings.php")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.getElementById("roomBookingTableBody");
      if (!tbody) return;

      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach((booking) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${booking.RES_ID}</td>
            <td>${booking.customer_name}</td>
            <td>${booking.ROOM_ID}</td>
            <td>${booking.ROOM_CAPACITY}</td>
            <td>${booking.RES_STARTTIME}</td>
            <td>${booking.RES_ENDTIME}</td>
            <td>${booking.RES_COUNT}</td>
            <td>${booking.RES_DESC}</td>
            <td>
              <button class="btn btn-sm btn-danger" onclick="deleteRoomBooking(${booking.RES_ID})">
                Delete
              </button>
            </td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="9">Failed to load room bookings.</td></tr>`;
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      const tbody = document.getElementById("roomBookingTableBody");
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="9">Error loading data.</td></tr>`;
      }
    });
}

function deleteRoomBooking(reservationId) {
  if (!confirm("Are you sure you want to delete this room booking?")) return;

  fetch("../api/delete_room_booking.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ res_id: reservationId }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === "success") {
        alert("Room booking deleted successfully!");
        loadManageRoomBookingsContent(); // Refresh the table
      } else {
        alert("Error deleting room booking: " + data.message);
      }
    })
    .catch((err) => {
      console.error("Delete request failed:", err);
      alert("Failed to delete room booking. Please try again.");
    });
}
