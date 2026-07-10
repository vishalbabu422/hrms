const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeLtc = sequelize.define('EmployeeLtc', {

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

    hometown: {
        type: DataTypes.STRING(100)
    },

    state: {
        type: DataTypes.STRING(100)
    },

    district: {
        type: DataTypes.STRING(100)
    },

    nearest_railway: {
        type: DataTypes.STRING(150)
    },

    nearest_airport: {
        type: DataTypes.STRING(150)
    },

    can_update: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

}, {
    tableName: 'employee_ltc',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

EmployeeLtc.associate = (models) => {

    EmployeeLtc.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeLtc;