const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeVaccination = sequelize.define('EmployeeVaccination', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    vaccination_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    vaccination_date: {
        type: DataTypes.DATEONLY
    },

    vaccination_document: {
        type: DataTypes.STRING(255)
    }

}, {
    tableName: 'employee_vaccinations',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

EmployeeVaccination.associate = (models) => {

    EmployeeVaccination.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeVaccination;
