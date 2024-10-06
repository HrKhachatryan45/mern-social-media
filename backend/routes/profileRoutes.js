const express = require('express');
const { addFollowing, getFollower, addPost, getMyPosts, getAllPosts, likePost, unlikePost, removeFollowing,
    addNewComment, getHashtags, removePost, getSuggestedUsers, changeIsRead, getPost
} = require("../controllers/profileController");
const router = express.Router();
const multer = require("multer");
const protectRoute = require("../middleware/protectRoute");

const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary'); // Assuming you've set up Cloudinary config

// Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads',
        allowed_formats: [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'webp',
            'svg',
            'bmp',
            'tiff',
            'ico',
            'mp4'
        ],
        resource_type: 'auto', // This allows both image and video upload
        public_id: (req, file) => {
            const date = new Date().getTime();
            const uniqueName = date + '-' + file.originalname.split('.')[0];
            return uniqueName; // The name of the file in Cloudinary
        },
    },
});

const upload = multer({ storage: storage });

router.patch('/addFollowing/:id', protectRoute, addFollowing);
router.get('/follower/:id', getFollower);
router.patch('/removeFollowing/:id', protectRoute, removeFollowing);
router.post('/post', protectRoute, upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }]), addPost);
router.get('/getAllPosts', getAllPosts);
router.patch('/likePost/:postId', protectRoute, likePost);
router.patch('/unlikePost/:postId', protectRoute, unlikePost);
router.post('/newComment/:postId', protectRoute, addNewComment);
router.get('/trending-hashtags', getHashtags);
router.delete('/removePost/:postId', protectRoute, removePost);
router.get('/suggested-users', protectRoute, getSuggestedUsers);
router.patch('/isRead', protectRoute, changeIsRead);
router.get('/getPost/:postId', getPost);

module.exports = router;
