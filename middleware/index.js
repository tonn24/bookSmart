//ALL THE MIDDLEWARE
const middlewareObj = {},
      Review = require("../models/review")

/* middlewareObj.checkBookOwnership = function(req, res, next){
    Book.findById(req.params.id, function(err, foundBook){
      if(err || !foundBook){ 
        req.flash("error", "Book not found!")
        console.log(err);
        res.redirect('/book');
      } else if(foundBook.myUser.id.equals(req.user._id) || req.user.isAdmin){
          req.book = foundBook;
          next();
      } else {
          res.redirect('/books/' + req.params.id);
      }
    });
} */

middlewareObj.checkBookOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
           Book.findById(req.params.id, function(err, book){
              if(err){
                  req.flash("error", "Book not found");
                  res.redirect("back");
              }  else {
    
               // Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
               if (!book) {
                       req.flash("error", "Item not found.");
                       return res.redirect("back");
                   }
               // If the upper condition is true this will break out of the middleware and prevent the code below to crash our application
    
               if(book.myUser.id.equals(req.user._id)) {
                   next();
               } else {
                   req.flash("error", "You don't have permission to do that");
                   res.redirect("back");
               }
              }
           });
       } else {
           req.flash("error", "You need to be logged in to do that");
           res.redirect("back");
       }
   }

middlewareObj.checkUserReview = function(req, res, next){
    Review.findById(req.params.review_id, function(err, foundReview){
       if(err || !foundReview){
           console.log(err);
           req.flash('error', 'Sorry, that review does not exist!');
           res.redirect('/books');
       } else if(foundReview.myUser.id.equals(req.user._id) || req.user.isAdmin){
            req.review = foundReview;
            next();
       } else {
           req.flash("error", "You don't have permission to do that!");
           res.redirect('/books/' + req.params.id);
       }
    });
  }



middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login")
};

module.exports = middlewareObj