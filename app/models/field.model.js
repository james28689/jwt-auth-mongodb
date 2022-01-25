const mongoose = require("mongoose");

const Field = mongoose.model(
    "Field",
    new mongoose.Schema({
        name: String,
        rpa_field_id: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        geometry: mongoose.Schema.Types.Mixed,
    })
)

module.exports = Field;