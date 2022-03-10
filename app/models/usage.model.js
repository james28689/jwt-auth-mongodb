const mongoose = require("mongoose");

const Usage = mongoose.model(
    "Usage",
    new mongoose.Schema({
        date: Date,
        amount: Number,
        stock: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Stock"
        },
        field: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Field"
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    })
);

module.exports = Usage;