const catchAsync = require("../../../utils/catchAsync");
const DetailService = require("./detail.service");
const sequelize = require("../../../utils/database");

// Get Employee Details by ID
const getEmployeeDetailsById = catchAsync(async (req, res, next) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await DetailService.getDetailsById({ where: whereCondition });

    if (!result) {
        return res.status(404).json({
            status: "fail",
            message: "Employee details not found"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });

});


// Add Employee Details
const addEmployeeDetails = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await DetailService.addDetails(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Employee details added successfully",
        data: result
    });

});


// Update Employee Details
const updateEmployeeDetails = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await DetailService.updateDetails(
            employeeId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Employee details updated successfully",
        data: result
    });
});

module.exports = {
    getEmployeeDetailsById,
    addEmployeeDetails,
    updateEmployeeDetails
};