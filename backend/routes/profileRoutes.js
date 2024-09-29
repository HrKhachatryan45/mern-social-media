const express = require('express');
const {addFollowing, getFollower, addPost, getMyPosts, getAllPosts, likePost, unlikePost, removeFollowing,
    addNewComment, getHashtags, removePost, getSuggestedUsers, changeIsRead, getPost
} = require("../controllers/profileController");
const router = express.Router();
const multer = require("multer");
const protectRoute = require("../middleware/protectRoute");
const path = require('path')
const __dirname = path.resolve()
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(path.join(__dirname,'backend/'), 'uploads/');
    },
    filename: (req, file, cb) => {
        const date = new Date().getTime()
        const uniqueName =date + file.originalname
        cb(null,uniqueName)
    }
})

const upload = multer({storage:storage})

router.patch('/addFollowing/:id',protectRoute,addFollowing)
router.get('/follower/:id',getFollower)
router.patch('/removeFollowing/:id',protectRoute,removeFollowing)
router.post('/post',protectRoute, upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }]),addPost)
router.get('/getAllPosts',getAllPosts)
router.patch('/likePost/:postId',protectRoute,likePost)
router.patch('/unlikePost/:postId',protectRoute,unlikePost)
router.post('/newComment/:postId',protectRoute,addNewComment)
router.get('/trending-hashtags',getHashtags)
router.delete('/removePost/:postId',protectRoute,removePost)
router.get('/suggested-users',protectRoute,getSuggestedUsers)
router.patch('/isRead',protectRoute,changeIsRead)
router.get('/getPost/:postId',getPost)

module.exports = router