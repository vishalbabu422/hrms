const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeHealth = sequelize.define('EmployeeHealth', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true  
    },

    height_cm: {
        type: DataTypes.DECIMAL(5,2),
        validate: {
            min: 0.01
        }
    },

    weight_kg: {
        type: DataTypes.DECIMAL(5,2),
        validate: {
            min: 0.01
        }
    },

    has_health_issues: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    is_handicapped: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    physical_disability_category: {
        type: DataTypes.STRING(100)
    },

    health_issue_remarks: {
        type: DataTypes.TEXT
    },

    identification_mark: {
        type: DataTypes.TEXT
    }

}, {
    tableName: 'employee_health',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

EmployeeHealth.associate = (models) => {

    EmployeeHealth.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeHealth;
