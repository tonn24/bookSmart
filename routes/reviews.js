const express = require("express"),
      router = express.Router({mergeParams: true}),
      Book = require("../models/book"),
      Review = require("../models/review"),
      middleware = require("../middleware");

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
}); 

 //NEW REVIEW
 router.get("/new", middleware.isLoggedIn, (req, res) => {
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
router.post("/", middleware.isLoggedIn, (req, res) => {
   //lookup book using id
   ID = req.params.id;
    Book.findById(ID, (err, book) => {
       if(err){
           console.log(err);
           req.flash("error", "Something went wrong!");
           res.redirect("/books");
       } else {
           Review.create(req.body.review, (err, review) => {
               if(err) {
                   console.log(err);
               } else {
                   //add username and id to review
                   review.myUser.id = req.user._id;
                   review.myUser.username = req.user.username;
                   //save review
                   review.save();
                   book.reviews.push(review);
                   book.save();
                   req.flash("success", "You created a new review");
                   res.redirect("/books/" + req.params.id);
               }
           })
       }
    });
});

//REVIEW EDIT
router.get("/:review_id/edit", middleware.checkUserReview, (req, res) => {
    Review.findById(req.params.review_id, function(err, review){
        if(err){
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Successfully edited review");
            res.render("reviews/edit", {book_id: req.params.id, review: review});
        }
     });
  });

//UPDATE ROUTE
router.put("/:review_id", middleware.checkBookOwnership, (req, res) => {
    Review.findByIdAndUpdate(req.params.review_id, req.body.review, (err, review) => {
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/books/" + req.params.id);
        }
    })
});

//DELETE ROUTE
   router.delete("/:review_id/", middleware.checkUserReview, (req, res) => {
    Review.findByIdAndRemove(req.params.review_id, function(err){
        if(err) {
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted review");
            res.redirect("/books/" + req.params.id );
        }
    });
});   



module.exports = router;