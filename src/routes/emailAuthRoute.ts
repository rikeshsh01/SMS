const loginApiController = require('../controller/loginApiController');
var userMiddleware = require('../middleware/userMiddleware')
var VerifyUser = userMiddleware.verifyUser;



var router = require("express").Router();

router.post('/login/emailauthentication',loginApiController.login)

router.post('/login/emailauthentication/:token',loginApiController.verifyEmailLink)

module.exports = router 