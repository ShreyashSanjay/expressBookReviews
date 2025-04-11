const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
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
});

// Check if a user with the given username already exists
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

//Promise initalised
let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
        const successMessage = "Book(s) successfully fetched!";
        const errorMessage = "Could not fetch book(s)";
        const isSuccess = true;
        if (isSuccess) {
            resolve(successMessage);
        } else {
            reject(errorMessage);
        }
    },3000)})

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    myPromise.then((successMessage) => {
        console.log('From Callback: ' + successMessage);
        res.status(200).json(books);
    })
    .catch((errorMessage) => {
        console.error('Error: '+ errorMessage);
        res.status(500).send('Unable to fetch books at this time');
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
    const newbook = books[isbn]; // Assuming 'books' is an object with ISBN as keys

    if (newbook) {
        myPromise.then((successMessage) => {
            console.log('From Callback: ' + successMessage);
            res.status(200).json(newbook);
        })
        .catch((errorMessage) => {
            console.error('Error: '+ errorMessage);
            res.status(500).send('Unable to fetch books at this time');
        })   
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author; // Retrieve the author from the request parameters
    const booksByAuthor = [];

    // Iterate through the books object
    for (let index in books) {
        if (books[index].author === author) {
            booksByAuthor.push(books[index]);
        }
    }

    if (booksByAuthor.length > 0) {
        myPromise.then((successMessage) => {
            console.log('From Callback: ' + successMessage);
            res.status(200).json(booksByAuthor);
        })
        .catch((errorMessage) => {
            console.error('Error: '+ errorMessage);
            res.status(500).send('Unable to fetch books at this time');
        })
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title; // Retrieve the title from the request parameters
    const booksByTitle = [];

    // Iterate through the books object
    for (let isbn in books) {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    }

    if (booksByTitle.length > 0) {
        myPromise.then((successMessage) => {
            console.log('From Callback: ' + successMessage);
            res.status(200).json(booksByTitle);
        })
        .catch((errorMessage) => {
            console.error('Error: '+ errorMessage);
            res.status(500).send('Unable to fetch books at this time');
        })
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Retrieve the ISBN from the request parameters
    const review = books[isbn]; // Assuming 'books' is an object with ISBN as keys

    if (review) {
        return res.status(200).json(review);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
