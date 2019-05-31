const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    task_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Task',
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    assigned_user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {type: String, default: '', required: true},
    order: {type: Number, default: 1},
    dt_created: {type: Date, default: new Date()},
    dt_deadline: {type: Date}
});

module.exports = mongoose.model('Card', cardSchema);