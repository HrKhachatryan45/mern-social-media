const express = require('express');
const {sendNewMessage, getAllMessages, getUsersForSideBar, reactToMessage, deleteReaction, deleteMessage,
    deleteMessages, sendSharedMessage
} = require("../controllers/messageController");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const multer = require("multer");
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const cloudinary = require('../cloudinary');



const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploadsM',
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
            'mp4',
            'mp3',
            'wav',
            'ogg',
            'aac'
        ],
        resource_type: 'auto', // This allows both image and video upload
        public_id: (req, file) => {
            const date = new Date().getTime();
            const uniqueName = date + '-' + file.originalname.split('.')[0];
            return uniqueName; // The name of the file in Cloudinary
        },
    }
})

const upload = multer({storage:storage})

router.post('/newMessage/:id',protectRoute,upload.fields([{name:'photos',maxCount:3},{name:'videos',maxCount:3},{name:'audio',maxCount: 1}]),sendNewMessage)
router.get('/userMessages/:id',protectRoute,getAllMessages)
router.post('/newSharedMessage/',protectRoute,sendSharedMessage)
router.get('/getAllUsers',protectRoute,getUsersForSideBar)
router.patch('/reactToMessage/:messageId',protectRoute,reactToMessage)
router.patch('/deleteReaction/:messageId',protectRoute,deleteReaction)
router.delete('/deleteMessage/:messageId',protectRoute,deleteMessage)
router.delete('/deleteMessages',protectRoute,deleteMessages)
module.exports = router