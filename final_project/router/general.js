const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// TASK 10 - Get the book list available in the shop using promises
public_users.get('/async-get-books',function (req, res) {

    const get_books = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 4)));
      });

      get_books.then(() => console.log("Promise for Task 10 resolved"));

  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  res.send(books[isbn])
 });

//TASK 11 - get the book details based on ISBN
public_users.get('/async-get-books/:isbn',function (req, res) {
    const get_books_isbn = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    // console.log(isbn);
        if (req.params.isbn <= 10) {
        resolve(res.send(books[isbn]));
    }
        else {
            reject(res.send('ISBN not found'));
        }
    });
    get_books_isbn.
        then(function(){
            console.log("Promise for Task 11 is resolved");
   }).
        catch(function () { 
                console.log('ISBN not found');
  });

});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author
  const matchingBooks = [];

  // Iterate through the keys (book IDs) in the 'books' object
  for (const isbn in books) {
    if (books.hasOwnProperty(isbn)) {
      const book = books[isbn];
      
      // Check if the author of the book matches the author from the request parameters
      if (book.author === author) {
        matchingBooks.push({ isbn, ...book });
      }
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json({ books: matchingBooks });
  } else {
    return res.status(404).json({ message: "No books found for the provided author." });
  }
});
// TASK 12
public_users.get('/async-get-books/author/:author', function (req, res) {
    const author = req.params.author;
  
    if (!author) {
      return res.status(400).json({ message: 'Author parameter is missing' });
    }
  
    const getBooksByAuthor = new Promise((resolve, reject) => {
      // Filter the books to find those by the specified author
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
  
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject('Author not found');
      }
    });
  
    getBooksByAuthor
        .then(function (books){
        console.log("Promise for Task 12 is resolved");
        res.json(books);
      })
      .catch(function () {
        console.log('Author not found');
      });
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    const matchingBooks = [];
  
    // Iterate through the keys (book IDs) in the 'books' object
    for (const isbn in books) {
      if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
        
        // Check if the author of the book matches the author from the request parameters
        if (book.title === title) {
          matchingBooks.push({ isbn, ...book });
        }
      }
    }
  
    if (matchingBooks.length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "No books found for the provided title." });
    }
});

// TASK 13
public_users.get('/async-get-books/title/:title', function (req, res) {
    const title = req.params.title;
  
    if (!title) {
      return res.status(400).json({ message: 'Title parameter is missing' });
    }
  
    const getBooksByTitle = new Promise((resolve, reject) => {
      // Filter the books to find those by the specified title
      const booksByTitle = Object.values(books).filter(book => book.title === title);
  
      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject('Title not found');
      }
    });
  
    getBooksByTitle
      .then(function (books) {
        console.log("Promise for Task 13 is resolved");
        res.json(books);
      })
      .catch(function () {
        console.log('Title not found');
        res.status(404).json({ message: 'Title not found' });
      });
  });
  

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]["reviews"])
  });
  

module.exports.general = public_users;

