const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: { type: String, default: '' }
});

module.exports = mongoose.model('Board', boardSchema);