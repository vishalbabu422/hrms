const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeAchievement = sequelize.define('EmployeeAchievement', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    achievement_date: {
        type: DataTypes.DATEONLY
    },

    achievement: {
        type: DataTypes.TEXT
    },

    achievement_remarks: {
        type: DataTypes.TEXT
    }

}, {
    tableName: 'employee_achievements',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});


EmployeeAchievement.associate = (models) => {

    EmployeeAchievement.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeAchievement;
