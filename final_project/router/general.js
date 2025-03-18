const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}


public_users.post("/register", (req,res) => {
  //Write your code here
  // Register a new user
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  new Promise((resolve, reject) => {
    resolve(books);
})
.then((bookList) => {
    res.send(JSON.stringify(bookList, null, 3));
})
.catch((err) => {
    res.status(500).json({message: "Error fetching book list"});
});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  try {
      const book = books[isbn];
      if (book) {
          res.send(book);
      } else {
          res.status(404).json({message: "Book not found"});
      }
  } catch (error) {
      res.status(500).json({message: "Error fetching book details"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  try {
      const selected_author = [];
      for (const [key, values] of Object.entries(books)) {
          if (values.author === author) {
              selected_author.push(values);
          }
      }
      if (selected_author.length > 0) {
          res.send(selected_author);
      } else {
          res.status(404).json({message: "Author not found"});
      }
  } catch (error) {
      res.status(500).json({message: "Error fetching books by author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  try {
      const selected_title = [];
      for (const [key, values] of Object.entries(books)) {
          if (values.title === title) {
              selected_title.push(values);
          }
      }
      if (selected_title.length > 0) {
          res.send(selected_title);
      } else {
          res.status(404).json({message: "Title not found"});
      }
  } catch (error) {
      res.status(500).json({message: "Error fetching books by title"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
