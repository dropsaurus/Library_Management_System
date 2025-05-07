document.addEventListener('DOMContentLoaded', () => {
    const booksGrid = document.getElementById('booksGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    let allBooks = [];
    let allTopics = [];

    // Get the base URL for API calls
    const baseUrl = window.location.protocol + '//' + window.location.host + '/library_management';

    // Fetch topics from the API
    async function fetchTopics() {
        try {
            console.log('Fetching topics...');
            const response = await fetch(`${baseUrl}/api/get_topics.php`);
            console.log('Topics response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Topics data received:', data);
            
            if (data.status === 'success') {
                allTopics = data.data;
                console.log('Topics loaded:', allTopics);
                populateTopicFilter();
            } else {
                console.error('Error in topics API response:', data.message);
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
            categoryFilter.innerHTML = '<option value="">Error loading topics</option>';
        }
    }

    // Populate the topic filter dropdown
    function populateTopicFilter() {
        try {
            console.log('Populating topic filter...');
            categoryFilter.innerHTML = '<option value="">All Topics</option>';
            allTopics.forEach(topic => {
                const option = document.createElement('option');
                option.value = topic.T_NAME.toLowerCase();
                option.textContent = topic.T_NAME;
                categoryFilter.appendChild(option);
            });
            console.log('Topic filter populated with', allTopics.length, 'topics');
        } catch (error) {
            console.error('Error populating topic filter:', error);
        }
    }

    // Fetch books from the API
    async function fetchBooks() {
        try {
            console.log('Fetching books...');
            const response = await fetch(`${baseUrl}/api/get_books.php`);
            console.log('Books response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Books data received:', data);
            
            if (data.status === 'success') {
                allBooks = data.data;
                console.log('Books loaded:', allBooks);
                displayBooks(allBooks);
            } else {
                console.error('Error in books API response:', data.message);
                booksGrid.innerHTML = `<div class="error-message">Error: ${data.message}</div>`;
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            booksGrid.innerHTML = `<div class="error-message">Error loading books. Please try again later.</div>`;
        }
    }

    // Display books in the grid
    function displayBooks(books) {
        try {
            console.log('Displaying books:', books);
            booksGrid.innerHTML = '';
            
            if (books.length === 0) {
                booksGrid.innerHTML = '<div class="no-books">No books found</div>';
                return;
            }
            
            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';
                
                // Ensure available_copies doesn't exceed total_copies
                const availableCopies = Math.min(book.available_copies, book.total_copies);
                
                bookCard.innerHTML = `
                    <div class="book-info">
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-author">By ${book.authors || 'Unknown'}</p>
                        <span class="book-topic">${book.topic}</span>
                        <div class="book-status ${book.status.toLowerCase().replace(' ', '-')}">
                            ${book.status}
                        </div>
                        <div class="book-copies">
                            <span>Available: ${availableCopies} of ${book.total_copies}</span>
                        </div>
                    </div>
                `;
                
                booksGrid.appendChild(bookCard);
            });
            console.log('Books displayed successfully');
        } catch (error) {
            console.error('Error displaying books:', error);
            booksGrid.innerHTML = '<div class="error-message">Error displaying books</div>';
        }
    }

    // Filter books based on search input and category
    function filterBooks() {
        try {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedCategory = categoryFilter.value.toLowerCase();
            console.log('Filtering books:', { searchTerm, selectedCategory });

            const filteredBooks = allBooks.filter(book => {
                const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                                    (book.authors && book.authors.toLowerCase().includes(searchTerm));
                const matchesCategory = !selectedCategory || book.topic.toLowerCase() === selectedCategory;
                
                return matchesSearch && matchesCategory;
            });

            console.log('Filtered books:', filteredBooks);
            displayBooks(filteredBooks);
        } catch (error) {
            console.error('Error filtering books:', error);
        }
    }

    // Event listeners
    searchInput.addEventListener('input', filterBooks);
    categoryFilter.addEventListener('change', filterBooks);

    // Initial load
    console.log('Starting initial load...');
    fetchTopics();
    fetchBooks();
}); 