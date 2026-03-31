const User = require("../models/user.model")

const setChoices = async(req , res) =>{
    try{
        const user = await User.findById(req.user._id)

        if(!user) return res.status(400).json({message: "Unauthorized"})

        user.choices = [...req.body]
        await user.save()

        res.status(200).json({message: "Choices set successfully" , choices: user.choices})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

module.exports = {setChoices}