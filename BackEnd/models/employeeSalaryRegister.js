const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeSalaryRegister = sequelize.define(
  "EmployeeSalaryRegister",
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

    year: {
      type: DataTypes.INTEGER,
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

    gross_earnings: {
      type: DataTypes.DECIMAL(14, 2),
    },

    total_deductions: {
      type: DataTypes.DECIMAL(14, 2),
    },

    net_salary: {
      type: DataTypes.DECIMAL(14, 2),
    },

    working_days: {
      type: DataTypes.INTEGER,
    },

    paid_days: {
      type: DataTypes.INTEGER,
    },

    lop_days: {
      type: DataTypes.INTEGER,
    },

    status: {
      type: DataTypes.ENUM("PENDING", "DISPATCHED"),
      allowNull: false,
    },

    dispatched_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    created_by: {
      type: DataTypes.BIGINT,
    },

    updated_by: {
      type: DataTypes.BIGINT,
    },
    transaction_number: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    mon_salaryslip_generated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    mon_salaryslip_filename: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    mon_salaryslip_filepath: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    transaction_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    },
  },
  {
    tableName: "employee_salary_register",
    schema: "pmu",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    indexes: [
      {
        unique: true,
        fields: ["employee_id", "year", "month"],
      },
    ],
  },
);

// Associations
EmployeeSalaryRegister.associate = (models) => {
  EmployeeSalaryRegister.belongsTo(models.Employee, {
    foreignKey: "employee_id",
    as: "employee",
  });

  EmployeeSalaryRegister.hasMany(models.EmployeeSalaryRegisterSnapshot, {
    foreignKey: "employee_salary_register_id",
    as: "snapshots",
    onDelete: "CASCADE",
  });
};

module.exports = EmployeeSalaryRegister;
