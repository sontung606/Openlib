const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    accountMail:{
        type: String,
        require: true
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
        type: Date,
        require: true
    }
    });
    module.exports = mongoose.model('bookOrders', bookSchema);