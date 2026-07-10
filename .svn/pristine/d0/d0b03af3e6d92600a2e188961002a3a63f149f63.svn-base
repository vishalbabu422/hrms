const catchAsync = require("../../../utils/catchAsync");
const WoMilestoneService = require("./milestones.service");
const sequelize = require("../../../utils/database");

// Get Milestone By ID
const getMilestoneById = catchAsync(async (req, res, next) => {

    const whereCondition = {
        id: req.params.id
    };

    const result = await WoMilestoneService.getMilestoneById({
        where: whereCondition
    });

    if (!result) {
        return res.status(404).json({
            status: "fail",
            message: "Work Order Milestone not found"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });
});


// Add Milestone
const addMilestone = catchAsync(async (req, res, next) => {

    const result = await sequelize.transaction(async (t) => {
        return await WoMilestoneService.addMilestone(
            req.body,
            t
        );
    });

    res.status(201).json({
        status: "success",
        message: "Work Order Milestone added successfully",
        data: result
    });
});


// Update Milestone
const updateMilestone = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await WoMilestoneService.updateMilestone(
            id,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Work Order Milestone updated successfully",
        data: result
    });
});


// Delete Milestone
const deleteMilestone = catchAsync(async (req, res, next) => {

    const { id } = req.params;

    await sequelize.transaction(async (t) => {
        await WoMilestoneService.deleteMilestone(
            id,
            t
        );
    });

    res.status(200).json({
        status: "success",
        message: "Work Order Milestone deleted successfully"
    });
});

module.exports = {
    getMilestoneById,
    addMilestone,
    updateMilestone,
    deleteMilestone
};