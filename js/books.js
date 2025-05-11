document.addEventListener('DOMContentLoaded', () => {
    const booksGrid = document.getElementById('booksGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    let allBooks = [];
    let allTopics = [];

    const baseUrl = window.location.origin + '/library_management/api';

    async function fetchTopics() {
        try {
            const response = await fetch(`${baseUrl}/get_topics.php`);
            console.log('Topics response status:', response.status);
            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('❌ Invalid JSON from get_topics.php:', text);
                throw e;
            }

            if (data.status === 'success') {
                allTopics = data.data;
                populateTopicFilter();
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            console.error('Error fetching topics:', error);
            categoryFilter.innerHTML = '<option value="">Error loading topics</option>';
        }
    }

    function populateTopicFilter() {
        categoryFilter.innerHTML = '<option value="">All Topics</option>';
        allTopics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic.T_NAME.toLowerCase();
            option.textContent = topic.T_NAME;
            categoryFilter.appendChild(option);
        });
    }

    async function fetchBooks() {
        try {
            const response = await fetch(`${baseUrl}/get_books.php`);
            console.log('Books response status:', response.status);
            const text = await response.text();

            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('❌ Invalid JSON from get_books.php:', text);
                throw e;
            }

            if (data.status === 'success') {
                allBooks = data.data;
                displayBooks(allBooks);
            } else {
                booksGrid.innerHTML = `<div class="error-message">Error: ${data.message}</div>`;
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            booksGrid.innerHTML = `<div class="error-message">Error loading books. Please try again later.</div>`;
        }
    }

    function displayBooks(books) {
        booksGrid.innerHTML = '';

        if (!books.length) {
            booksGrid.innerHTML = '<div class="no-books">No books found</div>';
            return;
        }

        books.forEach(book => {
            const availableCopies = Math.min(
                parseInt(book.available_copies) || 0,
                parseInt(book.total_copies) || 0
            );

            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';

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
    }

    function filterBooks() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value.toLowerCase();

        const filteredBooks = allBooks.filter(book => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm) ||
                (book.authors && book.authors.toLowerCase().includes(searchTerm));
            const matchesCategory = !selectedCategory || book.topic.toLowerCase() === selectedCategory;

            return matchesSearch && matchesCategory;
        });

        displayBooks(filteredBooks);
    }

    searchInput.addEventListener('input', filterBooks);
    categoryFilter.addEventListener('change', filterBooks);

    fetchTopics();
    fetchBooks();
});
