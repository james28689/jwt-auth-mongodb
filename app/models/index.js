const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require("./user.model");
db.field = require("./field.model")
db.refreshToken = require("./refresh-token.model")

module.exports = db;