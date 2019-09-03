const express = require("express"),
      app = express(),
      bodyParser = require("body-parser"),
      PORT = 9000;

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var books = [
    {title: "Sapiens: A Brief History of Humankind", image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1420585954l/23692271.jpg"},
    {title: "Homo Deus: A History of Tomorrow", image: "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1468760805l/31138556._SY475_.jpg"}
]

app.get("/", (req, res) => {
    res.render("landing");
});


app.get("/books", (req, res) => {
    res.render("books", {books: books});
});

app.post("/books", (req, res) => {
    const title = req.body.title;
    const image = req.body.image;
    const newBook = {title: title, image: image};
    books.push(newBook);
    res.redirect("/books");
});

app.get("/books/new", (req, res) => {
    res.render("new.ejs");
});

app.listen(PORT, () => {
    console.log("Server is running localhost:" + PORT );
});

