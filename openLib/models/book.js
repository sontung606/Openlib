const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title:{
        type: String,
    required: true,
        trim:true
    },
    author:{
        type: String,
    required: true,
    trim:true
    },
    rating:{
        type: Number,
        required: true,
        trim:true
    },
    description: {
        type: String,
        required: true,
        trim:true
      },
    published_date:{
        type: Date,
        require: true
    },
    imageUrl: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('books', bookSchema);