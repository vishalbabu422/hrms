const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeDivision = sequelize.define(
    "EmployeeDivision",
    {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },

        employee_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        division_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        effective_from: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        effective_to: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        is_current: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },
    {
        tableName: "employee_divisions",
        schema: "pmu",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
        indexes: [
            {
                fields: ["employee_id"]
            },
            {
                fields: ["division_id"]
            },
            {
                fields: ["is_current"]
            }
        ]
    }
);

EmployeeDivision.associate = (models) => {

    EmployeeDivision.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "employee",
        onDelete: "CASCADE"
    });

    EmployeeDivision.belongsTo(models.DivisionMaster, {
        foreignKey: "division_id",
        as: "division",
        onDelete: "CASCADE"
    });
};
module.exports = EmployeeDivision;