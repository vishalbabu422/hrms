const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeAddress = sequelize.define('EmployeeAddress', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: true
    },

    address_type: {
        type: DataTypes.ENUM(
            'CORRESPONDENCE',
            'PERMANENT',
            'OFFICE',
            'CLIENT_OFFICE'
        ),
        allowNull: false
    },

    address_line1: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    address_line2: {
        type: DataTypes.TEXT
    },

    landmark: {
        type: DataTypes.TEXT
    },

    city: {
        type: DataTypes.STRING(100)
    },

    district: {
        type: DataTypes.STRING(100)
    },

    state: {
        type: DataTypes.STRING(100)
    },

    country: {
        type: DataTypes.STRING(100),
        defaultValue: 'India'
    },

    pin_code: {
        type: DataTypes.STRING(10)
    },

    is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
        
    }

}, {
    tableName: 'employee_addresses',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
});

EmployeeAddress.associate = (models) => {

    EmployeeAddress.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeAddress;
