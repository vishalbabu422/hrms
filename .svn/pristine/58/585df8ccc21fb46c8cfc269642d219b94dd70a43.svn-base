const {
    WoMilestone,
    WorkOrder
} = require("../../../models");

const AppError = require("../../../utils/appError");

exports.getMilestoneById = async (queryOptions) => {

    return await WoMilestone.findOne({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });

};


exports.addMilestone = async (data, transaction) => {

    const { grand_total, milestones } = data;

    if (!milestones || milestones.length === 0) {
        throw new AppError("Milestones are required", 400);
    }

    const workOrder = await WorkOrder.findByPk(
        milestones[0].work_order_id,
        { transaction }
    );

    if (!workOrder) {
        throw new AppError("Work Order not found", 404);
    }

    const createdMilestones = await WoMilestone.bulkCreate(
        milestones,
        {
            transaction,
            returning: true
        }
    );

    await workOrder.update(
        {
            grand_total
        },
        {
            transaction
        }
    );

    return {
        grand_total,
        milestones: createdMilestones
    };
};


exports.updateMilestone = async (
    id,
    milestoneData,
    transaction
) => {

    const milestone = await WoMilestone.findByPk(
        id,
        { transaction }
    );

    if (!milestone)
        throw new AppError("Work Order Milestone not found", 404);

    return await milestone.update(
        milestoneData,
        { transaction }
    );

};


exports.deleteMilestone = async (
    id,
    transaction
) => {

    const milestone = await WoMilestone.findByPk(
        id,
        { transaction }
    );

    if (!milestone)
        throw new AppError("Work Order Milestone not found", 404);

    await milestone.update(
        {
            is_active: false
        },
        {
            transaction
        }
    );

    return true;
};