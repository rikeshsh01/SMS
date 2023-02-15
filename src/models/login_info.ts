module.exports = (DataTypes: any, sequelize: any, Sequelize: any) => {
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
        }
    }, {
        timestamps: false
    });


    return LoginInfo;
}
