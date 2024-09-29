const mongoose = require('mongoose');
const Schema = mongoose.Schema


const reactionSchema = new Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    reaction: {
        type: String,
        required: true
    }
}, { _id: false });



const messageSchema = new Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    message:{
        content:{
            type: String,
            required: false,
        },
        reactions:[reactionSchema]
    },
    photos: [
        {
            url:{
                type:String,
                required:false,
            },
            reactions:[reactionSchema],
            _id: false,
        }
    ],
    videos:[
        {
            url:{
                type:String,
                required:false,
            },
            reactions:[reactionSchema],
            _id: false,
        }
    ],
    audio:{
        url:{
            type: String,
            required: false,
        },
        reactions:[reactionSchema],
        _id: false,
    },
    postSharedBy:{
        pic:{
            type:String,
            required:false
        },
        username:{
            type:String,
            required:false
        }
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        required:false
    }
},{timestamps:true})

module.exports = mongoose.model('Message',messageSchema);