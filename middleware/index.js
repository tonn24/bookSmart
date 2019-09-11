//ALL THE MIDDLEWARE
const middlewareObj = {},
      Review = require("../models/review")

middlewareObj.checkBookOwnership = function(req, res, next){
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

middlewareObj.checkUserReview = function(req, res, next){
    Review.findById(req.params.review_id, function(err, foundReview){
       if(err || !foundReview){
           console.log(err);
           //req.flash('error', 'Sorry, that review does not exist!');
           res.redirect('/campgrounds');
       } else if(foundReview.myUser.id.equals(req.user._id) || req.user.isAdmin){
            req.review = foundReview;
            next();
       } else {
           r//eq.flash('error', 'You don\'t have permission to do that!');
           res.redirect('/books/' + req.params.id);
       }
    });
  }



middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
};

module.exports = middlewareObj