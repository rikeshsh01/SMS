const SubjectApiController = require('../controller/subjectApiController');
var middleware = require('../middleware/emailAuthMiddleware')
var VerifyAuth = middleware.verifyAuthUser;

var router = require("express").Router();

// Create a new Subject
router.post("/subject",VerifyAuth,  SubjectApiController.createSubject); 

// View all available subject
router.get('/subject/',VerifyAuth, SubjectApiController.getAllSubject)

// Update Subject
router.put('/subject/:id',VerifyAuth,SubjectApiController.updateSubject)

// Delete Subject
router.delete('/subject/:id',VerifyAuth,SubjectApiController.deleteSubject)


// get all subject belongs to a student 
router.get('/subject/student/:id',VerifyAuth, SubjectApiController.getStudentSubject)

module.exports = router 