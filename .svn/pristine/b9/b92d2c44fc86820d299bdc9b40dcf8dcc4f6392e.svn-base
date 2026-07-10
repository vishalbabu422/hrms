const catchAsync = require("../../../utils/catchAsync");
const HobbyService = require("./hobby.service");
const sequelize = require("../../../utils/database");

// Get Hobbies By Employee Id
const getHobbiesByEmployeeId = catchAsync(async (req, res) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await HobbyService.getHobbies({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No hobby details found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });

});


// Add Hobby
const addHobby = catchAsync(async (req, res) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await HobbyService.addHobby(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Hobby created successfully",
        data: result
    });

});


// Update Hobby
const updateHobby = catchAsync(async (req, res) => {

    const { employeeId, hobbyId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await HobbyService.updateHobby(
            employeeId,
            hobbyId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Hobby updated successfully",
        data: result
    });

});

module.exports = {
    getHobbiesByEmployeeId,
    addHobby,
    updateHobby
};