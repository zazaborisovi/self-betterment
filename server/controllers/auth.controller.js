const User = require("../models/user.model")
const createAndSendCookie = require("../middlewares/cookie")

const signUp = async(req , res) =>{
    try{
        const {email , username , password} = req.body

        if(!email || !username || !password){
            return res.status(400).json({message: "all fields are required"})
        }

        const emailInUse = await User.findOne({email})
        
        if(emailInUse){
            return res.status(400).json({message: "email already in use"})
        }

        const usernameInUse = await User.findOne({username})

        if(usernameInUse){
            return res.status(400).json({message: "username already in use"})
        }

        const user = await User.create({email , username , password})

        createAndSendCookie(201 , user , res)
    }catch(err){
        console.error("SIGNUP ERROR:", err)
        res.status(500).json({message: err.message || "An unexpected error occurred during signup"})
    }
} 

const signIn = async(req , res) =>{
    try{
        const {email , password} = req.body
        
        const user = await User.findOne({email}).select("+password")

        if(!user){
            return res.status(400).json({message: "invalid crededntials"})
        }

        const isPasswordValid = await user.comparePassword(password)

        if(!isPasswordValid){
            return res.status(400).json({message: "invalid crededntials"})
        }

        createAndSendCookie(200 , user , res)
    }catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

const autoSignIn = async(req , res) =>{
    res.status(200).json({user: req.user , message: "loaded"})
}

const signOut = async(req , res) =>{
    res.clearCookie(process.env.COOKIE_NAME).json({message: "signed out successfully"})
}

module.exports = {signUp , signIn , signOut , autoSignIn}