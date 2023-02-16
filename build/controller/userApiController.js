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
const db = require('../models/index');
let User = db.user;
// Create a new User
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt.genSalt(10);
        const secPass = yield bcrypt.hash(req.body.password, salt);
        const user = yield User.create({
            email: req.body.email,
            password: secPass,
            name: req.body.name
        });
        res.status(200).json({
            message: "User Created",
            dataUser: { user }
        });
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// View all created users 
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUser = yield User.findAll({
        attributes: {
            exclude: ['password']
        }
    });
    res.status(200).json({
        msg: "List of all Users",
        data: allUser
    });
});
// Update user data
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const salt = yield bcrypt.genSalt(10);
        const secPass = yield bcrypt.hash(req.body.password, salt);
        const userId = req.params.id;
        yield User.update({
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
        });
        // }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
// Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        yield User.destroy({
            where: {
                id: userId
            }
        });
        res.status(200).json({
            msg: "Deleted",
            id: userId
        });
        // }
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = {
    createUser, getAllUser, updateUser, deleteUser
};
