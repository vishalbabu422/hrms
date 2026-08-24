const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const StateMaster = sequelize.define(
  "StateMaster",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    state_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },

    state_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },

    lgd_code: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true,
    },

    state_type: {
      type: DataTypes.STRING(10),
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
    tableName: "state_master",
    timestamps: false,
  }
);

StateMaster.associate = (models) => {
  StateMaster.hasMany(models.DistrictMaster, {
    foreignKey: "state_id",
    as: "districts",
  });

   StateMaster.hasMany(models.Employee, {
    foreignKey: "state_of_working",
    as: "employees",
  });
};

module.exports = StateMaster;