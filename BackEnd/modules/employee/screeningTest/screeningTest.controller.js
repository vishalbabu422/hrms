const catchAsync = require("../../../utils/catchAsync");
const ScreeningTestService = require("./screeningTest.service");
const sequelize = require("../../../utils/database");

// Get Screening Test By Employee ID
const getScreeningTestById = catchAsync(async (req, res, next) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await ScreeningTestService.getScreeningTestById ({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No Screening Test found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });
});


// Assign Screening Test
const assignScreeningTest = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {
        return await ScreeningTestService.assignScreeningTest(employeeId, req.body, t);
    });

    res.status(201).json({
        status: "success",
        message: "Screening Test added successfully",
        data: result
    });
});


// Update Screening Test
const updateScreeningTest = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await ScreeningTestService.updateScreeningTest(
            employeeId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Screening Test updated successfully",
        data: result
    });
});

module.exports = {
    getScreeningTestById,
    assignScreeningTest,
    updateScreeningTest
};