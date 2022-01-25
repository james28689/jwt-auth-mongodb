const mongoose = require("mongoose");

const User = mongoose.model(
    "User",
    new mongoose.Schema({
        firstName: String,
        lastName: String,
        email: String,
        password: String,
        mustOnboard: Boolean,
        fields: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Field"
            }
        ]
    })
)

module.exports = User;