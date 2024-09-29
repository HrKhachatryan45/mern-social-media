const mongoose = require('mongoose');

const Schema = mongoose.Schema

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    arrays:{
        followers:[{
            type:mongoose.Schema.Types.ObjectId,
            required:false,
            ref:'User'
        }],
        followings:[{
            type:mongoose.Schema.Types.ObjectId,
            required:false,
            ref:'User'
        }]
    },
    info:{
        bio:{
            type: String,
            required:false,
            default:''
        },
        location:{
            type: String,
            required:false,
            default:''
        },
        profession:{
            type: String,
            required:false,
            default:''
        },
        birthDay:{
            type: Date,
            required:false,
            default:''
        }
    },
    images:{
        profileImage:{
            type:String,
            required:false
        },
        backgroundImage:{
            type:String,
            required:false
        }
    },
    notifications:[
        {
            type: mongoose.Schema.Types.ObjectId,
            default:[],
            ref:'Notification'
        }
    ],
    isRead:{
        type:Boolean,
        required:false
    },
    isDeleted:{
        type:Boolean,
        required:true
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    signalingKey: String, // For Socket.io signaling
    isCalling: { type: Boolean, default: false },
},{timestamps: true});

module.exports =  mongoose.model('User', userSchema);