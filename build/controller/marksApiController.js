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
let Mark = db.mark;
let Subject = db.subject;
// Create a new Mark
const createMark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stud_id = req.params.id;
        const sub_name = req.params.subject;
        const marks = req.body.marks;
        console.log(sub_name);
        const subject_id = yield Subject.findOne({
            where: {
                name: sub_name
            },
            attributes: ['id']
        });
        // res.json(subject_id)
        const mark = yield Mark.create({
            marks: marks,
            studentid: stud_id,
            subjectid: subject_id.id
        });
        console.log(Mark);
        res.status(200).json({
            message: "Mark Created",
            dataMark: { mark }
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// Update Mark data
const updateMark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stud_id = req.params.id;
        const sub_name = req.params.subject;
        const marks = req.body.marks;
        const subject_id = yield Subject.findOne({
            where: {
                name: sub_name
            },
            attributes: ['id']
        });
        console.log(subject_id.id);
        yield Mark.update({
            marks: marks
        }, {
            where: {
                subjectid: subject_id.id,
                studentid: stud_id
            }
        });
        res.status(200).json({
            message: "Marks updated successfully",
            student_id: stud_id,
            subject_name: sub_name
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
const addMarksDBFn = (studentId, subjectName, marks) => __awaiter(void 0, void 0, void 0, function* () {
    let addMarks = yield db.sequelize.query(`SELECT * from public.add_student_marks(:studentid, :subjectid, :marks)`, {
        replacements: { studentid: studentId, subjectid: subjectName, marks: marks },
        type: db.sequelize.QueryTypes.SELECT
    });
    console.log(addMarks);
    return addMarks;
});
const addMarksDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let stud_id = req.params.id;
    let subject_name = req.params.subject;
    let marks = req.body.marks;
    const addMarks = yield addMarksDBFn(stud_id, subject_name, marks);
    console.log(addMarks);
});
module.exports = {
    createMark, updateMark,
};
