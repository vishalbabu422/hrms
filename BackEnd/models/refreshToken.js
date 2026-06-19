const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

module.exports = (sequelize, DataTypes) => {
    return sequelize.define("EmployeeRefreshToken", {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        employee_id: { type: DataTypes.BIGINT, allowNull: false },
        token_hash: { type: DataTypes.STRING(64), allowNull: false },
        expires_at: { type: DataTypes.DATE, allowNull: false },
        revoked: { type: DataTypes.BOOLEAN, defaultValue: false }
    }, {
        tableName: "employee_refresh_tokens",
        schema: "pmu",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    });
};
