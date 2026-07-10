const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const EmployeeExamination = sequelize.define(
    "EmployeeExamination",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        employee_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        examination_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        exam_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        marks_obtained: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        result_status: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        certificate_number: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "employee_examinations",
        schema: "pmu",
        timestamps: false
    }
);

EmployeeExamination.associate = (models) => {

    EmployeeExamination.belongsTo(models.Employee, {
        foreignKey: "employee_id",
        as: "employee",
        onDelete: "CASCADE"
    });

    EmployeeExamination.belongsTo(models.ExaminationMaster, {
        foreignKey: "examination_id",
        as: "examination",
        onDelete: "CASCADE"
    });

};

module.exports = EmployeeExamination;
