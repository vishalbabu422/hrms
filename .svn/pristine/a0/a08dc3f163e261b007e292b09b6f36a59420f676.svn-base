const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Permission = sequelize.define(
    "Permission",
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        module_id: { type: DataTypes.BIGINT, allowNull: false },

        action: {
            type: DataTypes.STRING(50),
            allowNull: false
        },

        permission_key: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true
        }
    },
    {
        tableName: "permissions",
        schema: "pmu",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    }
);

Permission.associate = (models) => {
    Permission.belongsTo(models.Module, {
        foreignKey: "module_id",
        as: "Module"
    });
    Permission.hasMany(models.RolePermission, {
        foreignKey: "permission_id"
    });
};

module.exports = Permission;

