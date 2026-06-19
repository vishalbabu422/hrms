const { EmployeeHealth, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


exports.getHealthById = async (queryOptions) => {

    return await EmployeeHealth.findOne({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });

};

exports.assignHealth = async (employeeId, healthData, transaction) => {

    const employee = await Employee.findByPk(employeeId, { transaction });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    const existingHealth = await EmployeeHealth.findOne({
        where: {
            employee_id: employeeId
        },
        transaction
    });

    if (existingHealth) {
        throw new AppError("Health record already exists for this employee", 400);
    }

    return await EmployeeHealth.create(
        {
            ...healthData,
            employee_id: employeeId
        },
        { transaction }
    );

};


exports.updateHealth = async (employeeId, healthData, transaction) => {

    const health = await EmployeeHealth.findOne({
        where: {
            employee_id: employeeId
        },
        transaction
    });

    if (!health) {
        throw new AppError("Health record not found", 404);
    }

    return await health.update(healthData, { transaction });

};