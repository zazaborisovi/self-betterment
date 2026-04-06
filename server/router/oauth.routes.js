const oauthRouter = require("express").Router();
const { getGoogleAuthUrl , googleCallback } = require("../controllers/oauth.controller");

oauthRouter.get("/google/auth", getGoogleAuthUrl);
oauthRouter.get("/google/callback", googleCallback);

module.exports = oauthRouter;