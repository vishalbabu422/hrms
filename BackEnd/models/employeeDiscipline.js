const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeDiscipline = sequelize.define('EmployeeDiscipline', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    offence: {
        type: DataTypes.TEXT
    },

    offence_date: {
        type: DataTypes.DATEONLY
    },

    disciplinary_action: {
        type: DataTypes.TEXT
    },

    remarks: {
        type: DataTypes.TEXT
    }

}, {
    tableName: 'employee_discipline',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

EmployeeDiscipline.associate = (models) => {

    EmployeeDiscipline.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeDiscipline;
