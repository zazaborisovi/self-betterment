const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const validator = require("validator")
const {calculateRank , maxXpCalculator , calculateSkillRank, maxSkillXpCalculator} = require("../utils/rankCalculator")

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true , "email is required"],
        unique: [true , "email is already in use"],
        validate: [validator.isEmail, "Please provide a valid email"]
    },
    username: {
        type: String,
        required: [true , "username is required"],

    },
    password: {
        type: String,
        required: [true , "password is required"],
        minlength: [8 , "password must be at least 8 characters long"],
        select: false
    },
    profilePicture: {
        url: {
            type: String,
            default: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/q_auto/f_auto/v1776378658/default.jpg`
        },
        publicId: {
            type: String,
            default: "profile_pictures/default"
        }
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
        current: {type: Number, default: 0},
        max: {type: Number, default: 1000}
    },
    coins:{
        type: Number,
        default: 0
    },
    skills:{
        body: {
            xp: {current: {type: Number , default: 0} , max: {type: Number , default: 1000}},
            rank: {type: String , default: "F"}
        },
        mind: {
            xp: {current: {type: Number , default: 0} , max: {type: Number , default: 1000}},
            rank: {type: String , default: "F"}
        },
        soul: {
            xp: {current: {type: Number , default: 0} , max: {type: Number , default: 1000}},
            rank: {type: String , default: "F"}
        }
    },
    choices:[{
        type: String
    }],
    streak: {
        currentStreak: {type: Number, default: 0},
        longestStreak: {type: Number, default: 0},
        lastCompletedDate: {type: Date, default: new Date().toISOString()}
    }
}, {timestamps: true})

UserSchema.pre("save", async function(){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10)
    }

    if(this.isModified("xp")){
        this.rank = calculateRank(this.xp.current)
        this.xp.max = maxXpCalculator(this.rank)
    }

    ["body", "mind", "soul"].forEach(skill =>{
        if(this.isModified(`skills.${skill}.xp`)){
            this.skills[skill].rank = calculateSkillRank(this.skills[skill].xp.current)
            this.skills[skill].xp.max = maxSkillXpCalculator(this.skills[skill].rank)
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