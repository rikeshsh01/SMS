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
Object.defineProperty(exports, "__esModule", { value: true });
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const db = require('../models/index');
let User = db.user;
var privateKey = "MynameisRicky";
// User Login / Auth using jwt token
const authUserJWT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        let userDB = yield User.findOne({ where: { email: email } });
        if (!userDB) {
            return res.status(400).json({ error: "User Doesnot exist" });
        }
        const passwordCOmpare = yield bcrypt.compare(password, userDB.password);
        if (!passwordCOmpare) {
            return res.status(400).json({ error: "Password doesnot matched" });
        }
        const data = {
            userReq: {
                authUserId: userDB.id
            }
        };
        const authToken = jwt.sign(data, privateKey);
        req.authToken = authToken;
        res.status(200).json({
            auth_token: authToken,
            data: data
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = {
    authUserJWT,
};
