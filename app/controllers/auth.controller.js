const db = require("../models");
const User = db.user;
const RefreshToken = db.refreshToken;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
require("dotenv").config();

var generator = require("./generateRefreshToken");

// exports.signup = (req, res) => {
//     const user = new User({
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         email: req.body.email,
//         password: bcrypt.hashSync(req.body.password, 8),
//         mustOnboard: true
//     });

//     user.save((err) => {
//         if (err) {
//             res.status(500).send({ message: err });
//             return;
//         }

//         res.status(200).send("User successfully created.")
//     });
// };

exports.signup = async (req, res) => {
    const user = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        mustOnboard: true
    });

    await user.save().catch((err) => {
        res.status(500).send({ message: err });
        return;
    });

    return res.status(201).send("User created.")
}

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        let passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid password."
            });
        }

        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: 900 // 15 minutes
        });

        RefreshToken.deleteMany({
            userRef: user._id
        }, () => {
            const newRefreshToken = new RefreshToken({
                userRef: user._id,
                token: generator.genRefreshToken()
            })
    
            newRefreshToken.save((err, refreshToken) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                res.status(200).send({
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    mustOnboard: user.mustOnboard,
                    refreshToken: refreshToken.token,
                    accessToken: token,
                    tokenExpiry: 900,
                });
            })
        })
    });
};

exports.refreshAccessToken = (req, res) => {
    RefreshToken.findOneAndDelete({
        token: req.body.refreshToken
    }, (err, token) => {
        if (err) {
            res.status(401).send("No refresh token provided.")
            return;
        }

        const newRefreshToken = new RefreshToken({
            userRef: token.userRef,
            token: generator.genRefreshToken()
        })

        newRefreshToken.save((err, newToken) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            let token = jwt.sign({ id: newToken.userRef.toString() }, process.env.JWT_SECRET, {
                expiresIn: 900 // 24 hours
            });

            res.status(200).send({
                refreshToken: newToken.token,
                accessToken: token,
                tokenExpiry: 900
            })
        })
    })
}