
      document.addEventListener("DOMContentLoaded", () => {
        // Initialize theme
        initializeTheme();

        // Set up user name in button and sidebar
        const fname = localStorage.getItem("user_fname") || "";
        const lname = localStorage.getItem("user_lname") || "";
        const name =
          fname && lname ? `${fname} ${lname}` : fname || lname || "Guest";

        // Update dropdown button
        const userBtn = document.getElementById("user-button");
        if (userBtn) {
          userBtn.textContent = `👤 ${name} ▼`;
        }

        // Update sidebar profile
        const sidebarName = document.getElementById("sidebar-user-name");
        if (sidebarName) {
          sidebarName.textContent = name;
        }

        // Add dynamic links for users with special roles
        const isAuthor = localStorage.getItem("is_author") === "true";
        const isSponsor = localStorage.getItem("is_sponsor") === "true";

        if (isAuthor || isSponsor) {
          const sidebarNav = document.querySelector(".sidebar-nav");

          if (isAuthor) {
            const seminarsItem = document.createElement("li");
            seminarsItem.className = "sidebar-nav-item";
            seminarsItem.onclick = () =>
              loadPage("seminars.html", seminarsItem);
            seminarsItem.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Seminars
            `;
            sidebarNav.appendChild(seminarsItem);
          }

          if (isSponsor) {
            const sponsorItem = document.createElement("li");
            sponsorItem.className = "sidebar-nav-item";
            sponsorItem.onclick = () =>
              loadPage("sponsor_seminar.html", sponsorItem);
            sponsorItem.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sponsor Seminar
            `;
            sidebarNav.appendChild(sponsorItem);
          }
        }

        // Load initial dashboard content
        loadDashboardContent();
      });

      function logout() {
        [
          "user_id",
          "user_fname",
          "user_lname",
          "user_role",
          "is_author",
          "is_sponsor",
        ].forEach((key) => {
          localStorage.removeItem(key);
        });
        window.location.href = "login.html";
      }

      function loadPage(url, menuItem = null) {
        // Set active menu item
        if (menuItem) {
          document.querySelectorAll(".sidebar-nav-item").forEach((item) => {
            item.classList.remove("active");
          });
          menuItem.classList.add("active");
        }

        fetch(url)
          .then((response) => {
            if (!response.ok) throw new Error(`Failed to load ${url}`);
            return response.text();
          })
          .then((html) => {
            // Clear existing content first
            const dashboardContent =
              document.getElementById("dashboard-content");
            dashboardContent.innerHTML = "";

            // Remove any existing hero section
            const existingHero = document.querySelector(".hero-section");
            if (existingHero) {
              existingHero.remove();
            }

            // Create a temporary element to parse the HTML
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            // Extract only the main content, excluding header and footer
            const mainContent = tempDiv.querySelector("main");

            if (mainContent) {
              // Add only the main content to the dashboard
              dashboardContent.innerHTML = mainContent.innerHTML;
            } else {
              // If no main element found, add the entire content
              dashboardContent.innerHTML = html;
            }

            // Apply theme colors to any white backgrounds
            applyThemeColors();

            // Page-specific initialization logic
            if (
              url.includes("events.html") &&
              typeof initEventsPage === "function"
            )
              initEventsPage();
            if (
              url.includes("books.html") &&
              typeof initBooksPage === "function"
            )
              initBooksPage();
            if (
              url.includes("cust_profile.html") &&
              typeof initProfilePage === "function"
            )
              initProfilePage();
            if (
              url.includes("my_rentals.html") &&
              typeof initRentalsPage === "function"
            )
              initRentalsPage();
            if (
              url.includes("my_bookings.html") &&
              typeof initBookingsPage === "function"
            )
              initBookingsPage();
          })
          .catch((error) => {
            console.error("Error loading page:", error);
            document.getElementById(
              "dashboard-content"
            ).innerHTML = `<p class="error">Failed to load content. Please try again later.</p>`;
          });
      }

      // Function to apply theme colors to elements with white backgrounds
      function applyThemeColors() {
        // Find elements with white backgrounds
        const contentArea = document.getElementById("dashboard-content");
        if (!contentArea) return;

        // Apply background color to any elements that might have white backgrounds
        const elementsToStyle = contentArea.querySelectorAll(
          "div, section, table, form"
        );
        elementsToStyle.forEach((el) => {
          const computedStyle = window.getComputedStyle(el);
          if (
            computedStyle.backgroundColor === "rgb(255, 255, 255)" ||
            computedStyle.backgroundColor === "#ffffff" ||
            computedStyle.backgroundColor === "white"
          ) {
            el.style.backgroundColor = "var(--bg-primary)";
          }
        });
      }

      function loadDashboardContent() {
        // Set active menu item for Dashboard
        document.querySelectorAll(".sidebar-nav-item").forEach((item) => {
          item.classList.remove("active");
        });
        document
          .querySelector(".sidebar-nav-item:first-child")
          .classList.add("active");

        // Create dashboard content with stats, feature cards, recent activity
        const dashboardHTML = `
          <h1 class="dashboard-title">Library Dashboard</h1>
          
          <div class="stats-cards" style="gap: 20px; margin-bottom: 30px;">
            <div class="stats-card" style="background: linear-gradient(135deg, #f5a623 0%, #f7b733 100%); border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h3 style="font-size: 1.2rem; margin-bottom: 10px;">Books Borrowed</h3>
              <div class="stats-value" id="books-borrowed" style="font-size: 2rem;">0</div>
            </div>
            
            <div class="stats-card" style="background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h3 style="font-size: 1.2rem; margin-bottom: 10px;">Study Rooms Reserved</h3>
              <div class="stats-value" id="rooms-reserved" style="font-size: 2rem;">0</div>
            </div>
            
            <div class="stats-card" style="background: linear-gradient(135deg, #2ecc71 0%, #27ae60 100%); border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h3 style="font-size: 1.2rem; margin-bottom: 10px;">Events Registered</h3>
              <div class="stats-value" id="events-registered" style="font-size: 2rem;">0</div>
            </div>
            
            <div class="stats-card" style="background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%); border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h3 style="font-size: 1.2rem; margin-bottom: 10px;">Reading Streak</h3>
              <div class="stats-value" id="reading-streak" style="font-size: 2rem;">0</div>
              <div style="font-size: 0.9rem;">days</div>
            </div>
          </div>
          
          <div class="chart-container" style="padding: 20px; border-radius: 10px; margin-bottom: 30px;">
            <h2 class="chart-title" style="margin-bottom: 15px; padding: 0 10px;">Library Usage Statistics</h2>
            <div id="statistics-chart" style="padding: 10px;">
              <canvas id="usage-chart" width="800" height="400"></canvas>
            </div>
          </div>
          
          <div class="dashboard-grid-layout" style="gap: 25px;">
            <div style="padding: 15px; background: var(--card-bg); border-radius: 10px;">
              <h3 class="section-title" style="margin-bottom: 15px; padding: 0 5px;">Recent Activity</h3>
              <div class="activity-timeline">
                <div class="timeline-item" style="border-radius: 8px; margin-bottom: 12px;">
                  <div class="timeline-icon" style="padding: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div class="timeline-content" style="padding: 0 10px;">
                    <div class="timeline-title" style="font-weight: 500;">You borrowed "The Great Gatsby"</div>
                    <div class="timeline-date" style="font-size: 0.85rem; opacity: 0.8;">3 days ago</div>
                    <div class="timeline-description" style="font-size: 0.9rem;">Due date: June 15, 2024</div>
                  </div>
                </div>
                
                <div class="timeline-item" style="border-radius: 8px; margin-bottom: 12px;">
                  <div class="timeline-icon" style="padding: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div class="timeline-content" style="padding: 0 10px;">
                    <div class="timeline-title" style="font-weight: 500;">You registered for "Summer Reading Workshop"</div>
                    <div class="timeline-date" style="font-size: 0.85rem; opacity: 0.8;">1 week ago</div>
                    <div class="timeline-description" style="font-size: 0.9rem;">Event date: July 10, 2024</div>
                  </div>
                </div>
                
                <div class="timeline-item" style="border-radius: 8px; margin-bottom: 12px;">
                  <div class="timeline-icon" style="padding: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </div>
                  <div class="timeline-content" style="padding: 0 10px;">
                    <div class="timeline-title" style="font-weight: 500;">You reserved Study Room #2</div>
                    <div class="timeline-date" style="font-size: 0.85rem; opacity: 0.8;">2 weeks ago</div>
                    <div class="timeline-description" style="font-size: 0.9rem;">Reservation date: May 30, 2024</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style="padding: 15px; background: var(--card-bg); border-radius: 10px;">
              <h3 class="section-title" style="margin-bottom: 15px; padding: 0 5px;">Upcoming Events</h3>
              <div class="event-list">
                <div class="event-card" style="border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                  <h4 class="event-title" style="font-size: 1.1rem; margin-bottom: 5px;">Summer Reading Workshop</h4>
                  <p class="event-date" style="font-size: 0.85rem; opacity: 0.8;">July 10, 2024 • 2:00 PM</p>
                  <p class="event-desc" style="font-size: 0.9rem;">Join us for tips and strategies to make the most of your summer reading.</p>
                </div>
                
                <div class="event-card" style="border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                  <h4 class="event-title" style="font-size: 1.1rem; margin-bottom: 5px;">Book Club: Mystery Novels</h4>
                  <p class="event-date" style="font-size: 0.85rem; opacity: 0.8;">July 15, 2024 • 6:30 PM</p>
                  <p class="event-desc" style="font-size: 0.9rem;">This month we're discussing "The Silent Patient" by Alex Michaelides.</p>
                </div>
                
                <div class="event-card" style="border-radius: 8px; padding: 12px; margin-bottom: 12px;">
                  <h4 class="event-title" style="font-size: 1.1rem; margin-bottom: 5px;">Children's Story Time</h4>
                  <p class="event-date" style="font-size: 0.85rem; opacity: 0.8;">July 18, 2024 • 10:00 AM</p>
                  <p class="event-desc" style="font-size: 0.9rem;">Interactive storytelling session for children ages 3-8.</p>
                </div>
                
                <a href="#" onclick="loadPage('events.html')" class="view-all-link" style="display: block; text-align: center; margin-top: 15px; padding: 8px; border-radius: 6px;">View All Events</a>
              </div>
            </div>
          </div>
        `;

        document.getElementById("dashboard-content").innerHTML = dashboardHTML;

        // Load Chart.js dynamically
        if (!document.getElementById("chartjs-script")) {
          const script = document.createElement("script");
          script.id = "chartjs-script";
          script.src = "https://cdn.jsdelivr.net/npm/chart.js";
          script.onload = initializeChart;
          document.head.appendChild(script);
        } else {
          initializeChart();
        }

        // Load real statistics data
        loadUserStatistics();
      }

      async function loadUserStatistics() {
        try {
          const userId = localStorage.getItem("user_id");
          if (!userId) {
            console.error("User ID not found in localStorage");
            return;
          }

          // Fetch books borrowed
          fetch(`../api/get_user_rentals.php?user_id=${userId}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                const borrowedCount = data.rentals ? data.rentals.length : 0;
                document.getElementById("books-borrowed").textContent =
                  borrowedCount;
                updateChartData("Books Borrowed", borrowedCount);
              }
            })
            .catch((error) => {
              console.error("Error fetching borrowed books:", error);
              document.getElementById("books-borrowed").textContent = "0";
            });

          // Fetch room reservations
          fetch(`../api/get_user_bookings.php?user_id=${userId}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                const roomsCount = data.bookings ? data.bookings.length : 0;
                document.getElementById("rooms-reserved").textContent =
                  roomsCount;
                updateChartData("Rooms Reserved", roomsCount);
              }
            })
            .catch((error) => {
              console.error("Error fetching room reservations:", error);
              document.getElementById("rooms-reserved").textContent = "0";
            });

          // Fetch event registrations
          fetch(`../api/get_user_events.php?user_id=${userId}`)
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                const eventsCount = data.events ? data.events.length : 0;
                document.getElementById("events-registered").textContent =
                  eventsCount;
                updateChartData("Events Registered", eventsCount);
              }
            })
            .catch((error) => {
              console.error("Error fetching event registrations:", error);
              document.getElementById("events-registered").textContent = "0";
            });

          // For reading streak, we might not have an API yet, so use a placeholder
          document.getElementById("reading-streak").textContent = "14";
          updateChartData("Reading Streak", 14);
        } catch (error) {
          console.error("Error loading user statistics:", error);
          // Set default values as fallback
          document.getElementById("books-borrowed").textContent = "3";
          document.getElementById("rooms-reserved").textContent = "2";
          document.getElementById("events-registered").textContent = "4";
          document.getElementById("reading-streak").textContent = "14";
        }
      }

      // Global chart reference
      let userStatsChart;

      function updateChartData(label, value) {
        if (!userStatsChart) return;

        const datasetIndex = 0;
        const labelIndex = userStatsChart.data.labels.indexOf(label);

        if (labelIndex !== -1) {
          userStatsChart.data.datasets[datasetIndex].data[labelIndex] = value;
          userStatsChart.update();
        }
      }

      function initializeChart() {
        // Get data from API or use sample data
        const labels = [
          "Books Borrowed",
          "Rooms Reserved",
          "Events Registered",
          "Reading Streak",
        ];
        const data = [0, 0, 0, 0]; // Start with zeros, will be updated by API calls
        const backgroundColors = [
          "rgba(247, 183, 51, 0.8)",
          "rgba(52, 152, 219, 0.8)",
          "rgba(46, 204, 113, 0.8)",
          "rgba(155, 89, 182, 0.8)",
        ];

        const ctx = document.getElementById("usage-chart").getContext("2d");

        userStatsChart = new Chart(ctx, {
          type: "bar",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Library Activity",
                data: data,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map((color) =>
                  color.replace("0.8", "1")
                ),
                borderWidth: 1,
                barThickness: 40,
                maxBarThickness: 60,
              },
            ],
          },
          options: {
            indexAxis: "y", // Horizontal bar chart
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: "WOW Library Statistics",
                font: {
                  size: 18,
                  weight: "bold",
                },
                color: "#fff",
                padding: 20,
              },
              legend: {
                display: false,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                  color: "#fff",
                },
                title: {
                  display: true,
                  text: "Count",
                  color: "#fff",
                },
              },
              y: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#fff",
                },
              },
            },
            layout: {
              padding: {
                left: 10,
                right: 25,
                top: 0,
                bottom: 0,
              },
            },
            backgroundColor: "#1e1e1e",
          },
        });

        // Set chart background color
        document.querySelector(".chart-container").style.backgroundColor =
          "#1e1e1e";
        document.querySelector(".chart-title").style.color = "#fff";
      }
  