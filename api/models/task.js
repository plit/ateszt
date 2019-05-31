const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    board_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Board',
    } ,
    name: { type: String, default: '' }
});

module.exports = mongoose.model('Task', taskSchema);