const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeBankDetail = sequelize.define('EmployeeBankDetail', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        unique: true   // UNIQUE constraint
    },

    bank_name: {
        type: DataTypes.STRING(120)
    },

    branch_name: {
        type: DataTypes.STRING(120)
    },

    bank_address: {
        type: DataTypes.TEXT
    },

    account_number: {
        type: DataTypes.STRING(40)
    },

    ifsc: {
        type: DataTypes.STRING(20)
    },

    micr_code: {
        type: DataTypes.STRING(20)
    }

}, {
    tableName: 'employee_bank_details',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

EmployeeBankDetail.associate = (models) => {

    EmployeeBankDetail.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeBankDetail;
