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
                   review.myUser.id = req.user._id;
                   review.myUser.username = req.user.username;
                   //save review
                   review.save();
                   book.reviews.push(review);
                   book.save();
                   res.redirect("/books/" + req.params.id);
               }
           })
       }
    });
});

//REVIEW EDIT
router.get("/:review_id/edit", (req, res) => {
    Review.findById(req.params.review_id, function(err, review){
        if(err){
            res.redirect("back");
        } else {
            res.render("reviews/edit", {book_id: req.params.id, review: review});
        }
     });
  });

//UPDATE ROUTE
router.put("/:review_id", (req, res) => {
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
/* router.delete("/:review_id",  function(req, res){
    // find book, remove review from reviews array, delete review in db
    Book.findByIdAndUpdate(req.params.id, {
      $pull: {
        reviews: req.review.id
      }
    }, function(err) {
      if(err){ 
          console.log(err)
          //req.flash('error', err.message);
          res.redirect('/');
      } else {
          req.review.remove(function(err) {
            if(err) {
              req.flash('error', err.message);
              return res.redirect('/');
            }
            //req.flash('error', 'review deleted!');
            res.redirect("/books/" + req.params.id);
          });
      }
    });
  }); */
   router.delete("/:review_id/", (req, res) => {
    Review.findByIdAndRemove(req.params.review_id, function(err){
        if(err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/books/" + req.params.id );
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