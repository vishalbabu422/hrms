const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeAsset = sequelize.define('EmployeeAsset', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    asset_name: {
        type: DataTypes.STRING(150)
    },

    asset_code: {
        type: DataTypes.STRING(50)
    },

    asset_issue_date: {
        type: DataTypes.DATEONLY
    },

    asset_return_date: {
        type: DataTypes.DATEONLY
    },

    quantity_issued: {
        type: DataTypes.INTEGER
    },

    should_be_returned: {
        type: DataTypes.BOOLEAN
    },

    return_expected_by: {
        type: DataTypes.DATEONLY
    },

    quantity_returned: {
        type: DataTypes.INTEGER
    },

    remarks: {
        type: DataTypes.TEXT
    },

    total_damage_worth: {
        type: DataTypes.DECIMAL(12, 2)
    }

}, {
    tableName: 'employee_assets',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
});

EmployeeAsset.associate = (models) => {

    EmployeeAsset.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeAsset;
