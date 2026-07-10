const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeLanguage = sequelize.define('EmployeeLanguage', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    language_name: {
        type: DataTypes.STRING(50)
    },

    can_read: {
        type: DataTypes.BOOLEAN
    },

    can_write: {
        type: DataTypes.BOOLEAN
    },

    can_speak: {
        type: DataTypes.BOOLEAN
    },

    proficiency: {
        type: DataTypes.TEXT
    }

}, {
    tableName: 'employee_languages',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

EmployeeLanguage.associate = (models) => {

    EmployeeLanguage.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeLanguage;
