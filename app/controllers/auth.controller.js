const db = require("../models");
const User = db.user;
const RefreshToken = db.refreshToken;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
require("dotenv").config();

var generator = require("./generateRefreshToken");

exports.signup = async (req, res) => {
    if (req.body.firstName && req.body.lastName && req.body.email && req.body.password) {
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
    
        return res.status(201).send("User created.");
    } else {
        return res.status(500).send({ message: "Data missing in request." })
    }
}

exports.signin = (req, res) => {
    if (req.body.email && req.body.password) {
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
    } else {
        return res.status(500).send({ message: "Email or password not provided." })
    }
};

exports.refreshAccessToken = (req, res) => {
    if (req.body.refreshToken) {
        RefreshToken.findOneAndDelete({
            token: req.body.refreshToken
        }, (err, deletedToken) => {
            if (err) {
                res.status(401).send({ message: "Unknown error" })
                return;
            }
    
            if (!deletedToken) {
                return res.status(500).send({ message: "Refresh token not recognised." })
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
    
                res.status(500).send({ message: "Refresh token not found"});
                return;
            });
        });
    } else {
        return res.status(500).send({ message: "No refresh token given."});
    }
}

exports.changeEmail = (req, res) => {
    User.find({ email: req.body.email }, (err, users) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        if (users.length) {
            return res.status(500).send({ message: "Email in use." });
        } else {
            User.findByIdAndUpdate(req.userID, { email: req.body.email }, { upsert: false }, (err, doc, mongoRes) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
        
                console.log(doc, mongoRes);
                return res.status(200).send({ message: "Email successfully updated." });
            });
        }
    })
}

exports.changePassword = (req, res) => {
    User.findByIdAndUpdate(req.userID, { password: bcrypt.hashSync(req.body.password, 8) }, { upsert: false }, (err, doc, mongoRes) => {
        if (err) {
            res.status(500).send({ message: err });
        }

        console.log(doc, mongoRes);
        return res.status(200).send({ message: "Password successfully updated" });
    })
}

exports.changeOnboard = (req, res) => {
    User.findByIdAndUpdate(req.userID, { mustOnboard: req.body.mustOnboard }, { upsert: false }, (err, doc, mongoRes) => {
        if (err) {
            return res.status(500).send({ message: err });
        }

        console.log(doc, mongoRes);
        return res.status(200).send({ message: "User marked on-board." });
    })
}

exports.getUserData = (req, res) => {
    User.findById(req.userID, (err, user) => {
        if (err) {
            res.status(500).send({ message: err });
        }

        let userToSend = {...user["_doc"]}

        delete userToSend.password;
        delete userToSend.fields;
        delete userToSend.stocks;
        delete userToSend.sales;
        delete userToSend.costs;
        delete userToSend.usages;

        res.status(200).send(userToSend);
    })
}

exports.deleteUserData = async (req, res) => {
    User.findByIdAndDelete(req.userID).catch(err => {
        return res.status(500).send({message: err});
    });

    return res.status(201).send({ message: "User data deleted." });
}