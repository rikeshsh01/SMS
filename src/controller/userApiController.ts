import { Response, Request } from "express";
var bcrypt = require('bcrypt');

const db = require('../models/index')
let User = db.user;


// Create a new User
const createUser = async (req: any, res: Response) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

            const user = await User.create({
                email: req.body.email,
                password: secPass,
                name: req.body.name
            });

            res.status(200).json({
                message: "User Created",
                dataUser: {user}
            })
 
    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
}





// View all created users 
const getAllUser = async (req: any, res: Response) => {

        const allUser = await User.findAll({
            attributes: {
                exclude: ['password']
            }
        });
        res.status(200).json({
            msg: "List of all Users",
            data: allUser
        })

}


// Update users
const updateUser = async (req: any, res: Response) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
    
            const userId = req.params.id
            await User.update({
                password: secPass,
                name: req.body.name
            }, {
                where: {
                    id: userId
                }
            });

            res.status(200).json({
                msg: "Updated",
                uuid: userId
            })

        // }

    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");

    }

}

// Delete user
const deleteUser = async (req: any, res: Response) => {
    try {
            const userId = req.params.id
            await User.destroy({
                where: {
                    id: userId
                }
            });

            res.status(200).json({
                msg: "Deleted",
                id: userId
            })



        // }
    } catch (error: any) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");

    }
}

module.exports = {
    createUser, getAllUser, updateUser, deleteUser
}