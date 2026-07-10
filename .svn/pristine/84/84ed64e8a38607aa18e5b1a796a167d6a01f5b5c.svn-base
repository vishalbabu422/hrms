const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const DivisionMaster = sequelize.define("DivisionMaster",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },

        organization_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        division_name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        division_code: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        parent_division_id: {
            type: DataTypes.BIGINT,
            allowNull: true
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "divisions",
        schema: "pmu",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            {
                unique: true,
                fields: ["organization_id", "division_name"]
            },
            {
                fields: ["organization_id"]
            },
            {
                fields: ["is_deleted"]
            }
        ]
    }
);

DivisionMaster.associate = (models) => {
    DivisionMaster.belongsTo(models.Organization, {
        foreignKey: "organization_id",
        as: "organization",
        onDelete: "CASCADE"
    });

    DivisionMaster.hasMany(models.EmployeeDivision, {
        foreignKey: "division_id",
        as: "employeeDivisions"
    });

    DivisionMaster.belongsTo(models.DivisionMaster, {
        foreignKey: "parent_division_id",
        as: "parentDivision"
    });

    DivisionMaster.hasMany(models.DivisionMaster, {
        foreignKey: "parent_division_id",
        as: "childDivisions"
    });
};
module.exports = DivisionMaster;