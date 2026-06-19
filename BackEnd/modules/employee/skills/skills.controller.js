const catchAsync = require("../../../utils/catchAsync");
const SkillService = require("./skills.service");
const sequelize = require("../../../utils/database");

// Get Skills By Employee ID
const getSkillsByEmployeeId = catchAsync(async (req, res, next) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await SkillService.getSkillById({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No skills found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });
});


// Assign Skill
const assignSkill = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

       return await SkillService.assignSkill(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Skill assigned successfully",
        data : result
    });
});


// Update Skill
const updateSkill = catchAsync(async (req, res, next) => {

    const { employeeId, skillId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await SkillService.updateSkill(
            employeeId,
            skillId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Skill updated successfully",
        data: result
    });
});;

module.exports = {
    getSkillsByEmployeeId,
    assignSkill,
    updateSkill
};