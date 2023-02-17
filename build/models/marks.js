"use strict";
module.exports = (DataTypes, sequelize) => {
    const Mark = sequelize.define('mark', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        marks: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return Mark;
};
