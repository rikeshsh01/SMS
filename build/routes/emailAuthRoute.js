"use strict";
const loginApiController = require('../controller/loginApiController');
var middleware = require('../middleware/emailAuthMiddleware');
var VerifyAuth = middleware.verifyAuthUser;
var router = require("express").Router();
// send email verification token in email 
router.post('/login/emailauthentication', loginApiController.sendToEmail);
// Verify the token sent to email 
router.post('/login/emailauthentication/:token', loginApiController.verifyEmailLink);
// Clear user session/ logout 
router.post('/logout/emailauthentication/', VerifyAuth, loginApiController.logOut);
module.exports = router;
