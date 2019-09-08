const express = require("express");
      router = express(),
      passport = require("passport"),
      User = require("../models/user")

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
}); 

router.get("/", (req, res) => {
    res.render("landing");
});

 //AUTHENTICATION ROUTES
router.get("/register", (req, res) => {
    res.render("register");
 });

 //handle sign up logic
 router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/books");
        })
    });
 });

 //show login form
router.get("/login", (req, res) => {
    res.render("login");
 });

//handling login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/books",
        failureRedirect: "/login"
    }), (req, res) => {
});

//add logout route
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/")
});



module.exports = router;
