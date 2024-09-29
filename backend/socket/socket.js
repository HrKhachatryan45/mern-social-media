const express = require('express');
const {Server} = require('socket.io');
const http = require("http");
const app = express();
const User = require("../models/userModel");
const server = http.createServer(app)



const io = new Server(server,{
    cors:{
        methods:['GET','POST','PUT','PATCH','DELETE']
    }
});

const userSocketMap = {};

const getReceiverSocketId=(receiverId)=>{
    return userSocketMap[receiverId];
}



io.on('connection', (socket)=> {
    console.log('New User Connected',socket.id)

    const userId = socket.handshake.query.userId;
    if (userId !== 'undefined') userSocketMap[userId]=socket.id

    console.log(userSocketMap,'users object');


io.emit('getOnlineUsers',Object.keys(userSocketMap));




    socket.on('typing',({senderId,receiverId})=>{
        io.to(getReceiverSocketId(receiverId)).emit('userTyping',senderId)
    })

    socket.on('untyping',({receiverId})=>{
        io.to(getReceiverSocketId(receiverId)).emit('userUnTyping')
    })

    socket.on('lastActivity',async (userId)=>{
                await User.findByIdAndUpdate({_id:userId},{lastActivity:new Date()})
                socket.broadcast.emit('getUsersForSidebar');
    })

    socket.on('call-user', (data) => {
        io.to(data.to).emit('call-made', {
            offer: data.offer,
            from: data.from
        });
    });

    socket.on('make-answer', (data) => {
        io.to(data.to).emit('answer-made', {
            answer: data.answer,
            from: data.from
        });
    });

    socket.on('join', (userId) => {
        socket.join(userId);
        socket.broadcast.emit('user-joined', userId);
    });

    socket.on('disconnect',()=>{
        console.log('User disconnected',socket.id)
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap))
    })
})

module.exports = {app,io,server,getReceiverSocketId};