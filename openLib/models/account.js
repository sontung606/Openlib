const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        trim:true,
        minlength: 8
    },
    firstname:{
        type:String
    },
    lastname:{
        type:String
    },
    phoneNum:{
        type:Number,
        maxlength: 10 
    },
    birthday:{
        type: Date
    }, 
    authority :{
        type:String
    },
    enabled:{
        type:Boolean
    }
})
module.exports = mongoose.model('account', accountSchema);