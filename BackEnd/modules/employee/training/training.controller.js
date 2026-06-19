const catchAsync = require("../../../utils/catchAsync");
const TrainingService = require("./training.service");
const sequelize = require("../../../utils/database");


// Get Training Records By Employee Id
const getTrainingByEmployeeId = catchAsync(async (req, res) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const trainings = await TrainingService.getTrainings({ where: whereCondition });

    if (!trainings || trainings.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No training records found for this employee"
        });
    }

    const result = trainings.map(t => ({
        ...t.toJSON(),
        certificate_uploaded: t.Documents && t.Documents.length > 0
    }));

    res.status(200).json({
        status: "success",
        data: result
    });

});


// Add Training Record
const addTraining = catchAsync(async (req, res) => {

    const { employeeId } = req.params;

    const data = {
        ...req.body,
        created_by: req.user.id
    };
    const result = await sequelize.transaction(async (t) => {

        return await TrainingService.addTraining(
            employeeId,
            data,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Training record added successfully",
        data: result
    });

});


// Update Training Record
const updateTraining = catchAsync(async (req, res) => {

    const { employeeId, trainingId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await TrainingService.updateTraining(
            employeeId,
            trainingId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Training record updated successfully",
        data: result
    });

});


module.exports = {
    getTrainingByEmployeeId,
    addTraining,
    updateTraining
};