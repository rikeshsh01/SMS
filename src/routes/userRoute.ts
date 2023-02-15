const userApiController = require('../controller/userApiController');
var userMiddleware = require('../middleware/userMiddleware')
var VerifyUser = userMiddleware.verifyUser;



var router = require("express").Router();

// Create a new User
router.post("/user", userApiController.createUser); 

// Read all User 
router.get('/user/',VerifyUser, userApiController.getAllUser)

// Update User
router.put('/user/:id',VerifyUser,userApiController.updateUser)

// Delete User
router.delete('/user/:id',VerifyUser,userApiController.deleteUser)


module.exports = router 