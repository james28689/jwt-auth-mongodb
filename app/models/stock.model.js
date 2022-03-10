const mongoose = require("mongoose");

const Stock = mongoose.model(
    "Stock",
    new mongoose.Schema({
        name: String,
        type: String,
        units: String,
        amount: Number,
        used: Number,
        orders: [
            {
                date: Date,
                amount: Number,
                pricePerUnit: Number
            }
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    })
)

module.exports = Stock;