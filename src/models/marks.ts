module.exports = (DataTypes: any, sequelize: any) => {
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
}
