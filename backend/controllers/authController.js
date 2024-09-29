const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");


const loginUser = async (req, res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username})
            .populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])

        const match =await bcrypt.compare(password,user?.password || '')
        if (!match || !user){
            return res.status(404).json({error:"Invalid password or username"})
        }
        if (user && user.isDeleted === true){
            return res.status(401).json({error:"No user found"})
        }
        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn: "15d"})
        user.lastActivity = new Date();
        res.cookie('jwt', token, {
            maxAge: 15 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV !== 'development',
        })
        console.log(token,'token')

        await user.save()

        return res.status(200).json(user)
    }catch (error) {
        return res.status(500).json({error:error.message});
    }

}

const signupUser = async (req, res) => {
    const {fullName,username,email,password,confirmPassword} = req.body
    try {
        const user1 = await User.findOne({username})
        const user2 = await User.findOne({email})

        if (user1){
            return res.status(400).json({error: 'Username already exists'});
        }

        if (user2){
            return res.status(400).json({error: 'Email already in use'});
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({error:'Email is not valid '})
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({error:'Password is not strong enough'})
        }
        if (password !== confirmPassword) {
            return res.status(400).json({error:'Passwords do not match'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)



        const images2={
            profileImage:'https://cdn-icons-png.freepik.com/256/3177/3177440.png?semt=ais_hybrid',
            backgroundImage:' https://img.freepik.com/free-vector/blue-wave-background-banner-modern-design_677411-1279.jpg?t=st=1715420712~exp=1715424312~hmac=6549150db281add14a76f2cca0f3e4852b603dc6cc7bbaa32e37c4905f963194&w=826'
        }

        const user = new User({
            fullName,
            username,
            email,
            password:hashedPassword,
            images:images2,
            isRead:false,
            isDeleted:false,
            lastActivity: new Date()
        })
        if (user) {
            const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET, {expiresIn: '15d'})
            console.log(token)
            res.cookie('jwt', token, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV !== 'development',
            })
            await user.save()
            const populatedUser = await user
                .populate([{path: 'notifications',populate:[{path: 'senderId'},{path: 'postId'}]}])

            return res.status(200).json(populatedUser)
        }else {
            return res.status(400).json({error:'Invalid userData'})
}
    }catch (error) {
        return res.status(500).json({error:error.message});
    }


}

const logoutUser = async (req,res)=>{
    try {
        res.status(200).json({msg:'User successfully logged out'})
    }catch (error) {
        return res.status(500).json({error:error.message});
    }
}
module.exports = {
    loginUser,
    signupUser,
    logoutUser
}