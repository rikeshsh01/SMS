"use strict";
const StudentApiController = require('../controller/studentApiController');
var userMiddleware = require('../middleware/userMiddleware');
var VerifyUser = userMiddleware.verifyUser;
var router = require("express").Router();
// Create a new User
router.post("/student", VerifyUser, StudentApiController.createStudent);
// Read all User 
router.get('/student/', VerifyUser, StudentApiController.getAllStudent);
// Update User
router.put('/student/:id', VerifyUser, StudentApiController.updateStudent);
// Delete User
router.delete('/student/:id', VerifyUser, StudentApiController.deleteStudent);
// Read all User 
router.get('/student/:id', VerifyUser, StudentApiController.getStudentById);
router.get('/student/:id/result', VerifyUser, StudentApiController.getStudentReport);
router.get('/filter/', VerifyUser, StudentApiController.sortSearchFilter);
router.get('/student/:id/marks', VerifyUser, StudentApiController.getMarksFn);
router.post('/studentfn', StudentApiController.addStudentFn);
router.put('/studentfn/:id', StudentApiController.updateStudentFn);
module.exports = router;
