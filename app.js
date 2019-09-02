const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      PORT = 9000;

app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("landing");
});

app.get("/books", (req, res) => {
     var books = [
         {title: "Sapiens: A Brief History of Humankind", image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1420585954l/23692271.jpg"},
         {title: "Homo Deus: A History of Tomorrow", image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1468760805l/31138556._SY475_.jpg"}
     ]
    res.render("books", {books: books});
});

app.listen(PORT, () => {
    console.log("Server is running localhost:" + PORT );
});

