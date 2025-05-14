// Initialize rentals page
function initRentalsPage() {
    const tableBody = document.getElementById('rentals-table-body');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-input');
    const noRentalsMessage = document.getElementById('no-rentals');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    let rentalsData = [];

    // Load rentals data
    const loadRentals = async () => {
        try {
            loadingSpinner.style.display = 'flex';
            const userId = localStorage.getItem('user_id');
            
            const response = await fetch('../api/get_rentals_customer.php', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            
            if (result.status === 'success') {
                rentalsData = result.data;
                if (result.message === "No rental records found") {
                    noRentalsMessage.innerHTML = '<p>You have not borrowed any books yet.</p>';
                    noRentalsMessage.style.display = 'block';
                    tableBody.innerHTML = '';
                    // Hide filters when no rentals
                    statusFilter.parentElement.style.display = 'none';
                } else {
                    statusFilter.parentElement.style.display = 'flex';
                    filterAndDisplayRentals();
                }
            } else {
                throw new Error(result.message || 'Failed to load rentals');
            }
        } catch (error) {
            console.error('Error loading rentals:', error);
            showError('Failed to load rental history. Please try again later.');
        } finally {
            loadingSpinner.style.display = 'none';
        }
    };

    // Filter and display rentals
    const filterAndDisplayRentals = () => {
        const statusValue = statusFilter.value;
        const searchValue = searchInput.value.toLowerCase();

        const filteredRentals = rentalsData.filter(rental => {
            const matchesStatus = statusValue === 'all' || getStatus(rental) === statusValue;
            const matchesSearch = rental.BOOK_NAME.toLowerCase().includes(searchValue);
            return matchesStatus && matchesSearch;
        });

        displayRentals(filteredRentals);
    };

    // Get rental status
    const getStatus = (rental) => {
        if (rental.R_AC_RETURNDATE) return 'returned';
        
        const expectedReturn = new Date(rental.R_EX_RETURNDATE);
        const today = new Date();
        
        return today > expectedReturn ? 'overdue' : 'active';
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Display rentals in table
    const displayRentals = (rentals) => {
        if (rentals.length === 0) {
            tableBody.innerHTML = '';
            if (searchInput.value || statusFilter.value !== 'all') {
                noRentalsMessage.innerHTML = '<p>No rentals found matching your filters.</p>';
            } else {
                noRentalsMessage.innerHTML = '<p>You have not borrowed any books yet.</p>';
            }
            noRentalsMessage.style.display = 'block';
            return;
        }

        noRentalsMessage.style.display = 'none';
        tableBody.innerHTML = rentals.map(rental => {
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
                        ${status === 'active' ? `
                            <button class="btn btn-small" onclick="extendRental(${rental.R_ID})">
                                Extend
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    };

    // Show error message
    const showError = (message) => {
        // You can implement a proper error notification system here
        alert(message);
    };

    // Event listeners
    statusFilter.addEventListener('change', filterAndDisplayRentals);
    searchInput.addEventListener('input', filterAndDisplayRentals);

    // Initialize
    loadRentals();
}

// Function to extend rental period
async function extendRental(rentalId) {
    try {
        const response = await fetch('../api/extend_rental.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rental_id: rentalId })
        });

        const result = await response.json();
        
        if (result.status === 'success') {
            alert('Rental period extended successfully!');
            initRentalsPage(); // Reload the rentals page instead of full page refresh
        } else {
            throw new Error(result.message || 'Failed to extend rental');
        }
    } catch (error) {
        console.error('Error extending rental:', error);
        alert('Failed to extend rental. Please try again later.');
    }
}
