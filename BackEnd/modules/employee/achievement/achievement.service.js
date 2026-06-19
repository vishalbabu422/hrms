const { EmployeeAchievement, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


// Get Achievements
exports.getAchievements = async (queryOptions) => {

    return await EmployeeAchievement.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });

};


// Add Achievement
exports.addAchievement = async (employeeId, achievementData, transaction) => {

    const employee = await Employee.findByPk(employeeId, { transaction });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    // Duplicate achievement check
    const existingAchievement = await EmployeeAchievement.findOne({
        where: {
            employee_id: employeeId,
            achievement: achievementData.achievement
        }
    });

    if (existingAchievement) {
        throw new Error("Achievement already exists for this employee" , 400);
    }

    return await EmployeeAchievement.create(
        {
            ...achievementData,
            employee_id: employeeId
        },
        { transaction }
    );

};


// Update Achievement
exports.updateAchievement = async (employeeId, achievementId, achievementData, transaction) => {

    const achievement = await EmployeeAchievement.findOne({
        where: {
            id: achievementId,
            employee_id: employeeId
        },
        transaction
    });

    if (!achievement) {
        throw new AppError("Achievement record not found", 404);
    }

    return await achievement.update(achievementData, { transaction });

};