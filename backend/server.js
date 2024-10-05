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
// app.get('/images/:filename', (req, res) => {
//     try {
//         const filename = req.params.filename;
//         const imagePath = path.join(__dirname, 'uploads', filename);
//         res.sendFile(imagePath);
//     } catch (error) {
//         console.error('Error serving image:', error);
//         res.status(500).send('Error serving image');
//     }
// });
// app.get('/profile/images/:filename', (req, res) => {
//     try {
//         const filename = req.params.filename;
//         const imagePath = path.join(__dirname, 'uploadsP', filename);
//         res.sendFile(imagePath);
//     } catch (error) {
//         console.error('Error serving image:', error);
//         res.status(500).send('Error serving image');
//     }
// });
// app.get('/messages/images/:filename', (req, res) => {
//     try {
//         const filename = req.params.filename;
//         const imagePath = path.join(__dirname, 'uploadsM', filename);
//         res.sendFile(imagePath);
//     } catch (error) {
//         console.error('Error serving image:', error);
//         res.status(500).send('Error serving image');
//     }
// });
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use('/profile/images', express.static(path.join(__dirname, 'uploadsP')));
app.use('/messages/images', express.static(path.join(__dirname, 'uploadsM')));


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
