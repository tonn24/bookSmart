const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      PORT = 9000,
      mongoose = require("mongoose"),
      Book = require("./models/book"),
      Review = require("./models/review"),
      seedDB = require("./seeds"),
      passport = require("passport"),
      session = require("express-session"),
      localStrategy = require("passport-local"),
      User = require("./models/user")

const bookRoutes = require("./routes/books"),
      reviewRoutes = require("./routes/reviews"),
      indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/bookSmart", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Lebron James is the greatest basketball player",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//REQUIRING ROUTES
app.use("/", indexRoutes);
app.use("/books", bookRoutes);
app.use("/books/:id/reviews", reviewRoutes);

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
}); 

app.listen(PORT, () => {
    console.log("Server is running localhost:" + PORT );
});