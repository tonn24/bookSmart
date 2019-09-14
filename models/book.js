const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    info: String,
    image: String,
    myUser: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
    },
    reviews: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Review"
        }
     ]
});

module.exports = mongoose.model("Book", bookSchema)