const mongoose = require("mongoose");

const RefreshToken = mongoose.model(
    "RefreshToken",
    new mongoose.Schema({
        userRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        token: String
    })
)

module.exports = RefreshToken;