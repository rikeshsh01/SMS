"use strict";
module.exports = (DataTypes, sequelize, Sequelize) => {
    const User = sequelize.define('user', {
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
                isEmail: true,
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: false
    });
    return User;
};
