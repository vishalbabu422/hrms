const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const SalaryComponent = sequelize.define(
  "SalaryComponent",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    type: {
      type: DataTypes.ENUM("EARNING", "DEDUCTION"),
      allowNull: false,
    },

    value_type: {
      type: DataTypes.ENUM("PERCENTAGE", "FIXED"),
      allowNull: false,
    },

    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },

    base_type: {
      type: DataTypes.ENUM("CTC", "COMPONENT"),
      allowNull: false,
    },

    base_component_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    calculation_priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

    is_prorated: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    is_mandatory: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    org_id: {
     type: DataTypes.BIGINT,
     allowNull: false,
    }
  },
  {
    tableName: "salary_component",
    schema: "pmu",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Associations
SalaryComponent.associate = (models) => {
  // Self reference (component depends on another component)
  SalaryComponent.belongsTo(models.SalaryComponent, {
    foreignKey: "base_component_id",
    as: "baseComponent",
    onDelete: "RESTRICT",
  });

  SalaryComponent.hasMany(models.SalaryComponent, {
    foreignKey: "base_component_id",
    as: "dependentComponents",
  });
};

module.exports = SalaryComponent;