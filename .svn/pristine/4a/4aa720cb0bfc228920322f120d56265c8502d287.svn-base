const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeSkill = sequelize.define('EmployeeSkill', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    skill_name: {
        type: DataTypes.STRING(100),
        allowNull: false
    },

    experience_years: {
        type: DataTypes.DECIMAL(4, 1),
        validate: {
            min: 0
        }
    },

    remarks: {
        type: DataTypes.STRING(255)
    }

}, {
    tableName: 'employee_skills',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
   
});

EmployeeSkill.associate = (models) => {

    EmployeeSkill.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeSkill;
