const db = require("../models");
const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
require("dotenv").config();

var generator = require("./generateRefreshToken");

exports.signup = (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8)
    });

    user.save((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }

        if (req.body.roles) {
            Role.find(
                {
                    name: { $in: req.body.roles }
                },
                (err, roles) => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    user.roles = roles.map(role => role._id);
                    user.save(err => {
                        if (err) {
                            res.status(500).send({ message: err });
                            return;
                        }

                        res.send({ message: "User successfully registered" })
                    });
                }
            );
        } else {
            Role.findOne({ name: "user" }, (err, role) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                user.roles = [role._id];
                user.save(err => {
                    if (err) {
                        res.status(500).send({ message: err });
                        return;
                    }

                    res.send({ message: "User successfully registered" })
                });
            });
        }
    });
};

exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
    .populate("roles", "-__v")
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

        let authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
            authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
        }

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
    
                res.setHeader("Set-Cookie", `refreshToken=${refreshToken.token}; HttpOnly`);

                res.status(200).send({
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    roles: authorities,
                    accessToken: token,
                    tokenExpiry: 900,
                });
            })
        })
    });
};

exports.refreshAccessToken = (req, res) => {
    RefreshToken.findOneAndDelete({
        token: req.cookies.refreshToken
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

            res.setHeader("Set-Cookie", `refreshToken=${newToken.token}; HttpOnly`);
            res.status(200).send({
                accessToken: token,
                tokenExpiry: 900
            })
        })
    })
}