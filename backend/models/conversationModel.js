const mongoose = require('mongoose');
const Schema = mongoose.Schema
const ConversationSchema = new Schema({
    participants:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'
        }
    ],
    messages:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Message'
        }
    ]
})

module.exports = mongoose.model('Conversation', ConversationSchema);