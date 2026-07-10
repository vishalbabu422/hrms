const { DataTypes, NOW } = require("sequelize");
const sequelize = require("../utils/database");

const audienceMaster = sequelize.define(
    "audienceMaster",

    {
        id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        audience_code: {
            type: DataTypes.STRING(6),
            allowNull: false,

        },
        name: {
            type: DataTypes.STRING(255),
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },

    },
    {
        schema: "kms",
        tableName: "kmsv6_audience_masters",
        timestamps: false,
    }
);
module.exports = audienceMaster;
