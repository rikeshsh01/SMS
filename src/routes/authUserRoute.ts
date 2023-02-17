const authUserApiController = require('../controller/authUserApiController')



var router = require("express").Router();

// Auth User with jwt
router.post('auth/login/jwt',authUserApiController.authUserJWT)


module.exports = router 