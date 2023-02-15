"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const DB = require('../models/index');
const moment = require('moment');
const nodemailer = require("nodemailer");
const sendToEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let email = req.body.email;
    const token = Math.random().toString(36).substring(2);
    const user = yield DB.user.findOne({
        where: {
            email: email
        },
        include: [DB.loginlink],
    });
    // res.json(user)
    if (!user) {
        res.json({
            msg: "User does not exits"
        });
    }
    const loginlink = yield DB.loginlink.create({
        token: token
    });
    const userloginlink = yield DB.userloginlink.create({
        userid: user.id,
        loginlinkid: loginlink.id
    });
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'cullen79@ethereal.email',
            pass: 'XCUhzqWZkBNuFpKP9t'
        }
    });
    yield transporter.sendMail({
        from: "admin@gmail.com",
        to: email,
        subject: 'Verify Your Account',
        text: `Please click on this link to verify : http://localhost:5000/api/login/emailauthentication/${token}`,
    });
    res.status(201).json({
        user, loginlink, userloginlink
    });
});
const verifyEmailLink = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.params.token;
    const vToken = yield DB.loginlink.findOne({
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
    let [user] = vToken.users;
    yield DB.logininfo.create({
        logindate: moment(),
        userid: user.id
    });
    res.status(200).json({
        message: 'Email address verified successfully',
        authToken: vToken.uuid,
    });
});
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth_token = req.header("auth-token");
    // console.log(token)
    const loginLink = yield DB.loginlink.findOne({
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
    yield loginLink.save();
    let [user] = loginLink.users;
    yield DB.logininfo.update({
        logoutdate: moment()
    }, {
        where: {
            userid: user.id
        }
    });
    res.status(200).send({
        message: 'Logout successful',
        loginLink: loginLink
    });
});
module.exports = {
    sendToEmail, verifyEmailLink, logOut
};
