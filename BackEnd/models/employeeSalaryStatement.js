const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmpSalaryStatement = sequelize.define(
  "EmpSalaryStatement",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    emp_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    statement_path: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    schema: "pmu",
    tableName: "emp_salary_statement",
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ["emp_id", "month", "year"],
      },
      {
        fields: ["emp_id"],
      },
      {
        fields: ["month", "year"],
      },
    ],
  }
);

EmpSalaryStatement.associate = (models) => {
  EmpSalaryStatement.belongsTo(models.Employee, {
    foreignKey: "emp_id",
    as: "employee",
  });
};

module.exports = EmpSalaryStatement;