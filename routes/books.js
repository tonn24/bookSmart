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

 //EDIT BOOK ROUTE
router.get("/:id/edit", checkBookOwnership,(req, res) => {
    Book.findById(req.params.id, (err, book) => {
        res.render("books/edit", {book: book});
    }); 
});

 //UPDATE BOOK ROUTE
router.put("/:id", checkBookOwnership, (req, res) => {
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
router.delete("/:id", checkBookOwnership, (req, res) => {
    Book.findByIdAndRemove(req.params.id, (err) => {
        if(err){
            res.redirect("/books");
        } else {
            res.redirect("/books");
        }
    })
});

 //middleware
 function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
};

function checkBookOwnership(req, res, next){
    Book.findById(req.params.id, function(err, foundBook){
      if(err || !foundBook){
          console.log(err);
          res.redirect('/book');
      } else if(foundBook.myUser.id.equals(req.user._id) || req.user.isAdmin){
          req.book = foundBook;
          next();
      } else {
          res.redirect('/books/' + req.params.id);
      }
    });
  }

function checkUserComment(req, res, next){
    Review.findById(req.params.reviewId, function(err, foundReview){
       if(err || !foundReview){
           console.log(err);
           req.flash('error', 'Sorry, that comment does not exist!');
           res.redirect('/books');
       } else if(foundReview.myUser.id.equals(req.user._id) || req.user.isAdmin){
            req.review = foundReview;
            next();
       } else {
           req.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/campgrounds/' + req.params.id);
       }
    });
  }

function isAdmin(req, res, next) {
    if(req.user.isAdmin) {
      next();
    } else {
      req.flash('error', 'This site is now read only thanks to spam and trolls.');
      res.redirect('back');
    }
  }

 module.exports = router;
