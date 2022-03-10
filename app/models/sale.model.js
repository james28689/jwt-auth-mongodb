const mongoose = require("mongoose");

const Sale = mongoose.model(
    "Sale",
    new mongoose.Schema({
        date: Date,
        crop: String,
        amount: Number,
        price: Number,
        field: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Field"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    })
)

module.exports = Sale;