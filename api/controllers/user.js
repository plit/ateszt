const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');

const BaseController = require('./base');


class UserController extends BaseController {
    _checkAuth() {
        if (this._isCheckAuthDisabled()) {
            return;
        }
        super._checkAuth();
    }

    _isCheckAuthDisabled() {
        // action names
        const checkAuthDisabled = [ 'login', 'signup', 'all' ];
        return this._action && checkAuthDisabled.includes(this._action);
    }

    async login() {
        const user = await this._model.find({ email: this._body.email })
            .exec();
        if (user.length < 1) {
            throw this.newError("A bejelentkezés nem sikerült", {
                statusCode: 401,
            });
        }
        if (user[0].password === this._body.password_hash) {
            const token = jwt.sign({
                    email: user[0].email,
                    user_id: user[0]._id
                },
                (process.env.JWT_KEY || 'asd'),
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
            );
            return {
                response: {
                    message: "A bejelentkezés sikerült (a tokent el kell menteni a header-be 'auth_token'-ként)",
                    token: token,
                    success: true,
                }
            }
        }
        throw this.newError("A bejelentkezés nem sikerült", {
            statusCode: 401,
        })
    }

    async signup() {
        const user = this._model.find({ email: this._body.email })
            .exec();
        if (user.length >= 1) {
            throw this.newError("Az email létezik", {
                statusCode: 409,
            })
        } else {
            const hash = this._body.password_hash;
            const user = new this._model({
                _id: new mongoose.Types.ObjectId(),
                email: this._body.email,
                password: hash
            });
            const result = await user.save();
            return {
                statusCode: 201,
                response: {
                    message: "A felhasználó létrehozva",
                    success: true,
                    data: result,
                }
            };
        }
    }

    async all() {
        return super._getAllRecords();
    }
}

module.exports = UserController;
