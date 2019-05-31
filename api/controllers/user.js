const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const User = require("../models/user");


exports.all = (req, res, next) => {
    User.find()
        .select("email password _id")
        .exec()
        .then(user => {
            res.status(200).json({
                users: user,
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

exports.signup = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Az email létezik"
                });
            } else {
                const hash = req.body.password_hash;
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: hash
                });
                user.save()
                    .then(result => {
                        res.status(201).json({
                            message: "A felhasználó létrehozva"
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
            }
        });
};

exports.login = (req, res, next) => {
    User.find({email: req.body.email})
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "A bejelentkezés nem sikerült"
                });
            }
            if (user[0].password === req.body.password_hash) {
                const token = jwt.sign({
                        email: user[0].email,
                        user_id: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {expiresIn: "1h"}
                );
                return res.status(200).json({
                    message: "A bejelentkezés sikerült (a tokent el kell menteni a header-be 'auth_token'-ként)",
                    token: token
                });
            }
            res.status(401).json({
                message: "A bejelentkezés nem sikerült"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};

exports.delete = (req, res, next) => {
    User.remove({_id: req.params.userId})
        .exec()
        .then(result => {
            res.status(200).json({
                message: "A felhasználó törölve lett"
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
};


