const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { use } = require('../../../nodejs_PracticeProject_AuthUserMgmt/router/friends.js');
const regd_users = express.Router();

let users = [];
const isValidName = function (name) {
  const regexName = /^[a-zA-Z ]+$/;
  return regexName.test(name);
};
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
if (!username) {
  return res.status(400).send({ status: false, message: "name is required" })
}
if (!isValidName(username) || !isValid(username)) {
  return res.status(400).send({ status: false, message: "Please enter valid name" })
}
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

regd_users.use("/customer", function auth(req,res,next){
  if(req.session.authorization) {
      token = req.session.authorization['accessToken'];
      jwt.verify(token, "access",(err,user)=>{
          if(!err){
              req.user = user;
              next();
          }
          else{
              return res.status(403).json({message: "User not authenticated"})
          }
       });
   } else {
       return res.status(403).json({message: "User not logged in"})
   }
});

//only registered users can login
regd_users.post('/login', (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let review = req.body;
  let isbn = req.params.isbn;
  if (isbn) { //Check is user exists
      let isbn = req.body.isbn;
      let username = req.body.username;

      //if user the  has been changed, update the 
      if(username) {
          users["review"] = review
      users[username]=isbn;
      res.send(`user with the username  ${username} updated.`);
  }
  else{
      res.send("Unable to find friend!");
  }
}
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
 
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
