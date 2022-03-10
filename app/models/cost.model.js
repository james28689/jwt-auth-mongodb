const mongoose = require("mongoose");

const Cost = mongoose.model(
    "Cost",
    new mongoose.Schema({
        date: Date,
        title: String,
        detail: String,
        amount: Number,
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

module.exports = Cost;0