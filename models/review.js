const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    text: String,
    myUser: {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    username: String
    }
});

module.exports = mongoose.model("Review", reviewSchema);