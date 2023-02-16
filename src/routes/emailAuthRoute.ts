const loginApiController = require('../controller/loginApiController');
var middleware = require('../middleware/emailAuthMiddleware')
var VerifyAuth = middleware.verifyAuthUser;



var router = require("express").Router();

router.post('/login/emailauthentication',loginApiController.sendToEmail)

router.post('/login/emailauthentication/:token',loginApiController.verifyEmailLink);

router.post('/logout/emailauthentication/',VerifyAuth,loginApiController.logOut)

module.exports = router 