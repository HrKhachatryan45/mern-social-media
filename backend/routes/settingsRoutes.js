const express = require('express');
const {updateInfo, changePassword, deleteUser, getUser, clearAll} = require("../controllers/settingsController");
const router = express.Router();
const multer = require("multer");
const protectRoute = require("../middleware/protectRoute");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "backend/uploadsP/");
    },
    filename:function (req,file,cb){
        const date = new Date().getTime()
        const uniqueName =date + file.originalname
        cb(null,uniqueName)
    }
})
const upload = multer({storage:storage})

router.patch('/updateInfo',protectRoute,upload.fields([{ name: 'profileImage', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]),updateInfo)
router.patch('/changePassword',protectRoute,changePassword)
router.delete('/deleteUser',protectRoute,deleteUser)
router.get('/user/:userId',getUser)
router.delete('/clearAllNotifications',protectRoute,clearAll)

module.exports = router