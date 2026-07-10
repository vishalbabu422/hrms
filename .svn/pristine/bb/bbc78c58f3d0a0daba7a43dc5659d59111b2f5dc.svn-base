const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeRefreshToken = sequelize.define('EmployeeRefreshToken', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    token_hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },

    expires_at: {
        type: DataTypes.DATE,
        allowNull: false
    },

    revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    tableName: 'employee_refresh_tokens',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

EmployeeRefreshToken.associate = (models) => {
    EmployeeRefreshToken.belongsTo(models.Employee, {
        foreignKey: 'employee_id'
    });
};

module.exports = EmployeeRefreshToken;

