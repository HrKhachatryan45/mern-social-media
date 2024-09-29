const mongoose = require('mongoose');
const Schema = mongoose.Schema


const commentSchema = new Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    commentMessage:{
        type:String,
        required:true
    }
},{timestamps:true})

module.exports = mongoose.model('Comment',commentSchema);