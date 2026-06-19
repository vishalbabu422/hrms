const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeDetail = sequelize.define('EmployeeDetail', {

    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },

    employee_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true  
    },

    dob: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    birth_place: {
        type: DataTypes.STRING(100)
    },

    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: false
    },

    marital_status: {
        type: DataTypes.ENUM('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED')
    },

    marriage_date: {
        type: DataTypes.DATEONLY
    },

    father_name: {
        type: DataTypes.STRING(150)
    },

    mother_name: {
        type: DataTypes.STRING(150)
    },

    religion: {
        type: DataTypes.STRING(50)
    },

    nationality: {
        type: DataTypes.STRING(50)
    },

    alternate_email: {
        type: DataTypes.STRING(120),
        validate: { isEmail: true }
    },

    emergency_contact_no: {
        type: DataTypes.STRING(20)
    },

    blood_group: {
        type: DataTypes.STRING(10)
    },

    // Encrypted fields (bytea → BLOB)
    pan_enc: DataTypes.BLOB,
    pan_iv: DataTypes.BLOB,
    pan_hash: {
        type: DataTypes.STRING(64),
        unique: true
    },

    aadhaar_enc: DataTypes.BLOB,
    aadhaar_iv: DataTypes.BLOB,
    aadhaar_hash: {
        type: DataTypes.STRING(64),
        unique: true
    },

    voter_enc: DataTypes.BLOB,
    voter_iv: DataTypes.BLOB,
    voter_hash: {
        type: DataTypes.STRING(64),
        unique: true
    },

    passport_enc: DataTypes.BLOB,
    passport_iv: DataTypes.BLOB,
    passport_hash: {
        type: DataTypes.STRING(64),
        unique: true
    },

    visa: DataTypes.STRING(30),
    pran_number: DataTypes.STRING(30),
    esic_number: DataTypes.STRING(30),
    mgnrega_number: DataTypes.STRING(40),
    epfo_number: DataTypes.STRING(30),
    eps_number: DataTypes.STRING(30),
    uan_number: DataTypes.STRING(30),
    pf_number: DataTypes.STRING(30),

    pf_joining_date: DataTypes.DATEONLY,
    pf_exit_date: DataTypes.DATEONLY,

    lwf: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    professional_tax: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    vendor_code: DataTypes.STRING(30)

}, {
    tableName: 'employee_details',
    schema: 'pmu',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

EmployeeDetail.associate = (models) => {

    EmployeeDetail.belongsTo(models.Employee, {
        foreignKey: 'employee_id',
        onDelete: 'CASCADE'
    });

};

module.exports = EmployeeDetail;
