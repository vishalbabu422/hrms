const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const AppSetting = sequelize.define(
  "AppSetting",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    auth_mode: {
      type: DataTypes.ENUM("LOCAL", "SSO", "BOTH"),
      allowNull: false,
      defaultValue: "LOCAL",
    },

    sso_provider: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },

    sso_portal_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    sso_login_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    sso_logout_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    service_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    service_key: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    service_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    enable_sso_validation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "app_settings",
    schema: "pmu",
    timestamps: true,
    createdAt: false, // Table has no created_at column
    updatedAt: "updated_at",
  },
);

AppSetting.associate = (models) => {
  // No associations currently.
  // Future example:
  // AppSetting.belongsTo(models.Organization, { foreignKey: "organization_id" });
};

module.exports = AppSetting;
