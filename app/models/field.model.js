const mongoose = require("mongoose");

const Field = mongoose.model(
    "Field",
    new mongoose.Schema({
        name: String,
        rpa_field_id: String,
        crop: String,
        geometry: mongoose.Schema.Types.Mixed,
        area_ha: Number,
        costs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Cost"
            }
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }        
    })
)

module.exports = Field;