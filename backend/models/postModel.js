const mongoose = require('mongoose');

const Schema = mongoose.Schema

const PostSchema = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    content: {
        type: String,
        required: true,
    },
    photo:{
        type: String,
        required: false,
    },
    video:{
        type: String,
        required: false,
    },
    location:{
        type: String,
        required: false,
    },
    schedule:{
        type: Date,
        required: false,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            required:false
        }
    ],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    sizes:{
        photoSizes:{
            width:{
                type:Number,
                required:false,
                default:0
            },
            height:{
                type:Number,
                required:false,
                default:0
            }
        },
        videoSizes:{
            width:{
                type:Number,
                required:false,
                default:0
            },
            height:{
                type:Number,
                required:false,
                default:0
            }
        }
    },
    hashtags:[
        {
            type:String,
            required:true
        }
    ],
    isDeleted:{
        type:Boolean,
        required:false
    }
},{timestamps:true})


module.exports = mongoose.model('Post',PostSchema);
