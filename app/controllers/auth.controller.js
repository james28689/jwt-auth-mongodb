const db = require("../models");
const User = db.user;
const RefreshToken = db.refreshToken;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
require("dotenv").config();

var generator = require("./generateRefreshToken");

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
    console.log("Sign in request", req.body.email, req.body.password)
    User.findOne({
        email: req.body.email
    })
    .exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (!user) {
            return res.status(200).send({ message: "User not found." });
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
    }, (err, deletedToken) => {
        if (err) {
            res.status(401).send("No refresh token provided.")
            return;
        }

        const newRefreshToken = new RefreshToken({
            userRef: deletedToken.userRef,
            token: generator.genRefreshToken()
        });

        newRefreshToken.save((err, newToken) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }

            if (newToken) {
                let token = jwt.sign({ id: newToken.userRef.toString() }, process.env.JWT_SECRET, {
                    expiresIn: 900 // 24 hours
                });
    
                res.status(200).send({
                    refreshToken: newToken.token,
                    accessToken: token,
                    tokenExpiry: 900
                });

                return;
            }

            res.status(500).send("Refresh token not found")
            return;
        })
    })
}

exports.changeEmail = (req, res) => {
    User.findByIdAndUpdate(req.userID, { email: req.body.email }, { upsert: false }, (err, doc, mongoRes) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        console.log(doc, mongoRes);
        res.status(200).send("Email successfully updated");
        return;
    })
}

exports.changePassword = (req, res) => {
    User.findByIdAndUpdate(req.userID, { password: bcrypt.hashSync(req.body.password, 8) }, { upsert: false }, (err, doc, mongoRes) => {
        if (err) {
            res.status(500).send({ message: err });
        }

        console.log(doc, mongoRes);
        res.status(200).send("Password successfully updated");
        return;
    })
}

exports.changeOnboard = (req, res) => {
    User.findByIdAndUpdate(req.userID, { mustOnboard: req.body.mustOnboard }, { upsert: false }, (err, doc, mongoRes) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        console.log(doc, mongoRes);
        res.status(200).send("User marked onboard");
        return;
    })
}

exports.getUserData = (req, res) => {
    User.findById(req.userID, (err, user) => {
        if (err) {
            res.status(500).send({ message: err });
        }

        delete user.password;

        console.log(user);
        res.status(200).send(user);
    })
}

exports.deleteUserData = async (req, res) => {
    User.findByIdAndDelete(req.userID).catch(err => {
        return res.status(500).send({message: err});
    });

    return res.status(201).send("Costs deleted.");
}