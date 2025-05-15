// Initialize rentals page
function initRentalsPage() {
  const tableBody = document.getElementById("rentals-table-body");
  const statusFilter = document.getElementById("status-filter");
  const searchInput = document.getElementById("search-input");
  const noRentalsMessage = document.getElementById("no-rentals");
  const loadingSpinner = document.getElementById("loading-spinner");
  const newRentalButton = document.getElementById("new-rental-button");
  const newRentalModal = document.getElementById("new-rental-modal");
  const closeModalBtn = document.querySelector(".close-modal");
  const cancelRentalBtn = document.getElementById("cancel-rental");
  const submitRentalBtn = document.getElementById("submit-rental");
  const bookCopySelect = document.getElementById("book-copy-select");

  let rentalsData = [];
  let availableCopies = [];

  // Open modal
  newRentalButton.addEventListener("click", function () {
    loadAvailableCopies();
    newRentalModal.style.display = "block";
  });

  // Close modal (×)
  closeModalBtn.addEventListener("click", function () {
    newRentalModal.style.display = "none";
  });

  // Close modal (Cancel button)
  cancelRentalBtn.addEventListener("click", function () {
    newRentalModal.style.display = "none";
  });

  // Submit rental
  submitRentalBtn.addEventListener("click", function () {
    createNewRental();
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === newRentalModal) {
      newRentalModal.style.display = "none";
    }
  });

  // Load available book copies
  const loadAvailableCopies = async () => {
    try {
      bookCopySelect.innerHTML =
        '<option value="">-- Loading books... --</option>';

      const response = await fetch("../api/get_available_copies.php", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.status === "success") {
        availableCopies = result.data || [];

        if (availableCopies.length === 0) {
          bookCopySelect.innerHTML =
            '<option value="">No books available for rental</option>';
        } else {
          bookCopySelect.innerHTML =
            '<option value="">-- Select a book --</option>';

          availableCopies.forEach((copy) => {
            const option = document.createElement("option");
            option.value = copy.COPY_ID;
            option.textContent = `${copy.BOOK_NAME} (Copy ID: ${copy.COPY_ID})`;
            bookCopySelect.appendChild(option);
          });
        }
      } else {
        throw new Error(result.message || "Failed to load available books");
      }
    } catch (error) {
      console.error("Error loading available books:", error);
      bookCopySelect.innerHTML =
        '<option value="">Error loading books</option>';
    }
  };

  // Load rentals data
  const loadRentals = async () => {
    try {
      loadingSpinner.style.display = "flex";
      const userId = localStorage.getItem("user_id");

      const response = await fetch("../api/get_rentals_customer.php", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.status === "success") {
        rentalsData = result.data;
        if (result.message === "No rental records found") {
          noRentalsMessage.innerHTML =
            "<p>You have not borrowed any books yet.</p>";
          noRentalsMessage.style.display = "block";
          tableBody.innerHTML = "";
          // Hide filters when no rentals
          statusFilter.parentElement.style.display = "none";
        } else {
          statusFilter.parentElement.style.display = "flex";
          filterAndDisplayRentals();
        }
      } else {
        throw new Error(result.message || "Failed to load rentals");
      }
    } catch (error) {
      console.error("Error loading rentals:", error);
      showError("Failed to load rental history. Please try again later.");
    } finally {
      loadingSpinner.style.display = "none";
    }
  };

  // Filter and display rentals
  const filterAndDisplayRentals = () => {
    const statusValue = statusFilter.value;
    const searchValue = searchInput.value.toLowerCase();

    const filteredRentals = rentalsData.filter((rental) => {
      const matchesStatus =
        statusValue === "all" || getStatus(rental) === statusValue;
      const matchesSearch =
        rental.BOOK_NAME.toLowerCase().includes(searchValue);
      return matchesStatus && matchesSearch;
    });

    displayRentals(filteredRentals);
  };

  // Get rental status
  const getStatus = (rental) => {
    if (rental.R_AC_RETURNDATE) return "returned";

    const expectedReturn = new Date(rental.R_EX_RETURNDATE);
    const today = new Date();

    return today > expectedReturn ? "overdue" : "active";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Display rentals in table
  const displayRentals = (rentals) => {
    if (rentals.length === 0) {
      tableBody.innerHTML = "";
      if (searchInput.value || statusFilter.value !== "all") {
        noRentalsMessage.innerHTML =
          "<p>No rentals found matching your filters.</p>";
      } else {
        noRentalsMessage.innerHTML =
          "<p>You have not borrowed any books yet.</p>";
      }
      noRentalsMessage.style.display = "block";
      return;
    }

    noRentalsMessage.style.display = "none";
    tableBody.innerHTML = rentals
      .map((rental) => {
        const status = getStatus(rental);
        return `
                <tr>
                    <td>${rental.BOOK_NAME}</td>
                    <td>${formatDate(rental.R_BORROWDATE)}</td>
                    <td>${formatDate(rental.R_EX_RETURNDATE)}</td>
                    <td>${formatDate(rental.R_AC_RETURNDATE)}</td>
                    <td>
                        <span class="status-badge status-${status}">
                            ${status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                    </td>
                    <td>
                        ${
                          status === "active"
                            ? `
                            <button class="btn btn-small" onclick="extendRental(${rental.R_ID})">
                                Extend
                            </button>
                        `
                            : ""
                        }
                    </td>
                </tr>
            `;
      })
      .join("");
  };

  // Show error message
  const showError = (message) => {
    // You can implement a proper error notification system here
    alert(message);
  };

  // Event listeners
  statusFilter.addEventListener("change", filterAndDisplayRentals);
  searchInput.addEventListener("input", filterAndDisplayRentals);

  // Initialize
  loadRentals();
}

// Function to extend rental period
async function extendRental(rentalId) {
  try {
    const response = await fetch("../api/extend_rental.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rental_id: rentalId }),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Rental period extended successfully!");
      initRentalsPage(); // Reload the rentals page instead of full page refresh
    } else {
      throw new Error(result.message || "Failed to extend rental");
    }
  } catch (error) {
    console.error("Error extending rental:", error);
    alert("Failed to extend rental. Please try again later.");
  }
}

// Function to create a new rental
async function createNewRental() {
  const copyId = document.getElementById("book-copy-select").value;
  const rentalDuration = document.getElementById("rental-duration").value;

  if (!copyId) {
    alert("Please select a book to rent");
    return;
  }

  // Calculate the expected return date based on the selected duration
  const borrowDate = new Date();
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + parseInt(rentalDuration));

  const rentalData = {
    r_status: "active",
    r_borrowdate: borrowDate.toISOString().split("T")[0],
    r_ex_returndate: returnDate.toISOString().split("T")[0],
    cust_id: localStorage.getItem("user_id"),
    copy_id: copyId,
  };

  try {
    const response = await fetch("../api/create_rental.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rentalData),
    });

    const result = await response.json();

    if (result.status === "success") {
      alert("Rental created successfully!");
      document.getElementById("new-rental-modal").style.display = "none";
      document.getElementById("book-copy-select").value = "";
      initRentalsPage(); // Reload the rentals page
    } else {
      throw new Error(result.message || "Failed to create rental");
    }
  } catch (error) {
    console.error("Error creating rental:", error);
    alert(
      "Failed to create rental: " + (error.message || "Please try again later.")
    );
  }
}

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initRentalsPage();
});
