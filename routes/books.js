const express = require("express");
      router = express(),
      Book = require("../models/book")

//INDEX
router.get("/", (req, res) => {
    Book.find({}, (err, books) => {
        if(err){
            console.log(err);
        } else {
            res.render("books/books", {books: books, currentUser: req.user});
        }
    })
});

//CREATE ROUTE
router.post("/", isLoggedIn, (req, res) => {
    const title = req.body.title;
    const image = req.body.image;
    const author = req.body.author;
    const info = req.body.info;
    const myUser = {
        id: req.user._id,
        username: req.user.username
    };
    const newBook = {title: title, image: image, myUser: myUser, info: info};
    Book.create(newBook, (err, newlyAddedBook) => {
        if(err) {
            console.log(err);
        } else {
            console.log(newlyAddedBook);
            res.redirect("/books")
        }
    });
});

//NEW ROUTE
router.get("/new", isLoggedIn, (req, res) => {
    res.render("books/new");
});

 //SHOW ROUTE
 router.get("/:id", (req, res) => {
    //find the book with provided id
    let bookID = req.params.id
    Book.findById(bookID).populate("reviews").exec(function(err, foundBook){
        if(err){
            console.log(err);
        } else {
            res.render("books/show", {book: foundBook});
        }
    });
 });

 //middleware
 function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
};

 module.exports = router;
