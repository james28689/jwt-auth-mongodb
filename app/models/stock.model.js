const mongoose = require("mongoose");

const Stock = mongoose.model(
    "Stock",
    new mongoose.Schema({
        name: String,
        type: String,
        units: String,
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