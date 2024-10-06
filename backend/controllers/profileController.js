const User = require('../models/userModel');
const Post = require('../models/postModel');
const Comment = require('../models/commentModel');
const Notification = require('../models/notificationModel');
const fs = require('fs');
const {io, getReceiverSocketId} = require('../socket/socket')
const extractHashtags = require("../middleware/generateHashtags");
const {suggestPeopleYouMayKnow} = require("../middleware/suggestPeopleYouKnow");
const path = require("path");
const cloudinary = require('../cloudinary')
//+
const addFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Fetch the current user
        let user = await User.findById(userId)
            // .populate([{ path: 'notifications', populate: [{ path: 'senderId' }, { path: 'postId' }] }]);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the user is already following the target user
        if (user.arrays.followings.includes(id)) {
            return res.status(401).json({ error: 'Already following' });
        }

        // Fetch the user to be followed
        const followingUser = await User.findById(id)
            // .populate([{ path: 'notifications', populate: [{ path: 'senderId' }, { path: 'postId' }] }]);

        if (!followingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Create a follow notification
        const notification = await Notification.create({
            receiverId: id,
            content: 'followed you',
            senderId: userId
        });

        // Populate the notification's sender for the real-time update
        const populatedNotification = await notification.populate('senderId')

        // Update following and follower lists
        user.arrays.followings.push(id);
        followingUser.arrays.followers.push(userId);
        followingUser.notifications.push(notification._id);
        followingUser.isRead = false;

        // Save the updated user documents
        await user.save();
        await followingUser.save();

        // Emit socket events for real-time updates
        const MySocketId = getReceiverSocketId(userId);
        const FollowerSocketId = getReceiverSocketId(id);

        const populatedUser = await user
            .populate([{ path: 'notifications', populate: [{ path: 'senderId' }, { path: 'postId' }] }]);

        const populatedFollowerUser = await followingUser
            .populate([{ path: 'notifications', populate: [{ path: 'senderId' }, { path: 'postId' }] }]);


        if (MySocketId) {
            io.to(MySocketId).emit('followerAdded', populatedUser);
        }
        if (FollowerSocketId) {
            io.to(FollowerSocketId).emit('followerAdded', populatedFollowerUser);
            // io.to(FollowerSocketId).emit('newNotification', populatedNotification);
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
//+
const removeFollowing = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Fetch current user
        let user = await User.findById(userId)
            // .populate([{ path: 'notifications', populate: [{ path: 'senderId' }, { path: 'postId' }] }]);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch the user to be unfollowed
        const followingUser = await User.findById(id)
            // .populate([{ path: 'notifications', populate: [{ path: 'senderId' }, { path: 'postId' }] }]);

        if (!followingUser) {
            return res.status(404).json({ error: "Following user not found" });
        }

        // Remove the user from each other's following/follower lists
        user.arrays.followings = user.arrays.followings.filter(followingId => followingId.toString() !== id.toString());
        followingUser.arrays.followers = followingUser.arrays.followers.filter(followerId => followerId.toString() !== userId.toString());

        // Create an unfollow notification
        const notification = await Notification.create({
            receiverId: id,
            content: 'unfollowed you',
            senderId: userId
        });

        followingUser.notifications.push(notification._id);
        followingUser.isRead = false;

        // Save the updated user documents
        await user.save();
        await followingUser.save();

        // Populate the notification's sender for the real-time update
        const populatedNotification = await notification.populate('senderId');

        // Emit socket events for real-time updates
        const MySocketId = getReceiverSocketId(userId);
        const FollowerSocketId = getReceiverSocketId(id);

        const populatedUser = await user
            .populate([{ path: 'notifications', populate: [{ path: 'senderId' }, { path: 'postId' }] }]);

        const populatedFollowerUser = await followingUser
            .populate([{ path: 'notifications', populate: [{ path: 'senderId' }, { path: 'postId' }] }]);


        if (MySocketId) {
            io.to(MySocketId).emit('followerAdded', populatedUser);
        }
        if (FollowerSocketId) {
            io.to(FollowerSocketId).emit('followerAdded', populatedFollowerUser);
            // io.to(FollowerSocketId).emit('newNotification', populatedNotification);
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
//+
const getFollower = async (req,res)=>{
    try {
        // console.log(req.user._id)
        const {id} = req.params

        const user = await User.findOne({ _id: id, isDeleted: false });

        if (!user){
            return res.status(400).json({error:'No user found'})
        }

        return res.status(200).json({user})
    }catch (error) {
        return res.status(500).json({error: error.message});
    }
}
//+
const addPost = async (req, res) => {
        const userId = req.user._id;
    console.log(userId,'creator id')
        const { content, location, schedule } = req.body;
    let sizes = req.body.sizes ? JSON.parse(req.body.sizes) : undefined;
    let photo = null;
    let video = null;
    if (req.files['photo'] && req.files['photo'].length > 0) {
        photo = req.files['photo'][0].filename;
    }
    //
    // if (req.files['video'] && req.files['video'].length > 0) {
    //     video = req.files['video'][0].filename;
    // }
    if (req.files['video'] && req.files['video'].length > 0) {
        const uploadResult = await cloudinary.uploader.upload(req.files['video'][0].path, {
            resource_type: 'video', // Specify that it's a video
        });
        video = uploadResult.secure_url; // Save the secure URL from Cloudinary
    }
    console.log(photo,'photo')
    console.log(video,'video')

    const userCreator = await User.findById(userId)

    const hashtags = extractHashtags(content);

    const date = new Date()

        const newPost = new Post({
            userId,
            content,
            photo: photo ? cloudinary.url(`${photo}`) : undefined,
            video: video ? video: undefined,
            location: location || undefined,
            schedule: schedule || date,
            sizes,
            hashtags,
            isDeleted:false
        });
    await newPost.save();
    const followings = userCreator.arrays.followings;
    const followers = userCreator.arrays.followers;
    const mergedIds = [...followings, ...followers];
    const uniqueReceiverIds = [...new Set(mergedIds.map(id => id.toString()))].map(id => id);

    let notification;
    if (uniqueReceiverIds.length > 0) {
        notification = await Notification.create({
            receiverId: uniqueReceiverIds,
            content: 'created new post',
            senderId: userId,
            postId: newPost._id
        })

        const populatedNotification = await notification.populate([{path: 'senderId'}, {path: 'postId'}])
        uniqueReceiverIds.map(async (id) => {
            await User.updateMany({_id: id}, {$push: {notifications: notification._id}}, {new: true})
            const updatedUser = await User.findByIdAndUpdate({_id: id}, {isRead: false}, {new: true})
                .populate([{path: 'notifications', populate: [{path: 'senderId'}, {path: 'postId'}]}])


            io.to(getReceiverSocketId(id)).emit('userUpdate', updatedUser);
            io.to(getReceiverSocketId(id)).emit('newNotification', populatedNotification);
        })

    }

    const populatedPost = await newPost
        .populate([{ path: 'userId' }, { path: 'comments' ,  populate: {path: 'senderId',}}])


    io.emit('newPost',populatedPost)

        try {
            return res.status(200).json(populatedPost);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
};
//+
const getAllPosts = async (req,res)=>{
    try {
        const posts = await Post.find({isDeleted:false})
            .populate([{ path: 'userId' }, { path: 'comments' ,  populate: {path: 'senderId',}}])
        res.status(200).json(posts);
    }   catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
//+
const likePost = async (req,res) => {
    try {
        const {postId} = req.params;
        const userId = req.user._id
        const oldPost = await Post.findById(postId);
        if (oldPost.likes.includes(userId)){
            return  res.status(400).json({error:'You already like a Post'})
        }
        const  updatedPost = await Post.findByIdAndUpdate({_id:postId},{$addToSet:{likes:[userId]}},{new:true})
            .populate([{ path: 'userId' }, { path: 'comments' ,  populate: {path: 'senderId',}}])




         if (updatedPost.userId._id.toString() !== userId.toString()){

             const notification = await Notification.create({
                 receiverId:updatedPost.userId._id,
                 content:'liked your post',
                 senderId:userId,
                 postId:updatedPost._id
             })
             const populatedNotification = await  notification.populate([{path:'senderId'},{path:'postId'}])
             const updatedUser = await User.findByIdAndUpdate({_id:updatedPost.userId._id},{isRead: false},{new:true})
                 .populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])


             io.to(getReceiverSocketId(updatedPost.userId._id)).emit('userUpdate',updatedUser);
             io.to(getReceiverSocketId(updatedPost.userId._id)).emit('newNotification',populatedNotification);


             await User.updateMany({_id:updatedPost.userId._id},{$push:{notifications:notification._id}},{new:true})
         }

        io.emit('postLiked',updatedPost)

       return  res.status(200).json(updatedPost);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
//+
const unlikePost = async (req,res) => {
  try {
      const {postId} = req.params
      const userId = req.user._id
      let post = await Post.findOne({_id:postId})
          .populate([{ path: 'userId' }, { path: 'comments' ,  populate: {path: 'senderId',}}])


      post.likes = post.likes.filter((like)=>like.toString() !== userId.toString())
      io.emit('postUnLiked',post)


      if (post.userId._id.toString() !== userId.toString()){

          const notification = await Notification.create({
              receiverId:post.userId._id,
              content:'unliked your post',
              senderId:userId,
              postId:post._id
          })
          const populatedNotification = await  notification.populate([{path:'senderId'},{path:'postId'}])
          const updatedUser = await User.findByIdAndUpdate({_id:post.userId._id},{isRead: false},{new:true})
              .populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])


          io.to(getReceiverSocketId(post.userId._id)).emit('userUpdate',updatedUser);
          io.to(getReceiverSocketId(post.userId._id)).emit('newNotification',populatedNotification);


          await User.updateMany({_id:post.userId._id},{$push:{notifications:notification._id}},{new:true})
      }

      await post.save();
      return res.status(200).json(post)
  }catch (error) {
      return res.status(500).json({ error: error.message });
  }
}
//+
const addNewComment = async (req,res) => {
   try {
       const senderId = req.user._id
       const {postId} = req.params
       const {commentMessage} = req.body;

       const newComment = new Comment({
           senderId,
           commentMessage
       })
       await newComment.save()
       const post = await  Post.findById(postId)
       post.comments.push(newComment)
       const populatedPost =await post
           .populate([{ path: 'userId' }, { path: 'comments' ,  populate: {path: 'senderId',}}])


       if (post.userId._id.toString() !== senderId.toString()){

           const notification = await Notification.create({
               receiverId:post.userId._id,
               content:'commented on your post',
               senderId:senderId,
               postId:post._id
           })
           const populatedNotification = await  notification.populate([{path:'senderId'},{path:'postId'}])
           const updatedUser = await User.findByIdAndUpdate({_id:post.userId._id},{isRead: false},{new:true})
               .populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])

           io.to(getReceiverSocketId(post.userId._id)).emit('userUpdate',updatedUser);
           io.to(getReceiverSocketId(post.userId._id)).emit('newNotification',populatedNotification);


           await User.updateMany({_id:post.userId._id},{$push:{notifications:notification._id}},{new:true})
       }



       io.emit('newComment',populatedPost)
       await post.save()
       return res.status(200).json(populatedPost)
   }catch (error) {
       return res.status(500).json({ error: error.message });
   }
}
//+
const getHashtags = async (req, res) => {
    try {
        const trendingHashtags = await Post.aggregate([
            { $unwind: "$hashtags" },
            { $group: { _id: "$hashtags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        return res.status(200).json(trendingHashtags);
    } catch (error) {
        console.error("Error in aggregation:", error);
        return res.status(500).json({ error: error.message });
    }
}
//+
const removePost = async (req,res) => {
    try {
        const {postId} = req.params
        const userId  = req.user._id

        const postToDelete = await Post.findById(postId)
            .populate([{ path: 'userId' }, { path: 'comments' ,  populate: {path: 'senderId',}}])


        if (!postToDelete){
            return res.status(400).json({error:'No Post found'})
        }

    



        if (postToDelete.userId._id.toString() !== userId.toString()){
            console.log(postToDelete.userId._id.toString(),'id1')
            console.log(userId.toString(),'id2')
            return  res.status(400).json({error:'You can only delete your post'})
        }else {

            const followings = postToDelete.userId.arrays.followings;
            const followers = postToDelete.userId.arrays.followers;
            const mergedIds = [...followings, ...followers];
            const uniqueReceiverIds = [...new Set(mergedIds.map(id => id.toString()))].map(id => id);

            let notification;
            if (uniqueReceiverIds.length > 0) {
                notification = await Notification.create({
                    receiverId: uniqueReceiverIds,
                    content: 'deleted a post',
                    senderId: userId,
                    postId: postToDelete._id
                })

                const populatedNotification = await notification.populate([{path: 'senderId'}, {path: 'postId'}])
                uniqueReceiverIds.map(async (id) => {
                    await User.updateMany({_id: id}, {$push: {notifications: notification._id}}, {new: true})
                    const updatedUser = await User.findByIdAndUpdate({_id: id}, {isRead: false}, {new: true})
                        .populate([{path: 'notifications', populate: [{path: 'senderId'}, {path: 'postId'}]}])

                    io.to(getReceiverSocketId(id)).emit('userUpdate', updatedUser);
                    io.to(getReceiverSocketId(id)).emit('newNotification', populatedNotification);
                })
            }
        }

            await Comment.deleteMany({ _id: {$in:postToDelete.comments} });

        // const deletedPost = await Post.findByIdAndDelete(postId)
        const deletedPost = await Post.findByIdAndUpdate({_id:postId},{isDeleted:true},{new:true})
        io.emit('removePost',deletedPost)


        const photoPath = postToDelete.photo ? path.join('uploads', path.basename(postToDelete.photo)) : null;
        const videoPath = postToDelete.video ? path.join('uploads', path.basename(postToDelete.video)) : null;

        if (photoPath && fs.existsSync(photoPath)) {
            fs.unlinkSync(photoPath);
        }

        if (videoPath && fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
        }



        return res.status(200).json(deletedPost)
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }

}
//+
const getSuggestedUsers = async (req,res) => {
    try {
        const userId = req.user._id
        const currentUser = await User.findById(userId)
            .populate([{ path: 'arrays' ,  populate: {path: "followings",}}])
            .lean()
        const allUsers = await User.find().lean()

        const suggestedPeople = suggestPeopleYouMayKnow(currentUser,allUsers)

        return res.status(200).json(suggestedPeople)

    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
//+
const changeIsRead = async (req,res) => {
    try {
        const userId = req.user._id

        const user = await User.findByIdAndUpdate(
            {_id:userId},
            {isRead:true},
            {new:true}
        ).populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])

        return res.status(200).json(user)

    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// post link
const getPost = async (req,res) => {
    try {
        const {postId} = req.params
        const post = await Post.findById(postId)
            .populate([{ path: 'userId' }, { path: 'comments' ,  populate: {path: 'senderId',}}])

        return res.status(200).json(post)
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    addFollowing,
    getFollower,
    addPost,
    getAllPosts,
    likePost,
    unlikePost,
    removeFollowing,
    addNewComment,
    getHashtags,
    removePost,
    getSuggestedUsers,
    changeIsRead,
    getPost
}