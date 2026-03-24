const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const protect = async(req , res , next) =>{
    try{
        const token = req.cookies[process.env.COOKIE_NAME]

        if(!token){
            return res.status(401).json({message: "Unauthorized"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded) return res.status(401).json({message: "Unauthorized"})

        req.user = await User.findById(decoded._id)

        next()
    }catch(err){
        return res.status(500).json({message: err.message})
    }
}

module.exports = protect