const User = require("../models/user.model")
const {uploadImage} = require("../utils/images")

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user) return res.status(404).json({ message: "user not found" })
        
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const changeProfilePicture = async (req, res) => {
  try {
    const file = req.file;
    const user = req.user;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const publicId = `profile_pictures/${user._id}`;

    const uploadPhoto = await uploadImage(file.buffer, publicId);

    if (!uploadPhoto || uploadPhoto.error)
      return res.status(400).json({ message: "Error uploading image" + uploadPhoto.error });

    user.profilePicture.url = uploadPhoto.secure_url;
    
    await user.save();

    res.status(200).json({ message: "Profile picture updated successfully", updatedUser: user });
  } catch (err) {
    throw new Error(err.message)
  }
}

module.exports = { getUserProfile , changeProfilePicture}