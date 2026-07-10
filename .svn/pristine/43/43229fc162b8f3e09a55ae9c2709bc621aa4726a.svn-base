const catchAsync = require("../../../utils/catchAsync");
const VaccinationService = require("./vaccination.service");
const sequelize = require("../../../utils/database");

const getVaccinationsByEmployeeId = catchAsync(async (req, res) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await VaccinationService.getVaccination({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No vaccination records found"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });

});

const assignVaccination = catchAsync(async (req, res) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await VaccinationService.assignVaccination(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Vaccination added successfully",
        data: result
    });

});

const updateVaccination = catchAsync(async (req, res) => {

    const { employeeId, vaccinationId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await VaccinationService.updateVaccination(
            employeeId,
            vaccinationId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Vaccination updated successfully",
        data: result
    });

});

module.exports = {
    getVaccinationsByEmployeeId,
    assignVaccination,
    updateVaccination
};