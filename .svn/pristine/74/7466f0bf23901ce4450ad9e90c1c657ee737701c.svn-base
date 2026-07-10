const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const SalaryStructureComponent = sequelize.define(
  "SalaryStructureComponent",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    salary_structure_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    salary_component_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    value_type: {
      type: DataTypes.ENUM("PERCENTAGE", "FIXED"),
      allowNull: true,
    },

    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },

    calculation_priority: {
      type: DataTypes.INTEGER,
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
  },
  {
    tableName: "salary_structure_component",
    schema: "pmu",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",

    indexes: [
      {
        unique: true,
        fields: ["salary_structure_id", "salary_component_id"],
      },
    ],
  }
);

// Associations
SalaryStructureComponent.associate = (models) => {
  SalaryStructureComponent.belongsTo(models.SalaryStructure, {
    foreignKey: "salary_structure_id",
    as: "salaryStructure",
    onDelete: "CASCADE",
  });

  SalaryStructureComponent.belongsTo(models.SalaryComponent, {
    foreignKey: "salary_component_id",
    as: "salaryComponent",
    onDelete: "CASCADE",
  });
};

module.exports = SalaryStructureComponent;