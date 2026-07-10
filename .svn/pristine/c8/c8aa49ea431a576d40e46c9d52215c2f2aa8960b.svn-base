const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeScreeningTest = sequelize.define('EmployeeScreeningTest', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        unique: true   
    },

    test_scheduled_date: {
        type: DataTypes.DATEONLY
    },

    test_given_date: {
        type: DataTypes.DATEONLY
    },

    marks_secured: {
        type: DataTypes.DECIMAL(6, 2)
    },

    result: {
        type: DataTypes.ENUM('PASS', 'FAIL')
    }

}, {
    tableName: 'employee_screening_tests',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

EmployeeScreeningTest.associate = (models) => {

    EmployeeScreeningTest.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeScreeningTest;
