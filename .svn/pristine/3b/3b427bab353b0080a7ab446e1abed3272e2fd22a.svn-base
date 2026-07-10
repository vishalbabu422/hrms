const { EmployeeVaccination, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");

exports.getVaccination = async (queryOptions) => {

    return await EmployeeVaccination.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });

};

exports.assignVaccination = async (employeeId, vaccinationData, transaction) => {

    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) throw new AppError("Employee not found", 404);

    // Prevent duplicate vaccination
    const existingVaccination = await EmployeeVaccination.findOne({
        where: {
            employee_id: employeeId,
            vaccination_name: vaccinationData.vaccination_name
        },
        transaction
    });

    if (existingVaccination) {
        throw new AppError(
            "This vaccination already exists for this employee", 400
        );
    }

    return await EmployeeVaccination.create(
        {
            ...vaccinationData,
            employee_id: employeeId
        },
        { transaction }
    );
};

exports.updateVaccination = async (employeeId, vaccinationId, vaccinationData, transaction) => {

    const vaccination = await EmployeeVaccination.findOne({
        where: {
            id: vaccinationId,
            employee_id: employeeId
        },
        transaction
    });
    if (!vaccination) {
        throw new AppError("Vaccination record not found", 404);
    }

    return await vaccination.update(vaccinationData, { transaction });

};