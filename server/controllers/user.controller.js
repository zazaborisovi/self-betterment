const User = require("../models/user.model")

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) return res.status(404).json({ message: "user not found" })
        
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

module.exports = { getUserProfile }