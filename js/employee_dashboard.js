
      document.addEventListener("DOMContentLoaded", () => {
        setupNavigation();
        setupSubMenus();
        loadDefaultPage();
        initializeTheme();
      });

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
          case "customer_reports":
            loadCustomerReportsContent();
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
          case "add_author":
            loadAddAuthorContent();
            break;
        }
      }

      function loadDefaultPage() {
        // Load dashboard page by default
        loadPage("dashboard");
      }

      function loadDashboardContent() {
        const pageContent = document.getElementById("pageContent");
        pageContent.innerHTML = `
          <div class="dashboard-stats">
            <div class="stat-card">
              <h3>Total Customers</h3>
              <p class="stat-number">1,234</p>
            </div>
            <div class="stat-card">
              <h3>Total Employees</h3>
              <p class="stat-number">45</p>
            </div>
            <div class="stat-card">
              <h3>New Customers This Month</h3>
              <p class="stat-number">78</p>
            </div>
          </div>
          <div class="dashboard-charts">
            <div class="chart-container">
              <h3>Customer Growth Trend</h3>
              <div class="chart-placeholder">Chart Area</div>
            </div>
            <div class="chart-container">
              <h3>Employee Distribution</h3>
              <div class="chart-placeholder">Chart Area</div>
            </div>
          </div>
        `;
      }

      function loadManageCustomersContent() {
        const pageContent = document.getElementById("pageContent");
        pageContent.innerHTML = `
        <div class="content-header">
          <h2>Customer Management</h2>
          <button class="btn-primary" onclick="addNewCustomer()">Add New Customers</button>
        </div>
        <div class="search-filters">
          <input type="text" placeholder="Search customers..." class="search-input">
          <select class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- Customer data will be loaded dynamically -->
            </tbody>
          </table>
        </div>
      `;
      }

      function loadCustomerReportsContent() {
        const pageContent = document.getElementById("pageContent");
        pageContent.innerHTML = `
        <div class="content-header">
          <h2>Customer Reports</h2>
        </div>
        <div class="report-filters">
          <div class="date-range">
            <input type="date" class="date-input">
            <span>to</span>
            <input type="date" class="date-input">
          </div>
          <button class="btn-primary">Generate Report</button>
        </div>
        <div class="report-container">
          <div class="chart-container">
            <h3>Customer Growth Trend</h3>
            <div class="chart-placeholder">Chart Area</div>
          </div>
          <div class="chart-container">
            <h3>Customer Activity Analysis</h3>
            <div class="chart-placeholder">Chart Area</div>
          </div>
        </div>
      `;
      }

      function loadEmployeeReportContent() {
        const pageContent = document.getElementById("pageContent");
        pageContent.innerHTML = `
        <div class="content-header">
          <h2>Employee Report</h2>
        </div>
        <div class="report-filters">
          <div class="date-range">
            <input type="date" class="date-input">
            <span>to</span>
            <input type="date" class="date-input">
          </div>
          <button class="btn-primary">Generate Report</button>
        </div>
        <div class="report-container">
          <div class="chart-container">
            <h3>Employee Performance Trend</h3>
            <div class="chart-placeholder">Chart Area</div>
          </div>
          <div class="chart-container">
            <h3>Employee Activity Analysis</h3>
            <div class="chart-placeholder">Chart Area</div>
          </div>
        </div>
      `;
      }

      function logout() {
        window.location.href = "login.html";
      }

      function loadManageBooksContent() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="content-header">
      <button class="btn-primary" id="newBookBtn">Add New Book</button>
    </div>
    
    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Name</th>
            <th>Topic</th>
            <th>Available Copies</th>
            <th>Authors</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="bookTableBody">
          <tr><td colspan="6">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  document.getElementById("newBookBtn").addEventListener("click", loadAddBookForm);

  fetch("../api/get_books.php")
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("bookTableBody");
      if (!tbody) return;

      if (data.status === 'success') {
        tbody.innerHTML = '';
        data.books.forEach(book => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${book.BOOK_ID}</td>
            <td>${book.BOOK_NAME}</td>
            <td>${book.TOPIC_NAME ?? '-'}</td>
            <td>${book.AVAILABLE_COPIES}</td>
            <td>${book.AUTHOR_NAME ?? '-'}</td>
            <td><button onclick="deleteBook(${book.BOOK_ID})" class="btn-danger">Delete</button></td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="6">Failed to load books.</td></tr>`;
      }
    })
    .catch(err => {
      console.error(err);
      document.getElementById("bookTableBody").innerHTML = `<tr><td colspan="6">Error loading books.</td></tr>`;
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
      author_ids: document.getElementById("authorIds").value.split(",").map(id => parseInt(id.trim()))
    };

    fetch("../api/insert_books.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          alert("Book added successfully!");
          loadManageBooksContent();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch(err => {
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
    body: JSON.stringify({ id: bookId })
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        alert("Book deleted successfully.");
        loadManageBooksContent();
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert("Failed to delete book.");
    });
}
    
function loadManageCopiesContent() {
  const pageContent = document.getElementById("pageContent");

  pageContent.innerHTML = `
    <div class="content-header">
      <h2>Manage Book Copies</h2>
      <button class="btn-primary" id="newCopyBtn">Add New Copy</button>
    </div>

    <div class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>Copy ID</th>
            <th>Status</th>
            <th>Book Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody id="copyTableBody">
          <tr><td colspan="4">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch("../api/get_copies.php")
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("copyTableBody");
      if (data.status === "success") {
        tbody.innerHTML = "";
        data.data.forEach(copy => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${copy.COPY_ID}</td>
            <td>${copy.COPY_STATUS}</td>
            <td>${copy.BOOK_NAME || '-'}</td>
            <td>
              <button class="btn-danger" onclick="deleteCopy(${copy.COPY_ID})">Delete</button>
            </td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="4">Failed to load copies.</td></tr>`;
      }
    })
    .catch(err => {
      console.error(err);
      const tbody = document.getElementById("copyTableBody");
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="4">Error loading data.</td></tr>`;
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
      copy_status: document.getElementById("copyStatus").value
    };

    fetch("../api/insert_copy.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          alert("Copy added successfully!");
          loadManageCopiesContent();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch(err => {
        console.error("Request failed:", err);
        alert("Failed to submit copy.");
      });
  });
}

      function loadManageRentalsContent() {
        const pageContent = document.getElementById("pageContent");
        pageContent.innerHTML = `
        <div class="content-header">
          <h2>Manage Rentals</h2>
          <button class="btn-primary">New Rental</button>
        </div>
        <div class="search-filters">
          <input type="text" placeholder="Search rentals..." class="search-input">
          <select class="filter-select">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="overdue">Overdue</option>
            <option value="returned">Returned</option>
          </select>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <!-- Rental data will be loaded dynamically -->
            </tbody>
          </table>
        </div>
      `;
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

      function loadAddExhibitionForm() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="form-container">
      <h2>Add New Exhibition</h2>
      <form id="exhibitionForm">
        <div class="form-group">
          <label for="title">Title</label>
          <input type="text" id="title" required />
        </div>
        <div class="form-group">
          <label for="start">Start Date & Time</label>
          <input type="datetime-local" id="start" required />
        </div>
        <div class="form-group">
          <label for="end">End Date & Time</label>
          <input type="datetime-local" id="end" required />
        </div>
        <div class="form-group">
          <label for="topicId">Topic ID</label>
          <input type="number" id="topicId" required />
        </div>
        <div class="form-group">
          <label for="expense">Expense ($)</label>
          <input type="number" step="0.01" id="expense" required />
        </div>
        <button type="submit" class="btn-primary">Submit</button>
      </form>
    </div>
  `;

  document.getElementById("exhibitionForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      E_NAME: document.getElementById("title").value.trim(),
      E_STARTTIME: document.getElementById("start").value,
      E_ENDTIME: document.getElementById("end").value,
      T_ID: parseInt(document.getElementById("topicId").value),
      EXPENSE: parseFloat(document.getElementById("expense").value)
    };

    fetch("../api/insert_event_exhibition.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          alert("Exhibition added successfully!");
          loadManageExhibitionContent();
        } else {
          alert("Error: " + data.message);
        }
      })
      .catch((err) => {
        console.error("Request failed:", err);
        alert("Failed to submit the exhibition.");
      });
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
              </tr>
            </thead>
            <tbody id="exhibitionTableBody">
              <tr><td colspan="6">Loading...</td></tr>
            </tbody>
          </table>
        </div>
      `;

      fetch('../api/get_exhibitions.php')
        .then(res => res.json())
        .then(data => {
          const tbody = document.getElementById("exhibitionTableBody");
          if (data.status === 'success') {
            tbody.innerHTML = '';
            data.data.forEach(row => {
              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td>${row.E_ID}</td>
                <td>${row.E_NAME}</td>
                <td>${row.E_STARTTIME}</td>
                <td>${row.E_ENDTIME}</td>
                <td>${row.topic_name}</td>
                <td>$${parseFloat(row.EXPENSE).toFixed(2)}</td>
              `;
              tbody.appendChild(tr);
            });
          } else {
            tbody.innerHTML = `<tr><td colspan="6">Failed to load exhibitions.</td></tr>`;
          }
        })
        .catch(err => {
          console.error(err);
          document.getElementById("exhibitionTableBody").innerHTML =
            `<tr><td colspan="6">Error loading exhibitions.</td></tr>`;
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
          </tr>
        </thead>
        <tbody id="seminarTableBody">
          <tr><td colspan="6">Loading...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  fetch('../api/get_seminars.php')
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById('seminarTableBody');
      if (!tbody) return;

      if (data.status === 'success') {
        tbody.innerHTML = '';
        data.data.forEach(seminar => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${seminar.E_ID}</td>
            <td>${seminar.E_NAME}</td>
            <td>${seminar.E_STARTTIME}</td>
            <td>${seminar.E_ENDTIME}</td>
            <td>${seminar.topic_name}</td>
            <td>${seminar.SPEAKER_FNAME} ${seminar.SPEAKER_LNAME ?? ''}</td>
          `;
          tbody.appendChild(row);
        });
      } else {
        tbody.innerHTML = `<tr><td colspan="6">Failed to load seminars.</td></tr>`;
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      const tbody = document.getElementById('seminarTableBody');
      if (tbody)
        tbody.innerHTML = `<tr><td colspan="6">Error loading seminars.</td></tr>`;
    });

  
  document.getElementById("newSeminarBtn").addEventListener("click", () => {
    loadAddSeminarForm();
  });
}

      function loadAddSeminarForm() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="form-container">
      <h2>Add New Seminar</h2>
      <form id="seminarForm">
        <div class="form-group">
          <label for="seminarTitle">Seminar Title</label>
          <input type="text" id="seminarTitle" required />
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
          <label for="topicId">Topic ID</label>
          <input type="number" id="topicId" required />
        </div>
        <div class="form-group">
          <label for="speakerFname">Speaker First Name</label>
          <input type="text" id="speakerFname" required />
        </div>
        <div class="form-group">
          <label for="speakerLname">Speaker Last Name</label>
          <input type="text" id="speakerLname" />
        </div>
        <button type="submit" class="btn-primary">Create Seminar</button>
      </form>
    </div>
  `;

  document.getElementById("seminarForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      e_name: document.getElementById("seminarTitle").value.trim(),
      e_starttime: document.getElementById("seminarStart").value,
      e_endtime: document.getElementById("seminarEnd").value,
      t_id: parseInt(document.getElementById("topicId").value),
      speaker_fname: document.getElementById("speakerFname").value.trim(),
      speaker_lname: document.getElementById("speakerLname").value.trim()
    };

    fetch('../api/insert_event_seminar.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Seminar added successfully!');
        loadManageSeminarContent(); // refresh
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Failed to add seminar.');
    });
  });
}


      // Load Manage Rooms Content
      function loadManageRoomsContent() {
        const pageContent = document.getElementById("pageContent");

        fetch("../pages/manage_rooms.html")
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.text();
          })
          .then((html) => {
            pageContent.innerHTML = html;

            // Wait for DOM to load, then run room loader
            const script = document.createElement("script");
            script.src = "../js/manage_rooms.js";
            script.onload = () => {
              if (typeof loadRooms === "function") {
                loadRooms();
              }
            };
            document.body.appendChild(script);
          })
          .catch((error) => {
            console.error("Error loading manage_rooms.html:", error);
            pageContent.innerHTML =
              '<p style="color:red;">Failed to load Manage Rooms page.</p>';
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

        fetch('../api/get_authors.php')
          .then(res => res.json())
          .then(data => {
            const tbody = document.getElementById('authorsTableBody');
            if (!tbody) return;

            if (data.status === 'success') {
              tbody.innerHTML = '';
              data.data.forEach(author => {
                const row = document.createElement('tr');
                const fname = author.U_FNAME ?? '-';
                const lname = author.U_LNAME ?? '';
                const email = author.U_EMAIL ?? '-';
                const address = author.FULL_ADDRESS ?? '-';

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
          .catch(error => {
            console.error('Fetch error:', error);
            const tbody = document.getElementById('authorsTableBody');
            if (tbody)
              tbody.innerHTML = `<tr><td colspan="4">Error loading authors.</td></tr>`;
          });
}



      function loadAddAuthorContent() {
  const pageContent = document.getElementById("pageContent");
  pageContent.innerHTML = `
    <div class="form-container">
      <form id="addAuthorForm">
        <div class="form-group">
          <label for="fname">First Name</label>
          <input type="text" id="fname" required />
        </div>
        <div class="form-group">
          <label for="lname">Last Name</label>
          <input type="text" id="lname" />
        </div>
        <div class="form-group">
          <label for="phone">Phone</label>
          <input type="text" id="phone" required />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" required />
        </div>
        <div class="form-group">
          <label for="street">Street</label>
          <input type="text" id="street" required />
        </div>
        <div class="form-group">
          <label for="city">City</label>
          <input type="text" id="city" required />
        </div>
        <div class="form-group">
          <label for="state">State</label>
          <input type="text" id="state" required />
        </div>
        <div class="form-group">
          <label for="country">Country</label>
          <input type="text" id="country" required />
        </div>
        <div class="form-group">
          <label for="zipcode">Zip Code</label>
          <input type="text" id="zipcode" required />
        </div>
        <button type="submit" class="btn-primary">Save Author</button>
      </form>
    </div>
  `;

  // ✅ Add event listener AFTER the HTML has been set
  const form = document.getElementById("addAuthorForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = {
      fname: document.getElementById("fname").value.trim(),
      lname: document.getElementById("lname").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value.trim(),
      street: document.getElementById("street").value.trim(),
      city: document.getElementById("city").value.trim(),
      state: document.getElementById("state").value.trim(),
      country: document.getElementById("country").value.trim(),
      zipcode: document.getElementById("zipcode").value.trim()
    };

    fetch('../api/insert_author.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'success') {
        alert('Author added successfully!');
        loadManageAuthorsContent(); // refresh author list
      } else {
        alert('Error: ' + data.message);
      }
    })
    .catch(err => {
      console.error(err);
      alert('Request failed.');
    });
  });
}
