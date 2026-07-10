const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeWorkOrderMpr = sequelize.define('EmployeeWorkOrderMpr', {

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

    mpr_generated: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },

    mpr_file_name: {
        type: DataTypes.TEXT
    },

    mpr_file_path: {
        type: DataTypes.TEXT
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
    tableName: 'employee_work_order_mpr',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


// Associations
EmployeeWorkOrderMpr.associate = (models) => {

    EmployeeWorkOrderMpr.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'RESTRICT'
    });

    EmployeeWorkOrderMpr.belongsTo(models.WorkOrder, {
        foreignKey: 'wo_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeWorkOrderMpr;