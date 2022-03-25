const express = require("express");
const { createServer } = require("https");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

let env = process.env.NODE_ENV || "production"

if (env == "development") {
    var fs = require("fs");
    var options = {
        key: fs.readFileSync(__dirname + "/localhost-key.pem", "utf-8"),
        cert: fs.readFileSync(__dirname + "/localhost.pem", "utf-8")
    }

    var app = express();
    var httpServer = createServer(options, app);
} else {
    var app = express();
    var httpServer = createServer(app);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const db = require("./app/models");

db.mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log("Successfully connected to MongoDB.");
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

app.get("/", (req, res) => {
    res.json({ message: "Agri App Backend." });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/field.routes")(app);
require("./app/routes/stock.routes")(app);
require("./app/routes/sale.routes")(app);
require("./app/routes/cost.routes")(app);
require("./app/routes/usage.routes")(app);

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});