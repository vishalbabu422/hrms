const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeWorkOrderLeave = sequelize.define('EmployeeWorkOrderLeave', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    wo_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    leave_taken: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    holiday_worked: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    leave_granted: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    month: {
        type: DataTypes.STRING(10)
    },

    year: {
        type: DataTypes.STRING(10)
    },

    created_by: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    updated_by: {
        type: DataTypes.BIGINT
    }

}, {
    tableName: 'employee_work_order_leave',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


// Associations
EmployeeWorkOrderLeave.associate = (models) => {

    EmployeeWorkOrderLeave.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'RESTRICT'
    });

    EmployeeWorkOrderLeave.belongsTo(models.WorkOrder, {
        foreignKey: 'wo_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeWorkOrderLeave;