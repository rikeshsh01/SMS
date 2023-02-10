"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const db = require('../models/index');
let Subject = db.subject;
// Create a new Subject
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, code } = req.body;
        const subject = yield Subject.create({
            name: name,
            code: code
        });
        // console.log(subject)
        res.status(200).json({
            message: "Subject Created",
            dataSubject: { Subject }
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// View all created Subjects 
const getAllSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allSubject = yield Subject.findAll();
    res.status(200).json({
        msg: "List of all Subjects",
        data: allSubject
    });
});
// Update Subject data
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, code } = req.body;
        const SubjectId = req.params.id;
        yield Subject.update({
            name: name,
            code: code
        }, {
            where: {
                id: SubjectId
            }
        });
        res.status(200).json({
            msg: "Updated",
            id: SubjectId
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// Delete Subject
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const SubjectId = req.params.id;
        yield Subject.destroy({
            where: {
                id: SubjectId
            }
        });
        res.status(200).json({
            msg: "Deleted",
            id: SubjectId
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// get student subject db function
const getStudentSub = (studentId) => __awaiter(void 0, void 0, void 0, function* () {
    const substd = yield db.sequelize.query(`SELECT * from public.get_student_data(:id)`, {
        replacements: { id: studentId },
        type: db.sequelize.QueryTypes.SELECT
    });
    return substd;
});
const getStudentSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const studentId = req.params.id;
        const getSubjectStd = yield getStudentSub(studentId);
        const transformedData = {
            id: getSubjectStd[0].id,
            name: getSubjectStd[0].name,
            email: getSubjectStd[0].email,
            phone: getSubjectStd[0].phone,
            address: getSubjectStd[0].address,
            subjects: getSubjectStd.map((item) => ({
                id: item.subject_id,
                name: item.subject_name,
                code: item.subject_code
            }))
        };
        res.status(200).json(transformedData);
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = {
    createSubject, getAllSubject, updateSubject, deleteSubject, getStudentSubject
};
