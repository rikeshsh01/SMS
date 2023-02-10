"use strict";
module.exports = (DataTypes, sequelize) => {
    const Subject = sequelize.define('subject', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    }, {
        timestamps: false
    });
    return Subject;
};
