const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const {calculateRank , calculateSkillRank} = require("../utils/rankCalculator")

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true , "email is required"],
        unique: [true , "email is already in use"]
    },
    username: {
        type: String,
        required: [true , "username is required"],
        unique: [true , "username is already in use"]
    },
    password: {
        type: String,
        required: [true , "password is required"],
        minlength: [8 , "password must be at least 8 characters long"],
        select: false
    },
    role:{
        type: [String],
        enum: ["user" , "admin"],
        default: ["user"]
    },
    rank:{ // S+ A B C D F
        type: String,
        default: "F"
    },
    xp:{
        type: Number,
        default: 0
    },
    coins:{
        type: Number,
        default: 0
    },
    items:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Items"
    }],
    skills:{
        body: {xp: {type: Number, default: 0}, rank: {type: String , default: "F"}},
        mind: {xp: {type: Number, default: 0}, rank: {type: String , default: "F"}},
        soul: {xp: {type: Number, default: 0}, rank: {type: String , default: "F"}}
    },
    choices:[{
        type: String
    }]
    
}, {timestamps: true})

UserSchema.pre("save", async function(){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }

    if(this.isModified("xp")){
        this.rank = calculateRank(this.xp)
    }

    ["body", "mind", "soul"].forEach(skill =>{
        if(this.isModified(`skills.${skill}.xp`)){
            this.skills[skill].rank = calculateSkillRank(this.skills[skill].xp)
        }
    })
    
    return
})

UserSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password)
}

UserSchema.methods.generateToken = function(){
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN})
}

const User = mongoose.model("User", UserSchema)

module.exports = User