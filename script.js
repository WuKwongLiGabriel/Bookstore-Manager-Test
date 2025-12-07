document.addEventListener('DOMContentLoaded', function() {
    const addBookBtn = document.getElementById('add-book-btn');
    const closeFormBtn = document.getElementById('close-form-btn');
    const formOverlay = document.getElementById('book-form-overlay');
    const bookForm = document.getElementById('book-form');
    const formTitle = document.getElementById('form-title');
    const bookList = document.getElementById('book-list');
    
    // Load books on page load
    loadBooks();
    
    // Show form for adding a new book
    addBookBtn.addEventListener('click', function() {
        formTitle.textContent = 'Add Book';
        document.getElementById('book-id').value = '';
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('year').value = '';
        formOverlay.classList.add('visible');
    });
    
    // Hide form when close button is clicked
    closeFormBtn.addEventListener('click', function() {
        formOverlay.classList.remove('visible');
    });

    // Hide form when clicking outside the form
    formOverlay.addEventListener('click', function(e) {
        if (e.target === formOverlay) {
            formOverlay.classList.remove('visible');
        }
    });

    // Handle form submission
    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const bookId = document.getElementById('book-id').value;
        const bookData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            year: parseInt(document.getElementById('year').value)
        };
        
        try {
            if (bookId) {
                // Update existing book
                updateBook(bookId, bookData);
            } else {
                // Add new book
                addNewBook(bookData);
            }
            
            // Refresh the book list
            loadBooks();
            
            // Close the form
            formOverlay.classList.remove('visible');
        } catch (error) {
            console.error('Error saving book:', error);
            alert('Failed to save book. Please try again.');
        }
    });

    // Handle edit and delete button clicks using event delegation
    bookList.addEventListener('click', function(e) {
        if (e.target.classList.contains('edit-btn')) {
            const bookId = e.target.getAttribute('data-book-id');
            handleEditBook(bookId);
        } else if (e.target.classList.contains('delete-btn')) {
            const bookId = e.target.getAttribute('data-book-id');
            handleDeleteBook(bookId);
        }
    });

    // Load books from localStorage
    function loadBooks() {
        try {
            getAllBooks();
            renderBooks();
        } catch (error) {
            console.error('Error loading books:', error);
        }
    }

    // Render books to the DOM
    function renderBooks() {
        bookList.innerHTML = '';
        
        if (books.length === 0) {
            bookList.innerHTML = '<p style="padding: 20px; text-align: center; color: #7f8c8d;">No books found. Add your first book!</p>';
            return;
        }
        
        books.forEach(book => {
            const bookItem = document.createElement('div');
            bookItem.className = 'book-item';
            bookItem.innerHTML = `
                <div class="book-info">
                    <h3 class="book-title">${escapeHtml(book.title)}</h3>
                    <p class="book-details">${escapeHtml(book.author)} - ${book.year}</p>
                </div>
                <div class="book-actions">
                    <button class="edit-btn" data-book-id="${book.id}">Edit</button>
                    <button class="delete-btn" data-book-id="${book.id}">Delete</button>
                </div>
            `;
            bookList.appendChild(bookItem);
        });
    }

    // Handle edit book
    function handleEditBook(bookId) {
        const book = getBookById(bookId);
        if (book) {
            formTitle.textContent = 'Edit Book';
            document.getElementById('book-id').value = book.id;
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            document.getElementById('year').value = book.year;
            formOverlay.classList.add('visible');
        }
    }

    // Handle delete book
    function handleDeleteBook(bookId) {
        if (confirm('Are you sure you want to delete this book?')) {
            try {
                deleteBook(bookId);
                loadBooks();
            } catch (error) {
                console.error('Error deleting book:', error);
                alert('Failed to delete book. Please try again.');
            }
        }
    }

    // Escape HTML to prevent XSS
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});