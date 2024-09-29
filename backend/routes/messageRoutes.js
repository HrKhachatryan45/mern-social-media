const express = require('express');
const {sendNewMessage, getAllMessages, getUsersForSideBar, reactToMessage, deleteReaction, deleteMessage,
    deleteMessages, sendSharedMessage
} = require("../controllers/messageController");
const router = express.Router();
const protectRoute = require("../middleware/protectRoute");
const multer = require("multer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'backend/uploadsM/');
    },
    filename:function (req,file,cb){
        const date = new Date().getTime()
        const uniqueName =date + file.originalname
        cb(null,uniqueName)
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