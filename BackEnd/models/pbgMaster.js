const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const PbgMaster = sequelize.define(
  "PbgMaster",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    pbg_no: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },

    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    nicsi_reg_no: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    nicsi_reg_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    bank_charges: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },

    pbg_upload_path: {
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
    tableName: "pbg_master",
    timestamps: false,
  },
);

PbgMaster.associate = (models) => {
  PbgMaster.hasMany(models.WorkorderPbg, {
    foreignKey: "pbg_id",
    as: "workorderPbgs",
  });
};

module.exports = PbgMaster;