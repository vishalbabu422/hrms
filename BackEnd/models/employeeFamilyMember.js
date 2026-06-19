const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeFamilyMember = sequelize.define('EmployeeFamilyMember', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: true   
    },

    relation: {
        type: DataTypes.ENUM(
            'SPOUSE',
            'CHILD',
            'FATHER',
            'MOTHER',
            'SIBLING'
        )
    },

    name: {
        type: DataTypes.STRING(150)
    },

    dob: {
        type: DataTypes.DATEONLY
    },

    gender: {
        type: DataTypes.STRING(20)
    },

    pan_number: {
        type: DataTypes.STRING(20)
    },

    is_dependent: {
        type: DataTypes.BOOLEAN
    }

}, {
    tableName: 'employee_family_members',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    
});

EmployeeFamilyMember.associate = (models) => {

    EmployeeFamilyMember.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeFamilyMember;
