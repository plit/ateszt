const BaseController = require('./base');

class CardController extends BaseController {

    _beforeCreate() {
        this._body.user_id = this._userData.user_id;
    }
}

module.exports = CardController;
