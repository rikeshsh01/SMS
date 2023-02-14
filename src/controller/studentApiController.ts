import { Response, Request } from "express";
const nodemailer = require("nodemailer");

const db = require('../models/index')
let Student = db.student;

// Create a new Student
const createStudent = async (req: any, res: Response) => {
    try {

        const { name, email, phone, address } = req.body;

        const student = await Student.create({
            email: email,
            phone: phone,
            address: address,
            name: name
        });
        res.status(200).json({
            message: "Student Created",
            dataStudent: { student }
        })

    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}


// View all created Students 
const getAllStudent = async (req: any, res: Response) => {

    const allStudent = await Student.findAll();
    res.status(200).json({
        msg: "List of all Students",
        data: allStudent
    })

}


// Update Student data
const updateStudent = async (req: any, res: Response) => {
    try {
        const { name, email, phone, address } = req.body;

        const StudentId = req.params.id
        await Student.update({
            email: email,
            phone: phone,
            address: address,
            name: name
        }, {
            where: {
                id: StudentId
            }
        });

        res.status(200).json({
            msg: "Updated",
            id: StudentId
        })

        // }

    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");

    }

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



        // }
    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");

    }
}

const getStudentById = async (req: any, res: Response) => {
    console.log(req.params.id)

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

    //   console.log(transformedData);

    res.json(transformedData);
}

const getStudentReport = async (req: any, res: Response) => {

    console.log(req.params.id)

    const studentDetails = await db.student.findByPk(req.params.id, {
        include: [{
            model: db.mark,
            as: 'subjects',
            include: [{
                model: db.subject
            }]
        }]
    });

    const { subjects } = studentDetails;
    const results = subjects.map((item: { subject: any, marks: any }) => ({
        subject: item.subject.name,
        marks: item.marks
    }))
    res.json(results)
    //   res.json(subjects)
}



// db function 

const getStudentMarksDbFn = async (pageNumber: number, pageLimit: number, searchString: string, orderBy: string, orderDirection: string) => {

    const studs = await db.sequelize.query(`SELECT * from public.get_all_students(:page_number, :page_limit, :search_string, :order_by, :order_direction)`, {
        replacements: { page_number: pageNumber, page_limit: pageLimit, search_string: searchString, order_by: orderBy, order_direction: orderDirection },
        type: db.sequelize.QueryTypes.SELECT
    });
    console.log(studs)
    return studs;
}


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

        const sortFilter = await getStudentMarksDbFn(page, perPage, search_string, order_by, order_direction);

        res.status(200).json(sortFilter)

    } catch (error) {
        res.status(501).send({ error: "Internal Server ERROR" })
    }
}

const addStudentDbFn = async (s_name: string, s_email: string, s_phone: string, s_address: string) => {
    const stud = await db.sequelize.query(`select * from add_student(:p_name,:p_email,:p_phone,:p_address)`, {
        replacements: { p_name: s_name, p_email: s_email, p_phone: s_phone, p_address: s_address },
        type: db.sequelize.QueryTypes.SELECT
    });
    // console.log(s_name)
    return stud;
}

const addStudentFn = async (req: any, res: Response) => {
    const { name, email, phone, address } = req.body;

    const addStud = await addStudentDbFn(name, email, phone, address);
    console.log(addStud)
    res.json(addStud)
}

const updateStudentDbFn = async (s_id: number, s_name: string, s_email: string, s_phone: string, s_address: string) => {
    const stud = await db.sequelize.query(`select * from update_student(:p_id,:p_name,:p_email,:p_phone,:p_address)`, {
        replacements: { p_id: s_id, p_name: s_name, p_email: s_email, p_phone: s_phone, p_address: s_address },
        type: db.sequelize.QueryTypes.SELECT
    });
    console.log(s_name)
    return stud;
}


const updateStudentFn = async (req: any, res: Response) => {
    let id = req.params.id;
    const { name, email, phone, address } = req.body;

    const updateStud = await updateStudentDbFn(id, name, email, phone, address);
    console.log(updateStud)
    res.json(updateStud)
}




// result of student 

const getResult = async (studId: number) => {
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

const getMarksFn = async (req: any, res: Response) => {
    try {
        const stud_id = req.params.id;
        const getSubjectMarks = await getResult(stud_id);
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
    let authUserId = req.authUserId;

    let userDetail = await db.user.findByPk(authUserId);
    // console.log(userDetail)

    let studentDetail = await db.student.findByPk(student_id);
    // console.log(studentDetail)

    const getSubjectMarks = await getResult(student_id);

    console.log(getSubjectMarks)
    // connect with smpt 
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'serenity.donnelly43@ethereal.email',
            pass: 'NG5JvCbDaUa4jSYuUN'
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
    createStudent, getAllStudent, updateStudent, deleteStudent, getStudentById, getStudentReport, sortSearchFilter, getMarksFn, addStudentFn, updateStudentFn, sendMail
}