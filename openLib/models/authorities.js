const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const authoritiesSchema = new Schema({
    authority:{
        type:String,
        require:true
    },
    numberBook:{
        type:Number,
        require:true
    }
})
module.exports = mongoose.model('authorities', authoritiesSchema);