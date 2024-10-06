const Post = require('../models/postModel')
const User = require('../models/userModel');
const Comment = require('../models/commentModel');
const {io, getReceiverSocketId} = require("../socket/socket");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const Notification = require("../models/notificationModel");
const cloudinary = require('../cloudinary')
const updateInfo = async (req, res) => {
  try {
      const userId = req.user._id
      const {fullName,email,bio,location,profession,birthDay,username} = req.body;
      let profileImage = null;
      let backgroundImage = null;

      if (req.files['profileImage'] && req.files['profileImage'].length > 0) {
          profileImage = req.files['profileImage'][0].filename;
      }

      if (req.files['backgroundImage'] && req.files['backgroundImage'].length > 0) {
          backgroundImage = req.files['backgroundImage'][0].filename;
      }
      const user = await User.findById(userId)
      const myPath = path.resolve();

      // Define default image URLs
      const defaultProfileImage = 'https://cdn-icons-png.freepik.com/256/3177/3177440.png?semt=ais_hybrid';
      const defaultBackgroundImage = 'https://img.freepik.com/free-vector/blue-wave-background-banner-modern-design_677411-1279.jpg?t=st=1715420712~exp=1715424312~hmac=6549150db281add14a76f2cca0f3e4852b603dc6cc7bbaa32e37c4905f963194&w=826';

      // Delete old profile image if it is not the default one and a new one is provided
      if (user.images.profileImage !== defaultProfileImage && profileImage) {
          const oldProfileImage = path.basename(user.images.profileImage);
          const oldProfileImagePath = path.join(myPath, 'uploadsP', oldProfileImage);
          if (fs.existsSync(oldProfileImagePath)) {
              fs.unlinkSync(oldProfileImagePath);
          }
      }

      // Delete old background image if it is not the default one and a new one is provided
      if (user.images.backgroundImage !== defaultBackgroundImage && backgroundImage) {
          const oldBackgroundImage = path.basename(user.images.backgroundImage);
          const oldBackgroundImagePath = path.join(myPath, 'uploadsP', oldBackgroundImage);
          if (fs.existsSync(oldBackgroundImagePath)) {
              fs.unlinkSync(oldBackgroundImagePath);
          }
      }



      const userToUpdate = await User.findByIdAndUpdate({_id:userId},{
          username:username?username:user.username,
          fullName: fullName?fullName:user.fullName,
          email: email?email:user.email,
          info:{
              bio:bio?bio:user.info.bio || '',
              location:location?location:user.info.location || '',
              profession:profession?profession:user.info.profession || '',
              birthDay:birthDay?birthDay:user.info.birthDay || ''
          },
          images:{
              profileImage:profileImage?cloudinary.url(`${profileImage}`):user.images.profileImage,
              backgroundImage:backgroundImage?cloudinary.url(`${backgroundImage}`):user.images.backgroundImage,
          }
      },{ new: true })
          .populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])

      // Ensure empty strings are explicitly set if provided
      if (email === '') userToUpdate.email = '';
      if (bio === '') userToUpdate.info.bio = '';
      if (location === '') userToUpdate.info.location = '';
      if (profession === '') userToUpdate.info.profession = '';
      if (birthDay === '') userToUpdate.info.birthDay = '';
      if (username === '') userToUpdate.username = '';

      // Check if any fields are actually updated
      const isEqual = (obj1, obj2) => {
          return JSON.stringify(obj1) === JSON.stringify(obj2);
      };

      const isInfoEqual = isEqual(user.info, userToUpdate.info);
      const isImagesEqual = isEqual(user.images, userToUpdate.images);

      if (
          user.fullName === userToUpdate.fullName &&
          user.email === userToUpdate.email &&
          user.username === username &&
          isInfoEqual &&
          isImagesEqual
      ) {
          return res.status(400).json({ error: 'Nothing to update' });
      }
      await userToUpdate.save()
      io.emit('updateUser',userToUpdate)


      const followings = userToUpdate.arrays.followings;
      const followers = userToUpdate.arrays.followers;
      const mergedIds = [...followings, ...followers];
      const uniqueReceiverIds = [...new Set(mergedIds.map(id => id.toString()))].map(id => id);


      const notification = await Notification.create({
          receiverId:uniqueReceiverIds,
          content:'updated his info',
          senderId:userId,
      })

      const populatedNotification = await  notification.populate([{path:'senderId'},{path:'postId'}])
      uniqueReceiverIds.map(async (id)=>{
          await User.updateMany({_id:id},{$push:{notifications:notification._id}},{new:true})
          const updatedUser = await User.findByIdAndUpdate({_id:id},{isRead: false},{new:true})
              .populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])


          io.to(getReceiverSocketId(id)).emit('userUpdate',updatedUser);
          io.to(getReceiverSocketId(id)).emit('newNotification',populatedNotification);
      })





      return  res.status(200).json(userToUpdate)
  }catch (error) {
      return res.status(500).json({ error: error.message });
  }




}
//+
const changePassword = async (req,res)=> {
    try {
        const userId = req.user._id
        const {currentPassword,newPassword} = req.body

        if (!currentPassword || !newPassword){
            return res.status(400).json({error:'All fields must be filled in'})
        }

        const user = await User.findById(userId)
         const isMatch = await bcrypt.compare(currentPassword,user.password);
        if (!isMatch){
            return res.status(400).json({ error: "Incorrect Current Password" });
        }
        const hashedPassword = await bcrypt.hash(newPassword,10)

        user.password = hashedPassword;

        await user.save()
        return  res.status(200).json(user)
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteUser = async (req,res)=>{
   try {
       const {password} = req.body
       const userId = req.user._id;
        const userToDelete = await User.findById(userId)
            .populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])
        const isMatch = await bcrypt.compare(password, userToDelete.password);
       if (!isMatch){
           return res.status(400).json({error:"Incorrect Password" });
       }
        const posts = await Post.find().populate('comments')


       for (const post of posts) {
           const userComments = post.comments.filter((comment) => comment.senderId && comment.senderId.toString() === userId.toString());

           if (userComments.length > 0) {
               // Remove user's comments from the post
               post.comments = post.comments.filter((comment) => comment.senderId && comment.senderId.toString() !== userId.toString());

               // Save the updated post
               await post.save();

               // Delete the corresponding Comment documents
               const commentIds = userComments.map(comment => comment._id);
               await Comment.deleteMany({ _id: { $in: commentIds } });
           }
       }

       await Post.updateMany({ userId: userId },{isDeleted:true},{new:true})
       await User.updateOne({_id:userId},{isDeleted:true},{new:true})
       await User.updateMany(
           {},{
               $pull:{
                   'arrays.followers':userId,
                   'arrays.followings':userId,
               }
           })
       await Post.updateMany({},{
           $pull:{
               likes:userId
           }
       })
       res.status(200).json({msg:'Users deleted successfully'})
       const updatedPost = await Post.find()
           .populate([{ path: 'userId' }, { path: 'comments' ,  populate: {path: 'senderId',}}])

       io.emit('deleteUserForPosts',updatedPost)
       io.emit('updateFollow',{userId})
       console.log(updatedPost,'updatedPost')



       for (const notification of userToDelete.notifications){

           if (notification.receiverId.length === 1){
               await Notification.deleteMany({_id:notification._id})
           }else{
               await Notification.updateMany({_id:notification._id},{$pull:{receiverId:userToDelete._id}},{new:true})
           }

       }


       const followings = userToDelete.arrays.followings;
       const followers = userToDelete.arrays.followers;
       const mergedIds = [...followings, ...followers];
       const uniqueReceiverIds = [...new Set(mergedIds.map(id => id.toString()))].map(id => id);


       const notification = await Notification.create({
           receiverId:uniqueReceiverIds,
           content:"deleted his account",
           senderId:userId,
       })

       const populatedNotification = await  notification.populate([{path:'senderId'},{path:'postId'}])
       uniqueReceiverIds.map(async (id)=>{
           await User.updateMany({_id:id},{$push:{notifications:notification._id}},{new:true})
           const updatedUser = await User.findByIdAndUpdate({_id:id},{isRead: false},{new:true})
               .populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])


           io.to(getReceiverSocketId(id)).emit('userUpdate',updatedUser);
           io.to(getReceiverSocketId(id)).emit('newNotification',populatedNotification);
       })


       const profilePicPath = userToDelete.images.profileImage !== 'https://cdn-icons-png.freepik.com/256/3177/3177440.png?semt=ais_hybrid'?path.join('uploadsP',path.basename(userToDelete.images.profileImage)):null
       const backgroundPicPath = userToDelete.images.backgroundImage !== ' https://img.freepik.com/free-vector/blue-wave-background-banner-modern-design_677411-1279.jpg?t=st=1715420712~exp=1715424312~hmac=6549150db281add14a76f2cca0f3e4852b603dc6cc7bbaa32e37c4905f963194&w=826'?path.join('uploadsP',path.basename(userToDelete.images.backgroundImage)):null

       console.log(profilePicPath,'pic profile')
       console.log(backgroundPicPath,'backgroundPic')


       if (profilePicPath && fs.existsSync(profilePicPath)){
           fs.unlinkSync(profilePicPath)
       }
       if (backgroundPicPath && fs.existsSync(backgroundPicPath)){
           fs.unlinkSync(backgroundPicPath)
       }


   }catch (error) {
       return res.status(500).json({ error: error.message });
   }
}
//+
const getUser = async (req,res) => {
    try {
        const {userId} = req.params
        const user = await User.findOne({_id:userId,isDeleted:false})
        return res.status(200).json(user)
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

const clearAll = async (req,res) => {
    try {
        const userId = req.user._id

        const user =await User.findById(userId)
            .populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])
        console.log(user,'yuser')

       for (const notification of user.notifications) {
           console.log(notification,'clear notification')
           if (notification.receiverId.length === 1 && notification.senderId && notification.senderId.isDeleted === true) {
               const userToDelete = await User.findById(notification.senderId._id)
               await Notification.deleteMany({_id:notification._id})

               for (const userToDeleteNotificationId of notification.senderId.notifications){
                   await Notification.deleteMany({_id:userToDeleteNotificationId})
               }

               const userPosts = await Post.find({ userId: notification.senderId._id }).populate('comments')
               const myPath = path.resolve()

               for (const post of userPosts){
                   await Comment.deleteMany({ _id: {$in:post.comments} });

                   if (post.photo) {
                       const photoName = path.basename(post.photo)

                       fs.unlinkSync(`${myPath}/uploads/${photoName}`)
                       console.log(photoName,'photoName')

                   }

                   if (post.video){
                       const videoName = path.basename(post.video)
                       fs.unlinkSync(`${myPath}/uploads/${videoName}`)
                       console.log(videoName,'videoName')

                   }
               }
               await Post.deleteMany({ userId: notification.senderId._id  });

               if (userToDelete.images.profileImage !== 'https://cdn-icons-png.freepik.com/256/3177/3177440.png?semt=ais_hybrid'){
                   const profileImage = path.basename(userToDelete.images.profileImage)
                   fs.unlinkSync(`${myPath}/uploadsP/${profileImage}`)
               }
               if (userToDelete.images.backgroundImage !== ' https://img.freepik.com/free-vector/blue-wave-background-banner-modern-design_677411-1279.jpg?t=st=1715420712~exp=1715424312~hmac=6549150db281add14a76f2cca0f3e4852b603dc6cc7bbaa32e37c4905f963194&w=826'){
                   const backgroundImage = path.basename(userToDelete.images.backgroundImage)
                   fs.unlinkSync(`${myPath}/uploadsP/${backgroundImage}`)
               }

               await User.findByIdAndDelete({_id:notification.senderId._id})

           }
           else  if (notification.receiverId.length === 1){
               await Notification.deleteMany({_id:notification._id})
           }
           else{
               await Notification.updateMany({_id:notification._id},{$pull:{receiverId:userId}},{new:true})
           }
       }

        const updatedUser = await User.findByIdAndUpdate({_id:userId},{notifications:[]},{new:true})


        io.emit('updateUser',updatedUser)


       return res.status(200).json(updatedUser)

    }catch (error) {
        console.error(error)
        return res.status(500).json({ error: error.message });
    }

}

module.exports = {
    updateInfo,
    changePassword,
    deleteUser,
    getUser,
    clearAll
}
