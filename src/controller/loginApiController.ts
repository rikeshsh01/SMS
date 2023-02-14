const DB = require('../models/index');
const moment = require('moment');
const nodemailer = require("nodemailer");

const login = async (req: any, res: any) => {
    const token = Math.floor(100000 + Math.random() * 900000)

    const user = await DB.user.findOne({
        where: {
            email: req.body.email
        }
    });

    if (user == null) {
        const user = await DB.user.create({
            email: req.body.email
        });

        await DB.loginlink.create({
            token: token,
            userid: user.id
        })
        res.status(200).json(user)
    } else {
        const checkUserId = await DB.loginlink.findOne({
            where: {
                userid: user.id
            }
        })
        if (checkUserId) {
            await DB.loginlink.update({
                token: token,
                timestamp: moment()
            }, {
                where: {
                    userid: user.id
                }
            });
            res.json({
                msg: "updated"
            })
        } else {
            await DB.loginlink.create({
                token: token,
                userid: user.id
            })
            res.json({
                msg: "updated"
            })
        }

    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ransom.mcdermott@ethereal.email',
            pass: 'vnRhjERT2se1BPcHj7'
        }
    });

    await transporter.sendMail({
        from: "admin@gmail.com",
        to: req.body.email,
        subject: 'Verify Your Account',
        text: `Please click on this link to verify : http://localhost:5000/api/login/emailauthentication/${token}`,
    });

}

const verifyTokenDbfn = async (token: string) => {
    const tokens = await DB.sequelize.query(`SELECT * from public.get_joined_user_data(:token)`, {
        replacements: { token: token },
        type: DB.sequelize.QueryTypes.SELECT
    });
    return tokens;
}


const verifyEmailLink = async (req: any, res: any) => {
    const validTime = moment().subtract(60, 'seconds');
    // console.log(twentyFourHoursAgo.toDate(),'10 sec')
    // console.log(moment().toDate(),'Momment')

    const vToken = await verifyTokenDbfn(req.params.token)

    if (vToken[0].login_link_token == (req.params.token) && vToken[0].login_link_timestamp >= validTime) {
        res.status(201).json({
            msg: "token is valid"
        })
    }
    else {
        res.json({
            msg: "token is invalid"
        })
    }

    /*
        const vToken = await DB.loginlink.findOne({
            where: {
                token: req.params.token,
                timestamp: {
                    [DB.Sequelize.Op.gte]: validTime.toDate(), // Check if timestamp is greater than or equal to 60 second
                }
            }
        })

        if (vToken) {
            res.status(201).json({
                msg: "token is valid"
            })
        } else {
            res.json({
                msg: "token is invalid"
            })
        }
        */
}

module.exports = {
    login, verifyEmailLink
}