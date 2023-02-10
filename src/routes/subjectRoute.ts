const SubjectApiController = require('../controller/subjectApiController');
var userMiddleware = require('../middleware/userMiddleware');
var VerifyUser = userMiddleware.verifyUser;

var router = require("express").Router();

// Create a new User
router.post("/subject",VerifyUser,  SubjectApiController.createSubject); 

// Read all User 
router.get('/subject/',VerifyUser, SubjectApiController.getAllSubject)

// Update User
router.put('/subject/:id',SubjectApiController.updateSubject)

// Delete User
router.delete('/subject/:id',VerifyUser,SubjectApiController.deleteSubject)

router.get('/subject/student/:id',VerifyUser, SubjectApiController.getStudentSubject)

module.exports = router 