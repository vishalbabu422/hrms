const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmpExtMapping = sequelize.define(
  "EmpExtMapping",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },

    empanelment_id_fk: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },

    ext_date: {
      type: DataTypes.DATEONLY,
    },

    doc_path: {
      type: DataTypes.STRING(255),
    },

  },
  {
    tableName: "emp_ext_mapping",
    schema: "pmu",
    timestamps: true,
    createdAt: "created",
    updatedAt: "updated_at",
  }
);

EmpExtMapping.associate = (models) => {

  EmpExtMapping.belongsTo(models.EmpanelmentMaster, {
    foreignKey: "empanelment_id_fk",
    onDelete: "CASCADE",
  });

};

module.exports = EmpExtMapping;
