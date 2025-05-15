/**
 * Book rental functionality for the customer dashboard
 */

// Initialize books functionality when tab is clicked
function initializeBooks() {
  if (window.booksInitialized) return;
  
  // Setup filters
  setupBookFilters();
  
  // Load books
  loadBooks();
  
  // Mark as initialized
  window.booksInitialized = true;
}

function setupBookFilters() {
  const searchInput = document.getElementById('book-search');
  const categoryFilter = document.getElementById('book-category');
  
  // Load categories/topics
  loadBookCategories();
  
  // Setup filter event listeners
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      loadBooks();
    }, 500));
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => {
      loadBooks();
    });
  }
}

// Helper function to debounce search input
function debounce(func, delay) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

async function loadBookCategories() {
  try {
    const categoryFilter = document.getElementById('book-category');
    if (!categoryFilter) return;
    
    // Show loading state
    categoryFilter.innerHTML = '<option value="">Loading categories...</option>';
    
    const response = await fetch('../api/get_topics.php');
    const data = await response.json();
    
    if (data.status === 'success') {
      // Start with the "All Categories" option
      categoryFilter.innerHTML = '<option value="">All Categories</option>';
      
      // Add each category as an option
      data.data.forEach(topic => {
        const option = document.createElement('option');
        option.value = topic.T_ID;
        option.textContent = topic.T_NAME;
        categoryFilter.appendChild(option);
      });
    } else {
      console.error('Error loading categories:', data.message);
      categoryFilter.innerHTML = '<option value="">Error loading categories</option>';
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    document.getElementById('book-category').innerHTML = '<option value="">Error loading categories</option>';
  }
}

async function loadBooks() {
  // Get filter values
  const searchTerm = document.getElementById('book-search')?.value || '';
  const categoryId = document.getElementById('book-category')?.value || '';
  
  // Show loading indicator
  document.getElementById('books-grid').innerHTML = `
    <div class="loading-indicator">
      <p>Loading books...</p>
    </div>
  `;
  
  try {
    // Construct URL with query parameters
    let url = '../api/get_books.php';
    const params = new URLSearchParams();
    
    // Add search parameter if provided
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    // Add category filter if provided
    if (categoryId) {
      params.append('topic_id', categoryId);
    }
    
    // Add params to URL if any exist
    if ([...params].length > 0) {
      url += '?' + params.toString();
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'success') {
      displayBooks(data.books);
    } else {
      console.error('Error loading books:', data.message);
      document.getElementById('books-grid').innerHTML = `
        <p class="error-message">Unable to load books. ${data.message || 'Please try again later.'}</p>
      `;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    document.getElementById('books-grid').innerHTML = `
      <p class="error-message">Network error. Please check your connection and try again.</p>
    `;
  }
}

function displayBooks(books) {
  const booksGrid = document.getElementById('books-grid');
  
  if (!books || books.length === 0) {
    booksGrid.innerHTML = '<p>No books match your search criteria.</p>';
    return;
  }
  
  // Clear existing content
  booksGrid.innerHTML = '';
  
  // Create book cards
  books.forEach(book => {
    const availableCopies = parseInt(book.AVAILABLE_COPIES) || 0;
    const isAvailable = availableCopies > 0;
    
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    
    bookCard.innerHTML = `
      <div class="book-details">
        <h3 class="book-title">${book.BOOK_NAME}</h3>
        <p class="book-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" 
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Author: ${book.AUTHOR_NAME || 'Unknown'}
        </p>
        <p class="book-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Category: ${book.TOPIC_NAME || 'Uncategorized'}
        </p>
        <p class="book-info">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122" 
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Available Copies: <span class="${isAvailable ? 'status-available' : 'status-unavailable'}">${availableCopies}</span>
        </p>
        <button class="rent-button" onclick="rentBook(${book.BOOK_ID})" ${!isAvailable ? 'disabled' : ''}>
          ${isAvailable ? 'Rent Book' : 'Not Available'}
          ${isAvailable ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" 
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>` : ''}
        </button>
      </div>
    `;
    
    booksGrid.appendChild(bookCard);
  });
}

function switchBookTab(tabId) {
  // Hide all tab contents
  document.querySelectorAll('.book-tab-content').forEach(content => {
    content.style.display = 'none';
  });
  
  // Show selected tab content
  document.getElementById(tabId).style.display = 'block';
  
  // Update active tab button
  document.querySelectorAll('.book-tab-button').forEach(button => {
    if (button.getAttribute('data-tab') === tabId) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
  
  // Load data for My Rentals tab if selected
  if (tabId === 'my-rentals') {
    loadMyRentals();
  }
}

async function rentBook(bookId) {
  // Check if user is logged in - should always be true in dashboard
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    alert('You need to be logged in to rent a book.');
    return;
  }
  
  if (!confirm('Do you want to rent this book?')) {
    return; // User cancelled
  }
  
  try {
    const response = await fetch('../api/rent_book.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        book_id: bookId,
        customer_id: userId
      })
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      alert('Book rented successfully! You can view it in My Rentals.');
      // Refresh the books list
      loadBooks();
      // Switch to My Rentals tab
      switchBookTab('my-rentals');
    } else {
      alert(`Failed to rent book: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error renting book:', error);
    alert('There was an error processing your request. Please try again.');
  }
}

async function loadMyRentals() {
  const userId = localStorage.getItem('user_id');
  if (!userId) {
    // Should not happen in dashboard
    document.getElementById('my-rentals-content').innerHTML = `
      <div class="login-prompt">
        <p>Please log in to view your rentals.</p>
      </div>
    `;
    return;
  }
  
  // Show loading state
  document.getElementById('my-rentals-content').innerHTML = `
    <div class="loading-indicator">
      <p>Loading your rentals...</p>
    </div>
  `;
  
  try {
    const response = await fetch(`../api/get_rentals_customer.php?user_id=${userId}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      displayMyRentals(data.data);
    } else {
      console.error('Error loading rentals:', data.message);
      document.getElementById('my-rentals-content').innerHTML = `
        <p class="error-message">Unable to load your rentals. ${data.message || 'Please try again later.'}</p>
      `;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    document.getElementById('my-rentals-content').innerHTML = `
      <p class="error-message">Network error. Please check your connection and try again.</p>
    `;
  }
}

function displayMyRentals(rentals) {
  const rentalsContainer = document.getElementById('my-rentals-content');
  
  if (!rentals || rentals.length === 0) {
    rentalsContainer.innerHTML = '<p>You have no current rentals.</p>';
    return;
  }
  
  // Create table to display rentals
  let html = `
    <table class="rental-table">
      <thead>
        <tr>
          <th>Book</th>
          <th>Rental Date</th>
          <th>Due Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  rentals.forEach(rental => {
    // We're using RENT_DATE and RETURN_DATE which are aliases in the API
    // for the actual fields R_BORROWDATE and R_AC_RETURNDATE
    const rentDate = new Date(rental.RENT_DATE);
    // Due date is typically 14 days after rental
    const dueDate = new Date(rentDate);
    dueDate.setDate(dueDate.getDate() + 14);
    
    html += `
      <tr>
        <td>${rental.BOOK_NAME}</td>
        <td>${formatDate(rental.RENT_DATE)}</td>
        <td>${formatDate(dueDate.toISOString())}</td>
        <td>${rental.RETURN_DATE ? 'Returned' : 'Active'}</td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  rentalsContainer.innerHTML = html;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
} 