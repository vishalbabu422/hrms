const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Organization = sequelize.define(
  "Organization",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    org_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    org_code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    contact_email: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },

    contact_phone: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },

    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    schema: "pmu",
    tableName: "organizations",
    timestamps: false,
  }
);

Organization.associate = (models) => {

  Organization.hasMany(models.RoleMaster, {
    foreignKey: 'organization_id'
  });

}

module.exports = Organization;