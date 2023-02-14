"use strict";
const dbContext = require('../models/index');
const Users = dbContext.user;
var jwt = require('jsonwebtoken');
var privateKey = "MynameisRicky";
const verifyUser = (req, res, next) => {
    // Get the user from jwt token and id to req object 
    const token = req.header("auth-token");
    // console.log(!token)
    if (!token) {
        return res.status(401).json({ msg: 'You need to sign in first' });
    }
    try {
        const userData = jwt.verify(token, privateKey);
        console.log(userData);
        req.authUserId = userData.userReq.authUserId;
        // console.log(req)
        next();
        console.log("authenticated");
    }
    catch (error) {
        res.status(401).send({ error: "Token not verified" });
    }
};
module.exports = {
    verifyUser
};
