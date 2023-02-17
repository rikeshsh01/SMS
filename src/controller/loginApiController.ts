const DB = require('../models/index');
const moment = require('moment');
const nodemailer = require("nodemailer");

// send virfication token to email 
const sendToEmail = async (req: any, res: any) => {
    try {
        let email = req.body.email
        const token = Math.random().toString(36).substring(2);
    
    
        const user = await DB.user.findOne({
            where: {
                email: email
            },
            include: [DB.loginlink],
        });
    
        // res.json(user)
    
    
        if (!user) {
            res.send({
                msg: "User does not exits"
            });
        }else {
            
        const loginlink = await DB.loginlink.create({
            token: token
        })
    
        const userloginlink = await DB.userloginlink.create({
            userid: user.id,
            loginlinkid: loginlink.id
        })
    
    
        const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'cullen79@ethereal.email',
                pass: 'XCUhzqWZkBNuFpKP9t'
            }
        });
    
        await transporter.sendMail({
            from: "admin@gmail.com",
            to: email,
            subject: 'Verify Your Account',
            text: `Please click on this link to verify : http://localhost:5000/api/login/emailauthentication/${token}`,
        });
        res.status(201).json({
            user, loginlink, userloginlink
        })
        }
    } catch (error) {
        res.send(error)
    }
   
}


// Authenticate email with the token send to email
const verifyEmailLink = async (req: any, res: any) => {

    let token = req.params.token
    const vToken = await DB.loginlink.findOne({
        where: {
            token: token,
            used: {
                [DB.Sequelize.Op.eq]: false,
            },
        },
        include: [
            {
                model: DB.user,
                attributes: ['id', 'uuid', 'name', 'email'],
            },
        ],
    });

    if (!vToken) {
        return res.status(404).json({ message: 'Invalid token' });
    }

    vToken.used = true;
    vToken.token = null;
    await vToken.save();

    let [user] = vToken.users

    await DB.logininfo.create({
        logindate: moment(),
        userid: user.id,
        usersession:vToken.uuid
    })
    
    res.status(200).json({
        message: 'Email address verified successfully',
        authToken: vToken.uuid,
    });

}


// Clear user session/ logout 
const logOut = async (req: any, res: any) => {
    
    await DB.logininfo.update({
        logoutdate: moment(),
        usersession:null
    }, {
        where: {
            userid: req.userId,
            uuid:req.logininfoUuid
        }
    });

    res.status(200).send({ 
        message: 'Logout successful'
    });
}

module.exports = {
    sendToEmail, verifyEmailLink, logOut
}