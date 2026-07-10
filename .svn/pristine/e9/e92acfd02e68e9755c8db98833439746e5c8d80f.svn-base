const catchAsync = require("../../../utils/catchAsync");
const InsuranceService = require("./insurance.service");
const sequelize = require("../../../utils/database");

// Get Insurance By Employee ID
const getInsuranceById = catchAsync(async (req, res, next) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await InsuranceService.getById({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No Insurance found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });
});


// Assign Insurance
const assignInsurance = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    await sequelize.transaction(async (t) => {
        await InsuranceService.assignInsurance(employeeId, req.body, t);
    });

    res.status(201).json({
        status: "success",
        message: "Insurance added successfully"
    });
});

// Update Insurance
const updateInsurance = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await InsuranceService.updateInsurance(
            employeeId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        data: result
    });
});

module.exports = {
    getInsuranceById,
    assignInsurance,
    updateInsurance
};