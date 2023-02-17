import { Response, Request } from "express";

const db = require('../models/index')
let Subject = db.subject;

// Create a new Subject
const createSubject = async (req: any, res: Response) => {
    try {

        const { name, code } = req.body;

        const subject = await Subject.create({
            name: name,
            code: code
        });
        // console.log(subject)
        res.status(200).json({
            message: "Subject Created",
            dataSubject: subject 
        })

    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}


// View all created Subjects 
const getAllSubject = async (req: any, res: Response) => {

    const allSubject = await Subject.findAll();
    res.status(200).json({
        msg: "List of all Subjects",
        data: allSubject
    })
}


// Update Subject
const updateSubject = async (req: any, res: Response) => {
    try {
        const { name, code } = req.body;

        const SubjectId = req.params.id
        await Subject.update({
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
        })

    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");

    }

}

// Delete Subject
const deleteSubject = async (req: any, res: Response) => {
    try {
        const SubjectId = req.params.id
        await Subject.destroy({
            where: {
                id: SubjectId
            }
        });

        res.status(200).json({
            msg: "Deleted",
            id: SubjectId
        })
    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");

    }
}


// get all subject belongs to a student 
const getStudentSubject = async (req: any, res: Response) => {
    try {
        const studentId = req.params.id
        console.log(studentId)
        const getSubjectStd = await db.sequelize.query(`SELECT * from public.get_student_data(:id)`, {
            replacements: { id: studentId },
            type: db.sequelize.QueryTypes.SELECT
        });
        

        const transformedData = {
            id: getSubjectStd[0].id,
            name: getSubjectStd[0].name,
            email: getSubjectStd[0].email,
            phone: getSubjectStd[0].phone,
            address: getSubjectStd[0].address,
            subjects: getSubjectStd.map((item: { subject_id: any; subject_name: any; subject_code: any; }) => ({
                id: item.subject_id,
                name: item.subject_name,
                code: item.subject_code
            }))
        };


        res.status(200).json(transformedData);

    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");

    }
}

module.exports = {
    createSubject, getAllSubject, updateSubject, deleteSubject, getStudentSubject
}