import { Response, Request } from "express";
const nodemailer = require("nodemailer");

const db = require('../models/index')
let Student = db.student;


// View all created Students 
const getAllStudent = async (req: any, res: Response) => {

    const allStudent = await Student.findAll();
    res.status(200).json({
        msg: "List of all Students",
        data: allStudent
    })

}

// Delete Student
const deleteStudent = async (req: any, res: Response) => {
    try {
        const StudentId = req.params.id
        await Student.destroy({
            where: {
                id: StudentId
            }
        });

        res.status(200).json({
            msg: "Deleted",
            id: StudentId
        })

    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");

    }
}

// view student by id 
const getStudentById = async (req: any, res: Response) => {
    // console.log(req.params.id)

    const studentDetails = await db.student.findByPk(req.params.id, {
        include: [{
            model: db.mark,
            as: 'subjects',
            include: [{
                model: db.subject
            }]
        }]
    });

    if (!studentDetails) {
        return res.status(404).send({ error: 'Student not found' });
    }

    const transformedData = {
        id: studentDetails.id,
        name: studentDetails.name,
        email: studentDetails.email,
        phone: studentDetails.phone,
        address: studentDetails.address,
        subjects: studentDetails.subjects.map((item: { subject: { id: any; name: any; code: any; } }) => ({
            id: item.subject.id,
            name: item.subject.name,
            code: item.subject.code
        }))
    };

    res.json(transformedData);
}

// filter students with page,perPage,search,orderBy, OrderDirection 

const sortSearchFilter = async (req: any, res: Response) => {
    try {
        // console.log("Hello")
        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.perPage) || 10;
        const search_string = req.query.search ? req.query.search : "";
        const order_by = req.query.orderBy ? req.query.orderBy : "name"
        const order_direction = req.query.orderDirection ? req.query.orderDirection : 'asc';
        console.log(page, "page")
        console.log(perPage, "perPage")
        console.log(search_string, "search_string")
        console.log(order_by, "order_by")
        console.log(order_direction, "order_direction")

        const sortFilter = await db.sequelize.query(`SELECT * from public.get_all_students(:page_number, :page_limit, :search_string, :order_by, :order_direction)`, {
            replacements: { page_number: page, page_limit: perPage, search_string: search_string, order_by: order_by, order_direction: order_direction },
            type: db.sequelize.QueryTypes.SELECT
        });

        res.status(200).json(sortFilter)

    } catch (error) {
        res.status(501).send({ error: "Internal Server ERROR" })
    }
}
  
// Create new Student 
const createStudent = async (req: any, res: Response) => {
    const { name, email, phone, address } = req.body;

    const addStud = await db.sequelize.query(`select * from add_student(:p_name,:p_email,:p_phone,:p_address)`, {
        replacements: { p_name: name, p_email: email, p_phone: phone, p_address: address },
        type: db.sequelize.QueryTypes.SELECT
    });
    // console.log(addStud)
    res.json(addStud)
}


// Update existing student
const updateStudent = async (req: any, res: Response) => {
    let id = req.params.id;
    const { name, email, phone, address } = req.body;

    const updateStud = await db.sequelize.query(`select * from update_student(:p_id,:p_name,:p_email,:p_phone,:p_address)`, {
        replacements: { p_id: id, p_name: name, p_email: email, p_phone: phone, p_address: address },
        type: db.sequelize.QueryTypes.SELECT
    });
    // console.log(updateStud)
    res.json(updateStud)
}




// result of a student 
const getResultfn = async (studId: number) => {
    const marks = await db.sequelize.query(`SELECT * from public.get_student_marks(:id)`, {
        replacements: { id: studId },
        type: db.sequelize.QueryTypes.SELECT
    });

    interface SubjectMarks {
        subject_name: string;
        marks: number;
    }
    const subjectMarks: SubjectMarks[] = marks;

    const studentResult = subjectMarks.map(subject => {
        const subjectName = subject.subject_name;
        const marks = subject.marks;
        return { [subjectName]: marks };
    });

    return studentResult;
}

const getStudentResult = async (req: any, res: Response) => {
    try {
        const stud_id = req.params.id;
        const getSubjectMarks = await getResultfn(stud_id);
        // console.log(getSubjectMarks)

        // console.log(studentResult)
        res.status(200).json(getSubjectMarks)

    } catch (error) {
        res.status(501).send({ error: "Internal Server ERROR" })
    }
}




// sending mail to the student by logged in user
const sendMail = async (req: any, res: any) => {

    let student_id = req.params.id;
    let authUserId = req.userId;

    let userDetail = await db.user.findByPk(authUserId);
    // console.log(userDetail)

    let studentDetail = await db.student.findByPk(student_id);
    // console.log(studentDetail)

    const getSubjectMarks = await getResultfn(student_id);

    console.log(getSubjectMarks)
    // connect with smpt 
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'cullen79@ethereal.email',
            pass: 'XCUhzqWZkBNuFpKP9t'
        }
    });


    // send mail with defined transport object
    let resultData = getSubjectMarks.map(item => Object.keys(item)[0] + " : " + Object.values(item)[0]).join("<br>");
    let info = await transporter.sendMail({
        from: `${userDetail.name} <${userDetail.email}>`,
        to: `${studentDetail.email}`,
        subject: `Result of ${studentDetail.name}`,
        text: resultData,
        html: `<b>Results:</b><br>${resultData}`,
    });
    

    res.json({
        msg: "sending mail",
        data: info
    })
}



module.exports = {
 getAllStudent, updateStudent, deleteStudent, getStudentById, sortSearchFilter, getStudentResult, createStudent, sendMail
}