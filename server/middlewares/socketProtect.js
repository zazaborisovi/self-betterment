const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const cookie = require("cookie");

const socketProtect = async (socket, next) => {
    try {
        const rawCookies = socket.handshake.headers.cookie;
        if (!rawCookies) {
            console.log("No cookies found in handshake");
            return next(new Error("Authentication error: No cookies"));
        }

        const parsedCookies = cookie.parse(rawCookies);
        const token = parsedCookies[process.env.COOKIE_NAME]

        if (!token) {
            console.log("No token found in cookies");
            return next(new Error("Authentication error: No token"));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id || decoded?._id).select("-password");

        if (!user) {
            return next(new Error("User not found"));
        }

        socket.request.user = user;
        next();
    } catch (err) {
        console.error("Socket Auth Error:", err.message);
        next(new Error("Unauthorized"));
    }
};

module.exports = socketProtect;