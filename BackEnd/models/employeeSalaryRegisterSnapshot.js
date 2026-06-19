const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeSalaryRegisterSnapshot = sequelize.define(
  "EmployeeSalaryRegisterSnapshot",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    employee_salary_register_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    salary_component_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    component_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    component_type: {
      type: DataTypes.ENUM("EARNING", "DEDUCTION"),
      allowNull: false,
    },

    final_amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
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
    },

    updated_by: {
      type: DataTypes.BIGINT,
    },
    source_type: {
  type: DataTypes.ENUM("STRUCTURE", "ADDON"),
  allowNull: false,
  defaultValue: "STRUCTURE",
},

addon_id: {
  type: DataTypes.BIGINT,
  allowNull: true,
},
  },
  {
    tableName: "employee_salary_register_snapshot",
    schema: "pmu",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    indexes: [
      {
        name: "idx_esrc_salary_register_snapshot",
        fields: ["employee_salary_register_id"],
      },
    ],
  }
);

// Associations
EmployeeSalaryRegisterSnapshot.associate = (models) => {
  EmployeeSalaryRegisterSnapshot.belongsTo(
    models.EmployeeSalaryRegister,
    {
      foreignKey: "employee_salary_register_id",
      as: "salary_register",
      onDelete: "CASCADE",
    }
  );

  EmployeeSalaryRegisterSnapshot.belongsTo(models.SalaryComponent, {
    foreignKey: "salary_component_id",
    as: "salaryComponent",
  });
  
    EmployeeSalaryRegisterSnapshot.belongsTo(
    models.EmployeeSalaryAddon,
    {
      foreignKey: "addon_id",
      as: "addon",
    }
  );
};

module.exports = EmployeeSalaryRegisterSnapshot;