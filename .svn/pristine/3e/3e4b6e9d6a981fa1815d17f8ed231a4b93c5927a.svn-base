const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const RolePermission = sequelize.define(
    "RolePermission",
    {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        role_id: { type: DataTypes.BIGINT, allowNull: false },
        permission_id: { type: DataTypes.BIGINT, allowNull: false },
        organization_id: DataTypes.BIGINT
    },
    {
        tableName: "role_permissions",
        schema: "pmu",
        timestamps: false
    }
);

RolePermission.associate = (models) => {

    RolePermission.belongsTo(models.RoleMaster, {
        foreignKey: "role_id",
        as: "RoleMaster"
    });

    RolePermission.belongsTo(models.Permission, {
        foreignKey: "permission_id",
        as: "Permission"
    });

};


module.exports = RolePermission;

