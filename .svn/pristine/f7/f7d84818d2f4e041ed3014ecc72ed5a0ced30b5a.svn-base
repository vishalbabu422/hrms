const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const ResourceRate = sequelize.define(
  "ResourceRate",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    unit_rate_incl_agency_margin: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    agency_margin_percent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
    },

    agency_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },

    unit_rate_excl_agency_margin: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    nicsi_margin_percent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
    },

    nicsi_margin_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },

    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    gst_code_fk: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    cgst_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },

    sgst_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },

    igst_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },

    total_gst_amount: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },

    final_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
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
    tableName: "resource_rate",
    timestamps: false, //
  },
);

ResourceRate.associate = (models) => {
  ResourceRate.belongsTo(models.Designation, {
    foreignKey: "desgn_id_fk",
    as: "designation",
  });

  ResourceRate.belongsTo(models.GstCodeMaster, {
    foreignKey: "gst_code_fk",
    as: "gstCode",
  });
};

module.exports = ResourceRate;
