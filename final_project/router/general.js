const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required for Tasks 11-14

// Task 7: Register User
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    let userExists = users.filter((user) => user.username === username);
    if (userExists.length > 0) {
      return res.status(404).json({ message: "User already exists!" });
    } else {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }
  }
  return res.status(400).json({ message: "Unable to register user." });
});

// Task 1: Get all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Task 3: Get book by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let result = {};
  for (let key in books) {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  }
  return res.status(200).json(result);
});

// Task 4: Get book by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let result = {};
  for (let key in books) {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  }
  return res.status(200).json(result);
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// ==========================================
// TASKS 11-14: AXIOS & ASYNC/AWAIT
// ==========================================
const localURL = "http://localhost:5001"; // Change to 5000 if your server runs on 5000

// Task 11: Get all books using Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get(localURL + '/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 12: Get book by ISBN using Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
  try {
    const response = await axios.get(localURL + '/isbn/' + req.params.isbn);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});

// Task 13: Get book by Author using Axios
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const response = await axios.get(localURL + '/author/' + encodeURIComponent(req.params.author));
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});

// Task 14: Get book by Title using Axios
public_users.get('/async/title/:title', async function (req, res) {
  try {
    const response = await axios.get(localURL + '/title/' + encodeURIComponent(req.params.title));
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book" });
  }
});

module.exports.general = public_users;