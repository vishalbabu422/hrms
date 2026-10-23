const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");
const PbgMaster = require("./pbgMaster");
const WorkOrder = require("./workOrder");

const WorkorderPbg = sequelize.define(
  "WorkorderPbg",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    pbg_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    wo_id: {
      type: DataTypes.BIGINT,
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
    tableName: "workorder_pbg",
    timestamps: false,

    indexes: [
      {
        unique: true,
        fields: ["pbg_id", "wo_id"],
      },
      {
        fields: ["pbg_id"],
      },
      {
        fields: ["wo_id"],
      },
    ],
  },
);

WorkorderPbg.associate = (models) => {
  WorkorderPbg.belongsTo(models.PbgMaster, {
    foreignKey: "pbg_id",
    as: "pbg",
  });

  WorkorderPbg.belongsTo(models.WorkOrder, {
    foreignKey: "wo_id",
    as: "workOrder",
  });
};

module.exports = WorkorderPbg;