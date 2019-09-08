const express = require("express"),
      router = express.Router({mergeParams: true}),
      Book = require("../models/book"),
      Review = require("../models/review")

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
}); 

 //NEW REVIEW
 router.get("/new", isLoggedIn, (req, res) => {
    ID = req.params.id;
    Book.findById(ID, (err, foundBook) => {
       if(err){
           console.log(err);
       } else {
           res.render("reviews/new", {book: foundBook});
       }
    });
});

//CREATE REVIEW
router.post("/", isLoggedIn, (req, res) => {
   //lookup book using id
   ID = req.params.id;
    Book.findById(ID, (err, book) => {
       if(err){
           console.log(err);
           res.redirect("/books");
       } else {
           Review.create(req.body.review, (err, review) => {
               if(err) {
                   console.log(err);
               } else {
                   //add username and id to review
                   review.author.id = req.user._id;
                   review.author.username = req.user.username;
                   //save comment
                   review.save();
                   book.reviews.push(review);
                   book.save();
                   res.redirect("/books/" + req.params.id);
               }
           })
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