const express = require('express');
const {updateInfo, changePassword, deleteUser, getUser, clearAll} = require("../controllers/settingsController");
const router = express.Router();
const multer = require("multer");
const protectRoute = require("../middleware/protectRoute");


const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../cloudinary'); // Assuming you've set up Cloudinary config

// Configure Multer to use Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploadsP',
        allowed_formats: [
            'jpg',
            'jpeg',
            'png',
            'gif',
            'webp',
            'svg',
            'bmp',
            'tiff',
            'ico'
        ],
        resource_type: 'auto', // This allows both image and video upload
        public_id: (req, file) => {
            const date = new Date().getTime();
            const uniqueName = date + '-' + file.originalname.split('.')[0];
            return uniqueName; // The name of the file in Cloudinary
        },
    },
});


const upload = multer({storage:storage})

router.patch('/updateInfo',protectRoute,upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]),updateInfo)
router.patch('/changePassword',protectRoute,changePassword)
router.delete('/deleteUser',protectRoute,deleteUser)
router.get('/user/:userId',getUser)
router.delete('/clearAllNotifications',protectRoute,clearAll)

module.exports = router