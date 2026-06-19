const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const ExaminationMaster = sequelize.define(
    "ExaminationMaster",
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },

        organization_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },

        exam_name: {
            type: DataTypes.STRING(200),
            allowNull: false
        },

        exam_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        passing_marks: {
            type: DataTypes.INTEGER,
            allowNull: true
        },

        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },

        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: "examinations",
        schema: "pmu",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            {
                unique: true,
                fields: ["organization_id", "exam_name"]
            }
        ]
    }
);

ExaminationMaster.associate = (models) => {

    ExaminationMaster.belongsTo(models.Organization, {
        foreignKey: "organization_id",
        as: "organization"
    });

    ExaminationMaster.hasMany(models.EmployeeExamination, {
        foreignKey: "examination_id",
        as: "employeeExaminations"
    });

};

module.exports = ExaminationMaster;
