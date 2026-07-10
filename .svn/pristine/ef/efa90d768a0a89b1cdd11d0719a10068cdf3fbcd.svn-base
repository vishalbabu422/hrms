const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeePassportVisaDetail = sequelize.define('EmployeePassportVisaDetail', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    passport_number: {
        type: DataTypes.STRING(30)
    },

    passport_issue_date: {
        type: DataTypes.DATEONLY
    },

    passport_expiry_date: {
        type: DataTypes.DATEONLY
    },

    passport_place_of_issue: {
        type: DataTypes.STRING(100)
    },

    passport_issuing_country: {
        type: DataTypes.STRING(100)
    },

    passport_type: {
        type: DataTypes.STRING(30)
    },

    visa_issuing_authority: {
        type: DataTypes.STRING(150)
    },

    visa_start_date: {
        type: DataTypes.DATEONLY
    },

    visa_end_date: {
        type: DataTypes.DATEONLY
    }

}, {
    tableName: 'employee_passport_visa_details',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

EmployeePassportVisaDetail.associate = (models) => {

    EmployeePassportVisaDetail.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeePassportVisaDetail;
