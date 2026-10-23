const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const BillingSubmission = sequelize.define(
  "BillingSubmission",
  {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    wo_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 12,
      },
    },

    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 2000,
      },
    },

    invoice_no: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    invoice_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    billing_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
    },

    total_amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
    },

    pbg_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },

    pbg_submission_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    billing_igst_amt: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
    },

    billing_cgst_amt: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
    },

    billing_sgst_amt: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0.00,
      validate: {
        min: 0,
      },
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
    tableName: "billing_submission",
    timestamps: false,
  },
);

BillingSubmission.associate = (models) => {
  BillingSubmission.belongsTo(models.PbgMaster, {
    foreignKey: "pbg_id",
    as: "pbg",
  });
};

module.exports = BillingSubmission;

