const MarksApiController = require('../controller/marksApiController');
var userMiddleware = require('../middleware/userMiddleware');
var VerifyUser = userMiddleware.verifyUser;

var router = require("express").Router();

// Create a Marks
router.post("/students/:id/:subject",VerifyUser,  MarksApiController.createMark); 

// // Update Marks
router.put('/students/:id/subject', VerifyUser,MarksApiController.updateMark);

module.exports = router 