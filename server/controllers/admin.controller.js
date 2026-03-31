const User = require("../models/user.model")

const getAllUsers = async(req , res) =>{
    try{
        const users = await User.find()
        res.status(200).json({success: true, users})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const updateUser = async(req , res) =>{
    try{
        const {id} = req.params
        const {update} = req.body
    
        const user = await User.findById(id)
    
        if(!user) return res.status(400).json({message: "User not found"})
    
        user = {...user , ...update}
    
        await user.save()
    
        res.status(200).json({message: "User updated successfully" , user})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

const deleteUser = async(req , res) =>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.status(404).json({message: "User not found"})

        res.status(200).json({message: "User deleted successfully"})
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

module.exports = {getAllUsers , updateUser , deleteUser}