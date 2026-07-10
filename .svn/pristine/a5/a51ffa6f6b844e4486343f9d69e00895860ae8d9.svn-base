const catchAsync = require("../../../utils/catchAsync");
const DisciplineService = require("./discipline.service");
const sequelize = require("../../../utils/database");


// Get Discipline Records By Employee Id
const getDisciplineByEmployeeId = catchAsync(async (req, res) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await DisciplineService.getDisciplines({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No discipline records found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });

});


// Add Discipline Record
const addDiscipline = catchAsync(async (req, res) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await DisciplineService.addDiscipline(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Discipline record added successfully",
        data: result
    });

});


// Update Discipline Record
const updateDiscipline = catchAsync(async (req, res) => {

    const { employeeId, disciplineId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await DisciplineService.updateDiscipline(
            employeeId,
            disciplineId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Discipline record updated successfully",
        data: result
    });

});


module.exports = {
    getDisciplineByEmployeeId,
    addDiscipline,
    updateDiscipline
};