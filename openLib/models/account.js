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
        require:true,
        trim:true,
        minlength: 8
    },
    firstname:{
        type:String,
        require:true

    },
    lastname:{
        type:String,
        require:true

    },
    phoneNum:{
        type:Number,
        maxlength: 10,
        require:true
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