"use strict";
module.exports = (DataTypes, sequelize, Sequelize) => {
    const UserLoginLink = sequelize.define('userloginlink', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        }
    }, {
        timestamps: false
    });
    return UserLoginLink;
};
