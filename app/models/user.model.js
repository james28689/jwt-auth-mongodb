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
        ],
        stocks: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Stock"
            }
        ],
        sales: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Sale"
            }
        ],
        costs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Cost"
            }
        ],
        usages: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Usage"
            }
        ]
    })
)

module.exports = User;