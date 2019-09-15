const express = require("express");
      router = express(),
      Book = require("../models/book"),
      middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, (req, res) => {
    const title = req.body.title;
    const image = req.body.image;
    const author = req.body.author;
    const info = req.body.info;
    const myUser = {
        id: req.user._id,
        username: req.user.username
    };
    const newBook = {title: title, image: image, myUser: myUser, info: info, author: author};
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
router.get("/new", middleware.isLoggedIn, (req, res) => {
    
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

 //EDIT BOOK ROUTE
router.get("/:id/edit", middleware.checkBookOwnership,(req, res) => {
    Book.findById(req.params.id, (err, book) => {
        res.render("books/edit", {book: book});
    }); 
});

 //UPDATE BOOK ROUTE
router.put("/:id", middleware.checkBookOwnership, (req, res) => {
    //find and update the the correct book
    Book.findByIdAndUpdate(req.params.id, req.body.book, (err, updatedBook) => {
        if(err){
            res.redirect("/books");
        } else { 
            res.redirect("/books/" + req.params.id);
        }
    });
});

//DESTROY ROUTE
router.delete("/:id", middleware.checkBookOwnership, (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/books");
        } else {
            res.redirect("/books");
        }
    })
});

 module.exports = router;
