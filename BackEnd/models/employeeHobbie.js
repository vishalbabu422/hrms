const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeHobby = sequelize.define('EmployeeHobby', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    hobby: {
        type: DataTypes.STRING(100)
    },

    remarks: {
        type: DataTypes.TEXT
    }

}, {
    tableName: 'employee_hobbies',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

EmployeeHobby.associate = (models) => {

    EmployeeHobby.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeHobby;
