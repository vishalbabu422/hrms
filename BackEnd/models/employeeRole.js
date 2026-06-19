const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeRole = sequelize.define('EmployeeRole', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    role_id: {
        type: DataTypes.BIGINT,
        allowNull: false
    },

    organization_id: DataTypes.BIGINT,

    assigned_by: DataTypes.BIGINT,

    assigned_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {
    tableName: 'employee_roles',
    schema: 'pmu',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['employee_id', 'role_id']
        }
    ]
});

EmployeeRole.associate = (models) => {

    EmployeeRole.belongsTo(models.Employee, {
        foreignKey: 'employee_id', 
        as: "Employee"
    });

    EmployeeRole.belongsTo(models.RoleMaster, {
        foreignKey: 'role_id',
        as: "RoleMaster"
    });

    EmployeeRole.belongsTo(models.Employee, {
        as: 'AssignedBy',
        foreignKey: 'assigned_by'
    });

};

module.exports = EmployeeRole;

