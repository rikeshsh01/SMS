const userApiController = require('../controller/userApiController');
var middleware = require('../middleware/emailAuthMiddleware')
var VerifyAuth = middleware.verifyAuthUser;



var router = require("express").Router();

// Create a new User
router.post("/user", userApiController.createUser); 

// View all User 
router.get('/user/',VerifyAuth, userApiController.getAllUser)

// Update User
router.put('/user/:id',VerifyAuth,userApiController.updateUser)

// Delete User
router.delete('/user/:id',VerifyAuth,userApiController.deleteUser)


module.exports = router 