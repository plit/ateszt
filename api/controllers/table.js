const mongoose = require('mongoose');

class TableController {

    constructor(req) {
        this._req = req;
        this._method = req.method;
        this._action = req.params.action;
        this._tableName = req.params.tableName;
    }

    async processRequires() {
        const Controller = this._getController();
        const controller = new Controller(this._req);

        if (this._action && controller[this._action]) {
            return await controller[this._action]();
        }

        return await this._callCRUD(controller);
    }

    async _callCRUD(controller) {
        switch (this._method) {
            case "GET" :
                return await controller.read();
            case "POST" :
                return await controller.create();
            case "PUT" :
                return await controller.update();
            case "DELETE" :
                return await controller.delete();
            default:
                throw new Error(`Nem támogatott method: ${this._method}`)
        }
    }

    _getController() {
        const controllerName = this._tableName.toLowerCase();
        try {
            return require(`./${controllerName}`);
        } catch (err) {
            console.error(err);
            const error = new Error(`Controller nem létezik: ${controllerName}`);
            throw Object.assign(error, { originalError: err, statusCode: 404 });
        }
    }


}

module.exports = TableController;