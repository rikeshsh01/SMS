module.exports = (DataTypes: any, sequelize: any, Sequelize: any) => {
    const moment = require('moment');
    const LoginLink = sequelize.define('loginlink', {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: moment(),
            allowNull: false
        }
    }, {
        timestamps: false
    });


    return LoginLink;
}
