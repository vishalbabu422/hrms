const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const VendorMaster = sequelize.define(
  "VendorMaster",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    organization_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    empanelment_id_fk: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    vendor_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    vendor_code: {
      type: DataTypes.STRING(50),
      unique: true,
    },

    vendor_type: {
      type: DataTypes.ENUM(
        "INDIVIDUAL",
        "PROPRIETORSHIP",
        "PARTNERSHIP",
        "LLP",
        "PRIVATE_LIMITED",
        "PUBLIC_LIMITED",
        "GOVERNMENT",
        "NGO",
        "OTHER",
      ),
    },

    contact_person: {
      type: DataTypes.STRING(150),
    },

    contact_email: {
      type: DataTypes.STRING(150),
    },

    contact_phone: {
      type: DataTypes.STRING(30),
    },

    website: {
      type: DataTypes.STRING(150),
    },

    address_line1: {
      type: DataTypes.TEXT,
    },

    address_line2: {
      type: DataTypes.TEXT,
    },

    city: {
      type: DataTypes.STRING(100),
    },

    state: {
      type: DataTypes.STRING(100),
    },

    country: {
      type: DataTypes.STRING(100),
      defaultValue: "India",
    },

    pincode: {
      type: DataTypes.STRING(15),
    },

    bank_name: {
      type: DataTypes.STRING(150),
    },

    account_number: {
      type: DataTypes.STRING(50),
    },

    ifsc_code: {
      type: DataTypes.STRING(20),
    },

    branch_name: {
      type: DataTypes.STRING(150),
    },

    onboarding_date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    created_at: {
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
    tableName: "vendor_master",
    timestamps: false, // because DB trigger handles updated_at
  },
);

VendorMaster.associate = (models) => {
  VendorMaster.belongsTo(models.Organization, {
    foreignKey: "organization_id",
    onDelete: "CASCADE",
  });

  VendorMaster.belongsTo(models.Organization, {
    foreignKey: "empanelment_id_fk",
    onDelete: "CASCADE",
  });
};

module.exports = VendorMaster;
