const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    receiverId:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        }
    ],
    content:{
        type: String,
        required: true,
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User',
    },
    postId:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref:'Post',
    }
},{timestamps:true})

module.exports = mongoose.model('Notification', notificationSchema);