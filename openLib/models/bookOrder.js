const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({

    accountId:{
        type: Schema.Types.ObjectId,
        ref: 'account',
        require:true
    },
    accountMail:{
        type: String,
    },
    bookName:{
        type: String,
        require:true
    },
    bookAuthor:{
        type: String,
        require:true
    },
    orderDate:{
        type: Date
    }
    });
    module.exports = mongoose.model('bookOrders', bookSchema);