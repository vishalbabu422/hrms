const { DivisionMaster, EmployeeDivision } = require("../../../models");
const AppError = require("../../../utils/appError");
const sequelize = require("../../../utils/database");
const { Op } = require("sequelize");

exports.create = async (payload) => {
    return await sequelize.transaction(async (t) => {
        const divisionName = payload.division_name?.trim();
        if (!divisionName) {
            throw new AppError("division_name is required", 400);
        }

        // Validate parent division (if provided)
        if (payload.parent_division_id) {
            const parent = await DivisionMaster.findOne({
                where: {
                    id: payload.parent_division_id,
                    organization_id: payload.organization_id,
                    is_deleted: false
                },
                transaction: t
            });

            if (!parent) {
                throw new AppError("Invalid parent division", 400);
            }
        }
        try {
            const division = await DivisionMaster.create(
                {
                    ...payload,
                    division_name: divisionName
                },
                { transaction: t }
            );

            return division;

        } catch (error) {

            if (error.name === "SequelizeUniqueConstraintError") {
                throw new AppError("Division already exists in this organization", 400);
            }

            throw error;
        }
    });
};

exports.findAll = async (queryOptions) => {
    return await DivisionMaster.findAndCountAll({
        ...queryOptions,
        where: {
            is_deleted: false,
            ...queryOptions.where
        }
    });
};

exports.findById = async (queryOptions) => {
    return await DivisionMaster.findOne({
        ...queryOptions,
        where: {
            is_deleted: false,
            ...queryOptions.where
        }
    });
};

exports.update = async (id, payload, user, isSuperAdmin) => {

    return await sequelize.transaction(async (t) => {

        const whereCondition = {
            id,
            is_deleted: false
        };

        if (!isSuperAdmin) {
            whereCondition.organization_id = user.organization_id;
        }

        const division = await DivisionMaster.findOne({
            where: whereCondition,
            transaction: t
        });

        if (!division) {
            throw new AppError("Division not found", 404);
        }

        delete payload.organization_id;
        delete payload.is_deleted;

        if (payload.division_name) {
            payload.division_name = payload.division_name.trim();
        }

        // Prevent self-parent
        if (payload.parent_division_id === Number(id)) {
            throw new AppError("Division cannot be its own parent", 400);
        }

        await division.update(payload, { transaction: t });

        return division;
    });
};

exports.delete = async (id, user, isSuperAdmin) => {
    return await sequelize.transaction(async (t) => {

        const whereCondition = {
            id,
            is_deleted: false
        };

        if (!isSuperAdmin) {
            whereCondition.organization_id = user.organization_id;
        }

        const division = await DivisionMaster.findOne({
            where: whereCondition,
            transaction: t
        });

        if (!division) {
            throw new AppError("Division not found", 404);
        }

        // Prevent delete if employees assigned
        const employeeCount = await EmployeeDivision.count({
            where: { division_id: id },
            transaction: t
        });

        if (employeeCount > 0) {
            throw new AppError(
                "Cannot delete division assigned to employees",
                400
            );
        }

        await division.update(
            { is_deleted: true },
            { transaction: t }
        );

        return true;
    });
};

