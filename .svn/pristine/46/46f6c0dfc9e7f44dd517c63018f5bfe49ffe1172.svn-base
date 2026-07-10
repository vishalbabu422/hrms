const catchAsync = require("../../../utils/catchAsync");
const HealthService = require("./health.service");
const sequelize = require("../../../utils/database");

// Get Health Details
const getHealthByEmployeeId = catchAsync(async (req, res, next) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await HealthService.getHealthById({ where: whereCondition });

    if (!result) {
        return res.status(404).json({
            status: "fail",
            message: "Health record not found"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });

});


// Assign Health Record
const assignHealth = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await HealthService.assignHealth(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Health record added successfully",
        data: result
    });

});


// Update Health Record
const updateHealth = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await HealthService.updateHealth(
            employeeId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Health record updated successfully",
        data: result
    });

});

module.exports = {
    getHealthByEmployeeId,
    assignHealth,
    updateHealth
};