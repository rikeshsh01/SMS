module.exports = (DataTypes: any, sequelize: any, Sequelize: any) => {
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
}
