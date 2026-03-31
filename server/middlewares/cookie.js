

const createAndSendCookie = (statusCode , user , res) =>{
    const token = user.generateToken()

    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV == "prod",
        sameSite: "lax",
    }

    user.password = undefined
    
    res.status(statusCode).cookie(process.env.COOKIE_NAME, token, cookieOptions).json({
        message: "Cookie sent successfully",
        user,
        token
    })
}

module.exports = createAndSendCookie