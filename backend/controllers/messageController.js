const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const User = require('../models/userModel')
const path = require('path');
const fs = require('fs');
const {io, getReceiverSocketId} = require("../socket/socket");
const sendNewMessage  = async (req, res) => {
    try {
        const senderId = req.user._id;
        const {id:receiverId} = req.params
        const {message} = req.body;
        const files = req.files;

        const baseUrl = `${req.protocol}://${req.get('host')}/messages/images/`;

        // Process the uploaded files
        console.log(files,'files of now')
        const photos = files.photos ? files.photos.map(file => {
            return {
                url:`${baseUrl}${file.filename}`,
            }
        }) : undefined ;
        const videos = files.videos ? files.videos.map(file => {
            return {
                url:`${baseUrl}${file.filename}`
            }
        }) : undefined ;
        const audio = files.audio ? {url:`${baseUrl}${files.audio[0].filename}`} : undefined;

        files.audio &&     res.set('Content-Length', files.audio[0].length);


        let conversation = await Conversation.findOne({
            participants: {$all:[senderId,receiverId]}
        })

        if (!conversation){
            conversation = await Conversation.create({
                participants: [senderId,receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message:{
                content:message
            },
            photos,
            videos,
            audio,
        })
        console.log(photos,'why')

        const savedMessage = await newMessage.save()

        if (savedMessage) {
            conversation.messages.push(savedMessage._id)
            await conversation.save(); // Save the conversation after updating messages
        }
        const receiverSocketId = getReceiverSocketId(receiverId)
        io.to(receiverSocketId).emit('newMessage', newMessage)

        return res.status(200).json(newMessage)

    }catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message });
    }
}

const getAllMessages = async (req, res) => {
    try {
      const senderId = req.user._id
      const {id:receiverId} = req.params

      const conversation = await Conversation.findOne({
          participants: {$all:[senderId,receiverId]}
      }).populate({
          path: 'messages',
          populate: [
              {
                  path: 'message.reactions.senderId',
                  model: 'User'
              },
              {
                  path: 'photos.reactions.senderId',
                  model: 'User'
              },
              {
                  path: 'videos.reactions.senderId',
                  model: 'User'
              },
              {
                  path: 'audio.reactions.senderId',
                  model: 'User'
              }
          ]
      })

      const messages =conversation? conversation.messages:[]

      return res.status(200).json(messages)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const getUsersForSideBar = async (req,res) => {
    try {
        const userId = req.user._id
        const users = []

        const conversations = await Conversation.find({
            participants: userId
        }).select('participants');



        const currentUser = await User.findById(userId)
        if (!currentUser) {
            return res.status(400).json({ error: 'Current user not found' });
        }
        const conversationParticipants = conversations.flatMap(conversation => conversation.participants);
        const uniqueConversationParticipants = conversationParticipants.filter(id => id.toString() !== userId.toString());
        const moreUniqueConversationParticipants = [...new Set(uniqueConversationParticipants.map(id => id.toString()))].map(id => id)
        const followings = currentUser.arrays.followings;
        const followers = currentUser.arrays.followers;
        const mergedIds = [...followings, ...followers];
        const uniqueUserIds = [...new Set(mergedIds.map(id => id.toString()))].map(id => id);
        const sidebarUsers = [...new Set([...moreUniqueConversationParticipants, ...uniqueUserIds])];
        for (const id of sidebarUsers){
            const user = await User.findById(id)
                .populate([{path: 'notifications', populate: [{path: 'senderId'}, {path: 'postId'}]}])
            users.push(user)
        }

        return res.status(200).json(users)

    }
    catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message });
    }
}

const reactToMessage = async (req,res) => {
    try {
        const userId = req.user._id
        const {messageId} = req.params
        const {reaction,type,index} = req.body

        console.log(index,'index')
        const message = await Message.findById(messageId)

        const updateReaction = (reactions) => {
            const existingReactionIndex = reactions.findIndex(
                (r) => r.senderId.toString() === userId.toString()
            );
            if (existingReactionIndex > -1) {
                reactions[existingReactionIndex].reaction = reaction;
            } else {
                reactions.push({ senderId: userId, reaction });
            }
        };

        if (type === 'message') {
            updateReaction(message.message.reactions)
        }else if (type === 'photos' ) {
            updateReaction(message.photos[index].reactions)
        }else if (type === 'videos' ) {
            updateReaction(message.videos[index].reactions)
        }else if (type === 'audio') {
            updateReaction(message.audio.reactions)
        }else {
            return res.status(400).json({ error: 'Invalid reaction type' });
        }

        const updatedMessage = await message.save()

        const populatedMessage = await Message.findById(updatedMessage._id)
            .populate({
                path: 'message.reactions.senderId',
                model: 'User'
            })
            .populate({
                path: 'photos.reactions.senderId',
                model: 'User'
            })
            .populate({
                path: 'videos.reactions.senderId',
                model: 'User'
            })
            .populate({
                path: 'audio.reactions.senderId',
                model: 'User'
            })


        const receiverSocketId = getReceiverSocketId(message.receiverId);
        const senderSocketId = getReceiverSocketId(message.senderId);
        io.to(receiverSocketId).emit('messageWithReaction',populatedMessage)
        io.to(senderSocketId).emit('messageWithReaction',populatedMessage)

        return res.status(200).json(populatedMessage)

    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message });
    }
}

const deleteReaction = async (req,res) => {
    try {
        const userId = req.user._id
        const {messageId} = req.params
        const {type,index,reactionIndex} = req.body
        const message = await Message.findById(messageId)

        const updateReaction = (reactions) => {
            if (reactions[reactionIndex].senderId.toString() === userId.toString()){
                return reactions.filter((reaction,index) => index  !== reactionIndex )
            }else{
                throw new Error('You can only delete your reaction')
            }
        };

        if (type === 'message') {
           message.message.reactions = updateReaction(message.message.reactions)
        }else if (type === 'photos' ) {
          message.photos[index].reactions =  updateReaction(message.photos[index].reactions)
        }else if (type === 'videos' ) {
          message.videos[index].reactions =  updateReaction(message.videos[index].reactions)
        }else if (type === 'audio') {
          message.audio.reactions =  updateReaction(message.audio.reactions)
        }else {
            return res.status(400).json({ error: 'Invalid reaction type' });
        }

        const updatedMessage = await message.save()

        const populatedMessage = await Message.findById(updatedMessage._id)
            .populate({
                path: 'message.reactions.senderId',
                model: 'User'
            })
            .populate({
                path: 'photos.reactions.senderId',
                model: 'User'
            })
            .populate({
                path: 'videos.reactions.senderId',
                model: 'User'
            })
            .populate({
                path: 'audio.reactions.senderId',
                model: 'User'
            })


        const receiverSocketId = getReceiverSocketId(message.receiverId);
        const senderSocketId = getReceiverSocketId(message.senderId);
        io.to(receiverSocketId).emit('messageWithReaction',populatedMessage)
        io.to(senderSocketId).emit('messageWithReaction',populatedMessage)


        return res.status(200).json(populatedMessage)

    }catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message });
    }
}

const deleteMessage =async (req,res) => {
    try {
     const userId = req.user._id
        const {messageId} = req.params
     const {type,index} = req.body

        console.log(type,'type')
        console.log(index,'index')
        console.log(messageId,'messageId')

        let message;

             message = await Message.findById(messageId)
            if (userId.toString() !== message.senderId.toString()){
                return res.status(400).json({error: 'You can only delete your message'})
            }


        // Extract file paths
        const filePaths = [
            ...message.photos,  // Assuming photos are objects with a `url` property
            ...message.videos,  // Assuming videos are objects with a `url` property
            message.audio        // Assuming audio is an object with a `url` property
        ] .filter(item => item && typeof item === 'object' && typeof item.url === 'string' && item.url.trim() !== '');
        console.log(filePaths,'file paths')
        // Process each file path
        filePaths.forEach(item => {
            const fileUrl = item.url;  // Get the URL from the item
            if (fileUrl) {  // Only process if URL exists
                const filePath = path.join('uploadsM', fileUrl);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            } else {
                console.warn('Skipping item without URL:', item);
            }
        });


        if (type === 'message') {
            message.message.content = null
        }else if (type === 'photos' ) {
            message.photos = message.photos.filter((item,index2) => index2 !== index)
        }else if (type === 'videos' ) {
            message.videos = message.videos.filter((item,index2) => index2 !== index)
        }else if (type === 'audio') {
            message.audio.url = null
        }else {
            return res.status(400).json({ error: 'Invalid reaction type' });
        }


        const updatedMessage = await message.save()

        let populatedMessage = await Message.findById(updatedMessage._id)
            .populate({
                path: 'message.reactions.senderId',
                model: 'User'
            })
            .populate({
                path: 'photos.reactions.senderId',
                model: 'User'
            })
            .populate({
                path: 'videos.reactions.senderId',
                model: 'User'
            })
            .populate({
                path: 'audio.reactions.senderId',
                model: 'User'
            })


        let conversation = await Conversation.findOne({
            participants: {$all:[populatedMessage.senderId,populatedMessage.receiverId]}
        })
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        if ((populatedMessage.message.content === null || !populatedMessage.message.content) && (populatedMessage.audio.url === null || !populatedMessage.audio.url) && message.photos.length === 0 && message.videos.length === 0){
            await Message.deleteOne({_id:populatedMessage._id})
            populatedMessage ={...populatedMessage.toObject(),isDeleted:true}
            conversation.messages = conversation.messages.filter((messageId) => messageId.toString() !== populatedMessage._id.toString())
            await conversation.save(); // Save the conversation after updating messages

        }



        const receiverSocketId = getReceiverSocketId(message.receiverId);
        const senderSocketId = getReceiverSocketId(message.senderId);
        io.to(receiverSocketId).emit('messageWithReaction',populatedMessage)
        io.to(senderSocketId).emit('messageWithReaction',populatedMessage)


        return res.status(200).json(populatedMessage)


    }catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message });
    }
}

const deleteMessages = async  (req,res) => {
    try {
        const userId =req.user._id
        const messages = req.body

        console.log(messages,'messages')

        if (!Array.isArray(messages)) {
            console.log('Messages should be provided as an array')
            return res.status(400).json({ error: 'Messages should be provided as an array' });
        }

        for (let selMessage of messages) {
            let message;
            message = await Message.findById(selMessage.messageId)
            console.log(message,'this message')

            if (!message){
                return res.status(400).json({error: 'No message found'})
            }


            if (userId.toString() !== message.senderId.toString()){
                return res.status(400).json({error: 'You can only delete your message'})
            }

            switch (selMessage.type) {
                case 'message':
                    message.message.content = null;
                    break;
                case 'photos':
                    message.photos = message.photos.filter((_, index) => index !== selMessage.index);
                    break;
                case 'videos':
                    message.videos = message.videos.filter((_, index) => index !== selMessage.index);
                    break;
                case 'audio':
                    message.audio.url = null;
                    break;
                default:
                    console.log('Invalid reaction type');
                    return res.status(400).json({ error: 'Invalid reaction type' });
            }

          await message.save()

            let populatedMessage = await Message.findById(message._id)
                .populate({
                    path: 'message.reactions.senderId',
                    model: 'User'
                })
                .populate({
                    path: 'photos.reactions.senderId',
                    model: 'User'
                })
                .populate({
                    path: 'videos.reactions.senderId',
                    model: 'User'
                })
                .populate({
                    path: 'audio.reactions.senderId',
                    model: 'User'
                })


            let conversation = await Conversation.findOne({
                participants: {$all:[populatedMessage.senderId,populatedMessage.receiverId]}
            })
            if (!conversation) {
                return res.status(404).json({ error: 'Conversation not found' });
            }

            if ((populatedMessage.message.content === null || !populatedMessage.message.content) &&
                (populatedMessage.audio.url === null || !populatedMessage.audio.url) &&
                message.photos.length === 0 && message.videos.length === 0){
                await Message.deleteOne({_id:populatedMessage._id})
                populatedMessage ={...populatedMessage.toObject(),isDeleted:true}
                conversation.messages = conversation.messages.filter((messageId) => messageId.toString() !== populatedMessage._id.toString())
                await conversation.save(); // Save the conversation after updating messages

            }

            const receiverSocketId = getReceiverSocketId(populatedMessage.receiverId);
            const senderSocketId = getReceiverSocketId(populatedMessage.senderId);
            io.to(receiverSocketId).emit('messageWithReaction',populatedMessage)
            io.to(senderSocketId).emit('messageWithReaction',populatedMessage)


        }
    }catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message });
    }
}

const sendSharedMessage = async  (req,res) => {
    try {
        const senderId = req.user._id;
        const {message,photo,video,audio,receiverIds,messages,pic,username,postId} = req.body;


        if (!messages || messages.length === 0){
            let newMessages = []
            for (const receiverId of receiverIds){
                let conversation = await Conversation.findOne({
                    participants: {$all:[senderId,receiverId]}
                })

                if (!conversation){
                    conversation = await Conversation.create({
                        participants: [senderId,receiverId]
                    })
                }


                const newMessage = new Message({
                    senderId,
                    receiverId,
                    message:message?{
                        content:message
                    }:undefined,
                    photos:photo?[{url:photo}]:undefined,
                    videos:video?[{url:video}]:undefined,
                    audio:audio?{
                        url:audio
                    }:undefined,
                    postSharedBy:{
                        pic,
                        username
                    },
                    postId
                })

                const savedMessage = await newMessage.save()

                if (savedMessage) {
                    conversation.messages.push(savedMessage._id)
                    await conversation.save(); // Save the conversation after updating messages
                    const receiverSocketId = getReceiverSocketId(receiverId)
                    io.to(receiverSocketId).emit('newMessage', newMessage)
                    newMessages.push(newMessage)
                }


            }
            return res.status(200).json(newMessages)
        }else {
            let newMessages = []
            for (const receiverId of receiverIds){
                let conversation = await Conversation.findOne({
                    participants: {$all:[senderId,receiverId]}
                })

                if (!conversation){
                    conversation = await Conversation.create({
                        participants: [senderId,receiverId]
                    })
                }

        for (const  {message,photo,video,audio} of messages){

            const newMessage = new Message({
                senderId,
                receiverId,
                message:message?{
                    content:message
                }:undefined,
                photos:photo?[{url:photo}]:undefined,
                videos:video?[{url:video}]:undefined,
                audio:audio?{
                    url:audio
                }:undefined,
                postedBy:{
                    pic,
                    username
                },
                postId
            })

            const savedMessage = await newMessage.save()

            if (savedMessage) {
                conversation.messages.push(savedMessage._id)
                await conversation.save(); // Save the conversation after updating messages
                const receiverSocketId = getReceiverSocketId(receiverId)
                io.to(receiverSocketId).emit('newMessage', newMessage)
                newMessages.push(newMessage)
            }

        }

            }
            return res.status(200).json(newMessages)
        }


    }catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message });
    }
}



module.exports = {
    sendNewMessage,
    getAllMessages,
    getUsersForSideBar,
    reactToMessage,
    deleteReaction,
    deleteMessage,
    deleteMessages,
    sendSharedMessage,
}