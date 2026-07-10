const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const WoMilestone = sequelize.define(
  "WoMilestone",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    work_order_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    gst_code_fk: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },

    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    created_by: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  },
  {
    schema: "pmu",
    tableName: "wo_milestones",
    timestamps: false,
  }
);

WoMilestone.associate = (models) => {
  WoMilestone.belongsTo(models.WorkOrder, {
    foreignKey: "work_order_id",
    as: "workOrder",
  });

  WoMilestone.belongsTo(models.GstCodeMaster, {
  foreignKey: "gst_code_fk",
  as: "gstCode",
  onDelete: "RESTRICT",
  });
};

module.exports = WoMilestone;