let books = [];

// LocalStorage key
const STORAGE_KEY = 'bookstore_books';

// Initialize books from localStorage
function initializeBooks() {
    const storedBooks = localStorage.getItem(STORAGE_KEY);
    if (storedBooks) {
        books = JSON.parse(storedBooks);
    } else {
        // Initialize with sample data if localStorage is empty
        books = [
            { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
            { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 }
        ];
        saveToLocalStorage();
    }
}

// Save books to localStorage
function saveToLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function getAllBooks() {
    initializeBooks();
    return books;
}

function getBookById(id) {
    return books.find(book => book.id == id);
}

function addNewBook(bookData) {
    // Generate new ID
    const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;
    
    const newBook = {
        id: newId,
        ...bookData
    };
    
    books.push(newBook);
    saveToLocalStorage();
    return newBook;
}

function updateBook(id, bookData) {
    const index = books.findIndex(book => book.id == id);
    if (index !== -1) {
        books[index] = { id: parseInt(id), ...bookData };
        saveToLocalStorage();
        return books[index];
    }
    throw new Error('Book not found');
}

function deleteBook(id) {
    books = books.filter(book => book.id != id);
    saveToLocalStorage();
    return true;
}