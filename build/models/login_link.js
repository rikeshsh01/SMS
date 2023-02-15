"use strict";
module.exports = (DataTypes, sequelize, Sequelize) => {
    const moment = require('moment');
    const LoginLink = sequelize.define('loginlink', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        used: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
        // ,
        // timestamp: {
        //     type: DataTypes.DATE,
        //     defaultValue: moment(),
        //     allowNull: false
        // }
    }, {
        timestamps: false
    });
    return LoginLink;
};
