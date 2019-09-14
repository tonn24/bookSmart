const mongoose = require("mongoose");
const Book = require("./models/book");
const Review = require("./models/review");

let data = [
    {
        title: "Homo Deus: A History of Tomorrow",
        author: "Yuval Noah Harari",
        info:  "Homo Deus: A Brief History of Tomorrow (Hebrew: ההיסטוריה של המחר) is a book written by Israeli author Yuval Noah Harari, professor at the Hebrew University in Jerusalem. The book was first published in Hebrew in 2015 by Dvir publishing; the English-language version was published in September 2016 in the United Kingdom and in February 2017 in the United States. /n As with its predecessor, Sapiens: A Brief History of Humankind, Harari recounts the course of history while describing events and the individual human experience, along with ethical issues in relation to his historical survey. However, Homo Deus deals more with the abilities acquired by humans (Homo sapiens) throughout their existence, and their evolution as the dominant species in the world. The book describes mankind's current abilities and achievements and attempts to paint an image of the future. Many philosophical issues are discussed, such as the human experience, individualism, human emotion, and consciousness.",
        image: "https://upload.wikimedia.org/wikipedia/en/7/73/Homo_Deus.jpg"
    },
    {
        title: "The Pragmatic Programmer: From Journeyman to Master",
        author: "Andrew Hunt, David Thomas",
        info:  "The Pragmatic Programmer: From Journeyman to Master is a book about software engineering by Andrew Hunt and David Thomas, published in October 1999, first in a series of books under the label The Pragmatic Bookshelf. It is an influential book in software engineering,[1] and it is used as a textbook in related university courses.",
        image: "https://upload.wikimedia.org/wikipedia/en/8/8f/The_pragmatic_programmer.jpg"
    },
    {
        title: "Clean Code",
        author: "Robert C. Martin",
        info:  "Noted software expert Robert C. Martin presents a revolutionary paradigm with Clean Code: A Handbook of Agile Software Craftsmanship . Martin has teamed up with his colleagues from Object Mentor to distill their best agile practice of cleaning code “on the fly” into a book that will instill within you the values of a software craftsman and make you a better programmer—but only if you work at it.",
        image: "https://images-na.ssl-images-amazon.com/images/I/515iEcDr1GL._SX385_BO1,204,203,200_.jpg"
    },
    

]

function seedDB(){
    Book.remove({}, (err) => {
         if(err) {
            console.log(err)
        } 
        console.log("removed books"); 
        //Add couple of books
         data.forEach((seed) => {
            Book.create(seed, (err, book) => {
                if(err){
                    console.log(err);
                } else {
                    console.log("added a book");
                    //create a review
                    Review.create(
                        {
                            Author: "Tony",
                            Review: "Awesome book!"
                        }, (err, review) => {
                            if(err){
                                console.log(err)
                            } else {
                               book.reviews.push(review);
                               book.save();
                               console.log("Created new review"); 
                            }
                        }
                    )
                }
            }); 
        });
    });
}



module.exports = seedDB;
