const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');


class BaseController {
    constructor(req) {
        this._req = req;
        this._tableName = req.params.tableName;
        this._id = req.params.id;
        this._action = req.params.action;
        this._method = req.method;
        this._body = req.body;
        this._userData = null;
        this._checkAuth();
        this._model = this._findModel();
    }


    _checkAuth() {
        try {
            const token = this._req.headers.auth_token;
            this._userData = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            const error = new Error("A hitelesítés nem sikerült");
            throw Object.assign(error, {
                originalError: error,
                statusCode: 401
            });
        }
    }

    async read() {
        if (this._id) {
            return await this._getRecord();
        }
        return await this._getAllRecords();
    }

    async _getRecord() {
        const record = await this._model.findById(this._id)
            .exec();
        return {
            response: {
                data: record,
            }
        };
    }

    async _getAllRecords() {
        const records = await this._model.find()
            .exec();
        return {
            response: {
                count: records.length,
                data: records,
            }
        };
    }

    async create() {
        await this._beforeCreate();

        const id = new mongoose.Types.ObjectId();
        const newModel = new this._model(Object.assign(this._body, {
            _id: id,
        }));
        const result = await newModel.save();
        return {
            statusCode: 201,
            response: {
                success: true,
                data: result
            }
        };
    }

    async update() {
        const id = this._id;
        if (!id) {
            throw new Error('Id nincs definiálva');
        }
        const updateOps = {};
        for (let [ key, value ] of Object.entries(this._body)) {
            updateOps[key] = value;
        }
        const result = await this._model.update({ _id: id }, { $set: updateOps })
            .exec();
        return {
            response: {
                success: true,
            }
        };
    }

    async delete() {
        if (!this._id) {
            throw new Error('Id nincs definiálva');
        }
        const result = await this._model.remove({ _id: this._id })
            .exec();
        return {
            response: {
                success: true,
            }
        };
    }

    _beforeCreate() {
    }

    _findModel() {
        const modelName = this._tableName.toLowerCase();
        try {
            return require(`../models/${modelName}`);
        } catch (err) {
            console.error(err);
            throw new Error(`Model nem létezik: ${modelName}`);
        }
    }

    newError(message, parameters = {}) {
        const error = new Error(message);
        return Object.assign(error, parameters);
    }
}

module.exports = BaseController;
