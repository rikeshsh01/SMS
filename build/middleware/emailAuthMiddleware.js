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
const dB = require('../models/index');
const verifyAuthUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the user from jwt token and id to req object 
    const token = req.header("auth-token");
    console.log(token);
    if (!token) {
        return res.status(401).json({ msg: 'You need to sign in first' });
    }
    try {
        const loginInfo = yield dB.logininfo.findOne({
            where: {
                usersession: token,
            },
            include: [dB.user],
        });
        console.log(loginInfo);
        req.userId = loginInfo.user.id;
        req.logininfoUuid = loginInfo.uuid;
        next();
        console.log("authenticated");
    }
    catch (error) {
        res.status(401).send({ error: "Token not verified" });
    }
});
module.exports = {
    verifyAuthUser
};
