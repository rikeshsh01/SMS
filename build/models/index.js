"use strict";
const { DataTypes, Sequelize } = require("sequelize");
const dbConfig = require("../config/db_config");
let User = require('../models/user');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    logging: false,
    dialect: dbConfig.dialect
});
try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
}
catch (error) {
    console.error('Unable to connect to the database:', error);
}
// sequelize.getQueryInterface().showAllTables().then(tableNames => {
//   console.log(tableNames);
// });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.student = require('./student')(DataTypes, sequelize);
db.user = require('./user')(DataTypes, sequelize);
db.subject = require('./subject')(DataTypes, sequelize);
db.mark = require('./marks')(DataTypes, sequelize);
db.loginlink = require('./login_link')(DataTypes, sequelize);
db.logininfo = require('./login_info')(DataTypes, sequelize);
db.userloginlink = require('./userloginlink')(DataTypes, sequelize);
// Database relationship 
db.student.hasMany(db.mark, { as: 'subjects', foreignKey: 'studentid' });
db.mark.belongsTo(db.student, { foreignKey: 'studentid' });
db.subject.hasMany(db.mark, { as: 'subjects', foreignKey: 'subjectid' });
db.mark.belongsTo(db.subject, { foreignKey: 'subjectid' });
// db.user.hasMany(db.loginlink, { foreignKey: 'userid' }); // A HasOne B
// db.loginlink.belongsTo(db.user,{ foreignKey: 'userid' }); // A BelongsTo B
db.logininfo.belongsTo(db.user, { foreignKey: 'userid' });
db.user.hasMany(db.logininfo, { foreignKey: 'userid' });
// db.loginlink.hasOne(db.logininfo, { foreignKey: 'loginlinkid' });
// db.logininfo.belongsTo(db.loginlink, { foreignKey: 'loginlinkid'});
db.user.belongsToMany(db.loginlink, { through: db.userloginlink, foreignKey: 'userid' });
db.loginlink.belongsToMany(db.user, { through: db.userloginlink, foreignKey: 'loginlinkid' });
// db.sequelize.sync({force:true});
module.exports = db;
