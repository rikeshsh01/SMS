import { Response, Request } from "express";
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const moment = require('moment');
const db = require('../models/index')
let User = db.user;

var privateKey = "MynameisRicky";

// User Login / Auth using jwt token
const authUserJWT = async (req: any, res: Response) => {
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





module.exports = {
    authUserJWT,
}