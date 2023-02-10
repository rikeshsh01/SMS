import { Response, Request } from "express";

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



const gettMarksDbFn = async (studId:number)=>{
    const marks = await db.sequelize.query(`SELECT * from public.get_student_marks(:id)`, {
        replacements: { id: studId},
        type: db.sequelize.QueryTypes.SELECT
    });
    // console.log(marks)
    return marks;
}

const getMarksFn = async (req: any, res: Response) => {
    try {
        const stud_id = req.params.id;
        const getSubjectMarks = await gettMarksDbFn(stud_id);

        res.status(200).json(getSubjectMarks)

    } catch (error) {
        res.status(501).send({ error: "Internal Server ERROR" })
    }
}




module.exports = {
    createStudent, getAllStudent, updateStudent, deleteStudent, getStudentById, getStudentReport, sortSearchFilter,getMarksFn
}