const mongoose = require('mongoose');

class TableController {

    constructor(req) {
        this._method = req.method;
        this._tableName = req.params.tableName;
        this._id = req.params.id;
        this._model = null;
        this._body = req.body;
        this._userData = req.userData;
    }

    async processRequires() {
        this._model = this._findModel();

        switch (this._method) {
            case "GET" :
                return await this.read();
            case "POST" :
                return await this.create();
            case "PUT" :
                return await this.update();
            case "DELETE" :
                return await this.delete();
            default:
                throw new Error(`Nem támogatott method: ${this._method}`)
        }
    }

    read() {
        if (this._id) {
            return this._model.findById(this._id)
                .exec()
                .then(record => {
                    return {
                        response: {
                            data: record,
                        }
                    };
                });
        }
        return this._model.find()
            .exec()
            .then(records => {
                return {
                    response: {
                        count: records.length,
                        data: records,
                    }
                };
            });
    }

    create() {
        this._beforeCreate();

        const id = new mongoose.Types.ObjectId();
        const newModel = new this._model(Object.assign(this._body, {
            _id: id,
        }));
        return newModel.save()
            .then(result => {
                return {
                    statusCode: 201,
                    response: {
                        success: true,
                        data: result
                    }
                };
            })
            .catch(err => {
                throw err;
            });
    }

    update() {
        const id = this._id;
        if (!id) {
            throw new Error('Id nincs definiálva');
        }
        const updateOps = {};
        for (let [key, value] of Object.entries(this._body)) {
            updateOps[key] = value;
        }
        return this._model.update({ _id: id }, { $set: updateOps })
            .exec()
            .then(result => {
                return {
                    response: {
                        success: true,
                    }
                };
            })
            .catch(err => {
                throw err;
            });
    }

    delete() {
        if (!this._id) {
            throw new Error('Id nincs definiálva');
        }
        return this._model.remove({_id: this._id})
            .exec()
            .then(result => {
                return {
                    response: {
                        success: true,
                    }
                };
            })
            .catch(err => {
                throw err;
            });
    }

    // ezt at lehetne rakni a model-be
    _beforeCreate() {
        const modelName = this._tableName.toLowerCase();
        if (modelName === 'card') {
            this._body.user_id = this._userData.user_id;
        }
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

}

exports.call = async (req, res, next) => {
    try {
        const tableController = new TableController(req);
        const data = await tableController.processRequires();
        const status = (data && data.statusCode) || 200;
        res.status(status).json(data.response);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message,
        });
    }
};