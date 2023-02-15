"use strict";
const authUserApiController = require('../controller/authUserApiController');
var userMiddleware = require('../middleware/userMiddleware');
var VerifyUser = userMiddleware.verifyUser;
var router = require("express").Router();
// Auth User with jwt
router.post('/login/jwt', authUserApiController.authUserJWT);
// Auth User with jwt
router.post('/login/nojwt', authUserApiController.authUserNoJWT);
module.exports = router;
