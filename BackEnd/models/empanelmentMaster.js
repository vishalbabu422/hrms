const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmpanelmentMaster = sequelize.define(
  "EmpanelmentMaster",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    company_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    category: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    empanelment_no: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    amc: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
    },

    agm: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    shortcode: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    rfe: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    effective_from: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    effective_to: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    leaves_per_month: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    carry_forward: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    leave_category: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    maternity_leaves: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    remarks: {
      type: DataTypes.TEXT,
    },

    doc_path: {
      type: DataTypes.STRING(255),
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

    organization_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    schema: "pmu",
    tableName: "empanelment_master",
    timestamps: false,
  },
);

EmpanelmentMaster.associate = (models) => {
  EmpanelmentMaster.hasMany(models.EmpExtMapping, {
    foreignKey: "empanelment_id_fk",
    onDelete: "CASCADE",
  });

  EmpanelmentMaster.belongsTo(models.CompanyMaster, {
    foreignKey: "company_id",
    onDelete: "CASCADE",
  });
};

module.exports = EmpanelmentMaster;
