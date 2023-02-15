"use strict";
const loginApiController = require('../controller/loginApiController');
var userMiddleware = require('../middleware/userMiddleware');
var VerifyUser = userMiddleware.verifyUser;
var router = require("express").Router();
router.post('/login/emailauthentication', loginApiController.sendToEmail);
router.post('/login/emailauthentication/:token', loginApiController.verifyEmailLink);
router.post('/logout/emailauthentication/', loginApiController.logOut);
module.exports = router;
