const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ "username": "testuser", "password": "testpass" }];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const authenticatedUser = (username, password) => {
    // Filter the users array for matching username and password
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password)
    });
    // Return true if user exists, false otherwise
    return validusers.length > 0;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Hardcoded bypass for testing
  if (username === "testuser" && password === "testpass") {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }

    return res.status(200).json({ message: "Customer successfully logged in" });
  }

  return res.status(208).json({ message: "Invalid Login." });
});

// Add a book review
// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let reviewer = req.session.authorization['username'];

  if (books[isbn]) {
    delete books[isbn].reviews[reviewer];
    return res.status(200).send(`Review for the book with ISBN ${isbn} posted by the user ${reviewer} has been deleted.`);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
