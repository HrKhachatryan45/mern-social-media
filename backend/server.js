const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const {app,server} = require('./socket/socket');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const settingsRoutes = require('./routes/settingsRoutes')
const messageRoutes = require('./routes/messageRoutes');
app.use(cors())
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json());
const cloudinary = require('./cloudinary'); // Assuming you've set up Cloudinary config

const __name = path.resolve()

app.use(express.static(path.join(__name, "frontend", "build")));



app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})
app.use('/api/auth',authRoutes)
app.use('/api/profile',profileRoutes)
app.use('/api/settings',settingsRoutes)
app.use('/api/messages',messageRoutes)


app.get("*", (req, res) => {
    res.sendFile(path.join(__name,"frontend","build","index.html"));
})

const port = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,  // This option can now be removed as it's deprecated
})
    .then(() => {
        console.log('MongoDB connected!')
        server.listen(port, () => {
            console.log(`Running on port ${port}`);
        })
    })
    .catch((err) => {
        console.error('MongoDB error:', err)
    })
