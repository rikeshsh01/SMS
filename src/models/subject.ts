module.exports = (DataTypes: any, sequelize: any) => {
    const Subject = sequelize.define('subject', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey:true,
        autoIncrement: true
    },
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
        },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:true,
      }
    }, {
      timestamps: false
    });
  
  
    return Subject;
  }
  