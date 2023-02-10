import { Response, Request } from "express";
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

const db = require('../models/index')
let User = db.user;


var privateKey = "MynameisRicky";

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



// User Login / Auth
const authUser = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body;

        let userDB = await User.findOne({ where: { email: email } });

        if (!userDB) {
            return res.status(400).json({ error: "User Doesnot exist" });
        }

        const passwordCOmpare = await bcrypt.compare(password, userDB.password);

        if (!passwordCOmpare) {
            return res.status(400).json({ error: "Password doesnot matched" });
        }

        const data = {
            userReq: {
                authUserId: userDB.id
            }
        }

        const authToken = jwt.sign(data, privateKey);

        req.authToken = authToken;
        res.status(200).json({
            auth_token: authToken,
            data: data
        });

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


// Update user data
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
    createUser, getAllUser, updateUser, deleteUser, authUser,
}