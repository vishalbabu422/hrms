const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeTraining = sequelize.define('EmployeeTraining', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    training_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    training_provider: {
        type: DataTypes.STRING(255)
    },

    training_start_date: {
        type: DataTypes.DATEONLY
    },

    training_end_date: {
        type: DataTypes.DATEONLY
    },

    training_type: {
        type: DataTypes.ENUM('SELF', 'COMPANY'),
        allowNull: false,
        defaultValue: 'SELF'
    },

    description: {
        type: DataTypes.TEXT
    },

    created_by: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    updated_by: {
        type: DataTypes.BIGINT
    }

}, {
    tableName: 'employee_trainings',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

EmployeeTraining.associate = (models) => {

    EmployeeTraining.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

    EmployeeTraining.hasMany(models.Document, {
        foreignKey: 'training_id'
    });

};

module.exports = EmployeeTraining;