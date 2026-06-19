const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeVehicle = sequelize.define('EmployeeVehicle', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    vehicle_details: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    vehicle_registration_number: {
        type: DataTypes.STRING(30),
        allowNull: true
    },

    registration_issue_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },

    registration_expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },

    vehicle_category: {
        type: DataTypes.STRING(30),
        allowNull: true
    }

}, {
    tableName: 'employee_vehicles',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


EmployeeVehicle.associate = (models) => {

    EmployeeVehicle.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeVehicle;