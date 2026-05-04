const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);
  const matchingBooks = {};
  bookKeys.forEach(key => {
    if (books[key].author === author) {
      matchingBooks[key] = books[key];
    }
  });
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const bookKeys = Object.keys(books);
  const matchingBooks = {};
  bookKeys.forEach(key => {
    if (books[key].title === title) {
      matchingBooks[key] = books[key];
    }
  });
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 10: Get the book list using Promise callbacks
public_users.get('/async/books', function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then((allBooks) => {
      return res.status(200).json(allBooks);
    })
    .catch((error) => {
      return res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});

// Task 11: Get book details based on ISBN using Promise callbacks
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  })
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((error) => {
      return res.status(error.status || 500).json({ message: error.message });
    });
});

// Task 12: Get book details based on Author using Promise callbacks
public_users.get('/async/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const matchingBooks = {};
    Object.keys(books).forEach((key) => {
      if (books[key].author === author) {
        matchingBooks[key] = books[key];
      }
    });
    if (Object.keys(matchingBooks).length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: "No books found for this author" });
    }
  })
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      return res.status(error.status || 500).json({ message: error.message });
    });
});

// Task 13: Get book details based on Title using Promise callbacks
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const matchingBooks = {};
    Object.keys(books).forEach((key) => {
      if (books[key].title === title) {
        matchingBooks[key] = books[key];
      }
    });
    if (Object.keys(matchingBooks).length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ status: 404, message: "No books found for this title" });
    }
  })
    .then((matchingBooks) => {
      return res.status(200).json(matchingBooks);
    })
    .catch((error) => {
      return res.status(error.status || 500).json({ message: error.message });
    });
});

module.exports.general = public_users;
