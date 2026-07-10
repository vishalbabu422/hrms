const { EmployeeInsurance, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


exports.getById = async (queryOptions) => {
    return await EmployeeInsurance.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });
};


exports.assignInsurance = async (employeeId, insuranceData, transaction) => {

    // Check employee exists
    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) throw new AppError("Employee not found", 404);

    const existingInsurance = await EmployeeInsurance.findOne({
        where: {
            employee_id: employeeId
        },
        transaction
    });

    if (existingInsurance) {
        throw new AppError("Insurance policy already exists for this employee", 409);
    }

    return await EmployeeInsurance.create(
        {
            ...insuranceData,
            employee_id: employeeId
        },
        { transaction }
    );
};


exports.updateInsurance = async (employeeId, insuranceData, transaction) => {

    const insurance = await EmployeeInsurance.findOne({
        where: {
            employee_id: employeeId
        },
        transaction
    });

    if (!insurance) {
        throw new AppError("Insurance not found", 404);
    }

    return await insurance.update(insuranceData, { transaction });
};