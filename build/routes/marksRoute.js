"use strict";
const MarksApiController = require('../controller/marksApiController');
var middleware = require('../middleware/emailAuthMiddleware');
var VerifyAuth = middleware.verifyAuthUser;
var router = require("express").Router();
// Create a Marks of a student in a subject
router.post("/marks/student/:id/:subject", VerifyAuth, MarksApiController.createMark);
// // Update Marks of a student in a subject
router.put('/marks/student/:id/subject', VerifyAuth, MarksApiController.updateMark);
module.exports = router;
