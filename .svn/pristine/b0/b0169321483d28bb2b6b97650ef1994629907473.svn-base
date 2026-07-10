const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeSalaryAddon = sequelize.define(
  "EmployeeSalaryAddon",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    salary_addon_master_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },

    recurrence_type: {
      type: DataTypes.ENUM(
        "ONE_TIME",
        "MONTHLY",
        "QUARTERLY",
        "YEARLY"
      ),
      allowNull: true,
    },

    effective_from: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    effective_to: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    tableName: "employee_salary_addon",
    schema: "pmu",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

EmployeeSalaryAddon.associate = (models) => {
  // Employee
  EmployeeSalaryAddon.belongsTo(models.Employee, {
    foreignKey: "employee_id",
    as: "employee",
  });

  // Salary Addon Master
  EmployeeSalaryAddon.belongsTo(
    models.SalaryAddonMaster,
    {
      foreignKey: "salary_addon_master_id",
      as: "salaryAddonMaster",
    }
  );
};

module.exports = EmployeeSalaryAddon;