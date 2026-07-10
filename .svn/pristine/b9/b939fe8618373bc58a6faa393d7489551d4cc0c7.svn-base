const { EmployeeTraining, Employee, Document } = require("../../../models");
const AppError = require("../../../utils/appError");


// Get Training Records
exports.getTrainings = async (queryOptions) => {

    return await EmployeeTraining.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        },
        include: [
            {
                model: Document,
                required: false,
                where: {
                    doc_type: "TRAINING_CERT",
                    is_deleted: false
                }
            }
        ]
    });

};


// Add Training Record
exports.addTraining = async (employeeId, trainingData, transaction) => {

    const employee = await Employee.findByPk(employeeId, { transaction });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    // Duplicate training check
    const existingTraining = await EmployeeTraining.findOne({
        where: {
            employee_id: employeeId,
            training_name: trainingData.training_name,
        }
    });

    if (existingTraining) {
        throw new AppError("Training record already exists for this training and start date", 400);
    }

    return await EmployeeTraining.create(
        {
            ...trainingData,
            employee_id: employeeId
        },
        { transaction }
    );

};


// Update Training Record
exports.updateTraining = async (employeeId, trainingId, trainingData, transaction) => {

    const training = await EmployeeTraining.findOne({
        where: {
            id: trainingId,
            employee_id: employeeId
        },
        transaction
    });

    if (!training) {
        throw new AppError("Training record not found", 404);
    }

    return await training.update(trainingData, { transaction });
};