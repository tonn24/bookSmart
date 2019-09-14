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
      methodOverride = require("method-override"),
      flash = require("connect-flash");

const bookRoutes = require("./routes/books"),
      reviewRoutes = require("./routes/reviews"),
      indexRoutes = require("./routes/index")

mongoose.connect("mongodb://localhost/bookSmart", { useNewUrlParser: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

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

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
}); 

//REQUIRING ROUTES
app.use("/", indexRoutes);
app.use("/books", bookRoutes);
app.use("/books/:id/reviews", reviewRoutes);



app.listen(PORT, () => {
    console.log("Server is running localhost:" + PORT );
});