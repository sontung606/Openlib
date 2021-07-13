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
    RAC:[{
        accountId:{
            type: Schema.Types.ObjectId,
            ref: 'account'
        },
        rating:{
            type:Number
        },
        comment:{
            type:String
        }
    }],
    categories:{
        type:String,
        required: true,
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