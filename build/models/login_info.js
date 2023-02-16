"use strict";
module.exports = (DataTypes, sequelize, Sequelize) => {
    const LoginInfo = sequelize.define('logininfo', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
        logindate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        logoutdate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        usersession: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null,
        }
    }, {
        timestamps: false
    });
    return LoginInfo;
};
