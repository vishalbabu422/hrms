const { EmployeePassportVisaDetail, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


// Get Passport & Visa Details
exports.getPassportVisa = async (queryOptions) => {

    return await EmployeePassportVisaDetail.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });

};

// Add Passport & Visa Details
exports.addPassportVisa = async (employeeId, passportVisaData, transaction) => {

    const employee = await Employee.findByPk(employeeId, { transaction });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    // Duplicate passport check
    const existingPassport = await EmployeePassportVisaDetail.findOne({
        where: {
            employee_id: employeeId,
            passport_number: passportVisaData.passport_number
        }
    });

    if (existingPassport) {
        throw new AppError("Passport already exists for this employee", 400);
    }

    return await EmployeePassportVisaDetail.create(
        {
            ...passportVisaData,
            employee_id: employeeId
        },
        { transaction }
    );

};


// Update Passport & Visa Details
exports.updatePassportVisa = async (employeeId, passportVisaId, passportVisaData, transaction) => {

    const passportVisa = await EmployeePassportVisaDetail.findOne({
        where: {
            id: passportVisaId,
            employee_id: employeeId
        },
        transaction
    });

    if (!passportVisa) {
        throw new AppError("Passport/Visa record not found", 404);
    }

    return await passportVisa.update(passportVisaData, { transaction });

};