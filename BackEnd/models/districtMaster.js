const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const DistrictMaster = sequelize.define(
  "DistrictMaster",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    state_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    district_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    modified_on: {
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
    tableName: "district_master",
    timestamps: false,
  }
);

DistrictMaster.associate = (models) => {
  DistrictMaster.belongsTo(models.StateMaster, {
    foreignKey: "state_id",
    as: "state",
  });
};

module.exports = DistrictMaster;