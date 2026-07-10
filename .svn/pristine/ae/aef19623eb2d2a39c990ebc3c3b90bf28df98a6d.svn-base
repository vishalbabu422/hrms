const catchAsync = require("../../../utils/catchAsync");
const PassportVisaService = require("./passportVisa.service");
const sequelize = require("../../../utils/database");


// Get Passport & Visa Details By Employee Id
const getPassportVisaByEmployeeId = catchAsync(async (req, res) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await PassportVisaService.getPassportVisa({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No passport or visa details found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });

});


// Add Passport & Visa Details
const addPassportVisa = catchAsync(async (req, res) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await PassportVisaService.addPassportVisa(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Passport and visa details added successfully",
        data: result
    });

});


// Update Passport & Visa Details
const updatePassportVisa = catchAsync(async (req, res) => {

    const { employeeId, passportVisaId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await PassportVisaService.updatePassportVisa(
            employeeId,
            passportVisaId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Passport and visa details updated successfully",
        data: result
    });

});


module.exports = {
    getPassportVisaByEmployeeId,
    addPassportVisa,
    updatePassportVisa
};