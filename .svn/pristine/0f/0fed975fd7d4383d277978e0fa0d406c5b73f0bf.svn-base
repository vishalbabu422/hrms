const catchAsync = require("../../../utils/catchAsync");
const AchievementService = require("./achievement.service");
const sequelize = require("../../../utils/database");


// Get Achievements By Employee Id
const getAchievementsByEmployeeId = catchAsync(async (req, res) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await AchievementService.getAchievements({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No achievement details found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });

});


// Add Achievement
const addAchievement = catchAsync(async (req, res) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await AchievementService.addAchievement(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Achievement created successfully",
        data: result
    });

});


// Update Achievement
const updateAchievement = catchAsync(async (req, res) => {

    const { employeeId, achievementId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await AchievementService.updateAchievement(
            employeeId,
            achievementId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Achievement updated successfully",
        data: result
    });

});


module.exports = {
    getAchievementsByEmployeeId,
    addAchievement,
    updateAchievement
};