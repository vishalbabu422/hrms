const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeInsurance = sequelize.define('EmployeeInsurance', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: true   // DB me NOT NULL nahi hai
    },

    insurance_company: {
        type: DataTypes.STRING(150)
    },

    policy_number: {
        type: DataTypes.STRING(100)
    },

    from_date: {
        type: DataTypes.DATEONLY
    },

    to_date: {
        type: DataTypes.DATEONLY
    },

    sum_insured: {
        type: DataTypes.DECIMAL(14, 2)
    },

    policy_premium: {
        type: DataTypes.DECIMAL(14, 2)
    },

    family_members_covered: {
        type: DataTypes.TEXT
    }

}, {
    tableName: 'employee_insurances',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

EmployeeInsurance.associate = (models) => {

    EmployeeInsurance.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeInsurance;
