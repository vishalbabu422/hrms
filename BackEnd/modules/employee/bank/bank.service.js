const { EmployeeBankDetail,Employee } = require("../../../models");
const AppError = require("../../../utils/appError");
const sequelize = require("../../../utils/database");

exports.getById = async (queryOptions) => {
    return await EmployeeBankDetail.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });
};

exports.assignBank = async (employeeId, bankData, transaction) => {

    // Check employee exists
    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) throw new AppError("Employee not found", 404);

     const existingBankDetails = await EmployeeBankDetail.findOne({
        where: {
            employee_id: employeeId
        },
        transaction
    });    

    if (existingBankDetails) {
        throw new AppError("Bank details already exists for this employee", 409);
    }
    

    // Create only
    return await EmployeeBankDetail.create(
        {
            ...bankData,
            employee_id: employeeId
        },
        { transaction }
    );
};

exports.updateBank = async (employeeId, bankData, transaction) => {

    const bank = await EmployeeBankDetail.findOne({
        where: {
            employee_id: employeeId
        },
        transaction
    });

    if (!bank) {
        throw new AppError("Bank not found", 404);
    }

    return await bank.update(bankData, { transaction });
};