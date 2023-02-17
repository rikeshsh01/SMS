const StudentApiController = require('../controller/studentApiController');
var middleware = require('../middleware/emailAuthMiddleware')
var VerifyAuth = middleware.verifyAuthUser;

var router = require("express").Router();

// View all student list
router.get('/student/',VerifyAuth, StudentApiController.getAllStudent)

// Create a Student 
router.post('/student',VerifyAuth, StudentApiController.createStudent)

// Update a Student 
router.put('/student/:id', VerifyAuth,  StudentApiController.updateStudent)

// Delete a Student
router.delete('/student/:id',VerifyAuth,StudentApiController.deleteStudent)


//Get Student detail by id
router.get('/student/:id',VerifyAuth, StudentApiController.getStudentById)


// // filter students record with page,perPage,search,orderBy, OrderDirection
router.get('/filter/student/', StudentApiController.sortSearchFilter)


// Student result 
router.get('/student/:id/result',VerifyAuth, StudentApiController.getStudentResult)


// send result to the student email
router.get('/mail/:id',VerifyAuth,  StudentApiController.sendMail)



module.exports = router 