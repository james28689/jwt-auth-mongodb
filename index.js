const express = require("express");
const { createServer } = require("http");
// const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");

require("dotenv").config();


const app = express();
const httpServer = createServer(app);
// const io = new Server(httpServer, {
//     cors: {
//         origin: process.env.SOCKET_CORS_ADDRESS,
//         methods: ["GET", "POST"]
//     }
// });

// io.use((socket, next) => {
//     if (socket.handshake.headers.token) {
//         jwt.verify(socket.handshake.headers.token, process.env.JWT_SECRET, (err, decoded) => {
//             if (err) {
//                 next(new Error("Unauthorised!"));
//             }
            
//             socket.decoded = decoded;
//             next();
    
//         })
//     } else {
//         next(new Error("No token provided."));
//     }
// })

const corsOptions = {
    origin: process.env.SOCKET_CORS_ADDRESS
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const db = require("./app/models");
// const { verifySocketToken } = require("./app/middleware/authJwt");
const Role = db.role;

db.mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => {
        console.log("Successfully connected to MongoDB.");
        initial();
    })
    .catch(err => {
        console.error("Connection error", err);
        process.exit();
    });

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("Added 'user' to roles collection.")
            });

            new Role({
                name: "moderator"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("Added 'moderator' to roles collection.")
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("Added 'admin' to roles collection.")
            });
        }
    })
}

app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application." });
});

// io.on("connection", async (socket) => {
//     console.log(`Connection established with socket ID ${socket.id}.`)
//     console.log(socket.decoded)
//     const sockets = await io.fetchSockets()
//     console.log(sockets[0].handshake.headers)

//     socket.emit("test", "testing text");

//     socket.on("fetch", (token) => {
        
//     })
// })

require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});