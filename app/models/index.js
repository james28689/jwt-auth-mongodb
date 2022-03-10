const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;
db.user = require("./user.model");
db.field = require("./field.model");
db.stock = require("./stock.model");
db.sale = require("./sale.model");
db.cost = require("./cost.model");
db.usage = require("./usage.model");
db.refreshToken = require("./refresh-token.model");

module.exports = db;