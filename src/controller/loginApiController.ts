const DB = require('../models/index');
const moment = require('moment');
const nodemailer = require("nodemailer");





const sendToEmail = async (req: any, res: any) => {
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
        res.json({
            msg: "User does not exits"
        })
    }
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

    let [user] = vToken.users

    await DB.logininfo.create({
        logindate: moment(),
        userid: user.id
    })

    res.status(200).json({
        message: 'Email address verified successfully',
        authToken: vToken.uuid,
    });

}

const logOut = async (req: any, res: any) => {
    const auth_token = req.header("auth-token")
    // console.log(token)

    const loginLink = await DB.loginlink.findOne({
        where: {
            uuid: auth_token,
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



    if (!loginLink) {
        return res.status(404).send({ message: 'Login link not found' });
    }
    loginLink.used = true;
    loginLink.token = null;
    await loginLink.save();

    let [user]=loginLink.users
    
    await DB.logininfo.update({
        logoutdate: moment()
    }, {
        where: {
            userid: user.id
        }
    });

    res.status(200).send({ 
        message: 'Logout successful' ,
        loginLink:loginLink
    });
}

module.exports = {
    sendToEmail, verifyEmailLink, logOut
}