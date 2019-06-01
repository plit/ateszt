const BaseController = require('./base');

class BoardController extends BaseController {
    _beforeCreate() {
        this._body.user_id = this._userData.user_id;
    }
}

module.exports = BoardController;
