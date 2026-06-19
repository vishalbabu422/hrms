const { ExaminationMaster, EmployeeExamination } = require("../../../models");
const AppError = require("../../../utils/appError");
const sequelize = require("../../../utils/database");

exports.createExamination = async (body) => {
    return ExaminationMaster.create(body);
};

exports.findAllExaminations = async (queryOptions) => {
    return await ExaminationMaster.findAndCountAll({
        ...queryOptions,
        where: {
            is_deleted: false,
            ...queryOptions.where
        }
    });
};

exports.findExaminationById = async (queryOptions) => {
    return await ExaminationMaster.findOne({
        ...queryOptions,
        where: {
            is_deleted: false,
            ...queryOptions.where
        }
    });
};

exports.updateExamination = async (id, payload, user, isSuperAdmin) => {

    return await sequelize.transaction(async (t) => {

        const whereCondition = {
            id,
            is_deleted: false
        };

        if (!isSuperAdmin) {
            whereCondition.organization_id = user.organization_id;
        }

        const exam = await ExaminationMaster.findOne({
            where: whereCondition,
            transaction: t
        });

        if (!exam) {
            throw new AppError("Examination not found", 404);
        }

        delete payload.organization_id;
        delete payload.is_deleted;

        if (payload.exam_name) {
            payload.exam_name = payload.exam_name.trim().toLowerCase();
        }

        await exam.update(payload, { transaction: t });

        return exam;
    });
};

exports.deleteExamination = async (id, user, isSuperAdmin) => {

    return await sequelize.transaction(async (t) => {

        const whereCondition = {
            id,
            is_deleted: false
        };

        if (!isSuperAdmin) {
            whereCondition.organization_id = user.organization_id;
        }

        const exam = await ExaminationMaster.findOne({
            where: whereCondition,
            transaction: t
        });

        if (!exam) {
            throw new AppError("Examination not found", 404);
        }

        // Prevent delete if employees assigned
        const employeeCount = await EmployeeExamination.count({
            where: { examination_id: id },
            transaction: t
        });

        if (employeeCount > 0) {
            throw new AppError(
                "Cannot delete examination assigned to employees",
                400
            );
        }

        await exam.update(
            { is_deleted: true },
            { transaction: t }
        );

        return true;
    });

};