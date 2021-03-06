const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({

    dateBorrow: {
        type: Date,
        require: true
    },
    dateReturn: {
        type: Date,
        require: true
    },
    accountId: {
        type: Schema.Types.ObjectId,
        ref: 'account',
        require: true
    },
    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'books',
        require: true
    },
    rentPriceTotal: {
        type: Number
    },
    status: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('booksBorrow', bookSchema);