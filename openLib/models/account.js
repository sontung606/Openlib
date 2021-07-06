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
    },
    name:{
        type:String
    },
    phoneNum:{
        type:Number
    },
    authority :{
        type:String
    },
    enabled:{
        type:Boolean
    }
})
module.exports = mongoose.model('account', accountSchema);