const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeWorkOrderDeployment = sequelize.define(
  "EmployeeWorkOrderDeployment",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    wo_desgn_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "work_order_desgn",
        key: "id",
      },
    },

    employee_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "employee",
        key: "id",
      },
    },

    joining_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    relieving_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    created_by: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    updated_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "employee_work_order_deployment",
    schema: "pmu",
    timestamps: false,
  },
);

EmployeeWorkOrderDeployment.associate = (models) => {
  EmployeeWorkOrderDeployment.belongsTo(models.Employee, {
    foreignKey: "employee_id",
    onDelete: "RESTRICT",
  });
  EmployeeWorkOrderDeployment.belongsTo(models.WoDesgnMapping, {
    foreignKey: "wo_desgn_id",
    onDelete: "RESTRICT",
  });
};

module.exports = EmployeeWorkOrderDeployment;
