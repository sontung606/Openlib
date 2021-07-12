const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
    email:{
        type: String,
        trim: true,
        lowercase: true,
        unique: [true,'Email is already registered'],
        required: 'Email address is required',
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password:{
        type:String,
        require:true,
        trim:true,
        minlength: [8,'Minimum password length to at least a value of 8']
    },
    firstname:{
        type:String,
        require:true,
        trim:true,
    },
    lastname:{
        type:String,
        require:true,
        trim:true
    },
    phoneNum:{
        type:String,
        require:true,
        trim:true
    },
    birthday:{
        type: Date
    }, 
    authority :{
        type:String,
        require:true
    },
    enabled:{
        type:Boolean,
        require:true
    }
})
module.exports = mongoose.model('account', accountSchema);