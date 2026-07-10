const { EmployeeLtc, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


exports.getLtcByEmployeeId = async (queryOptions) => {
    return await EmployeeLtc.findOne({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });
};


exports.assignLtc = async (employeeId, ltcData, transaction) => {
    
    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) throw new AppError("Employee not found", 404);

    const existingLtc = await EmployeeLtc.findOne({
        where: { employee_id: employeeId },
        transaction
    });

    if (existingLtc) {
        throw new AppError("LTC already exists for this employee", 400);
    }

    return await EmployeeLtc.create(
        {
            ...ltcData,
            employee_id: employeeId
        },
        { transaction }
    );
};


exports.updateLtc = async (employeeId, ltcData, transaction) => {

    const ltc = await EmployeeLtc.findOne({
        where: { employee_id: employeeId },
        transaction
    });

    if (!ltc) {
        throw new AppError("LTC record not found", 404);
    }

    // Check update allowed
    if (!ltc.can_update) {
        throw new AppError("LTC can only be updated once", 400);
    }

    const updated = await ltc.update(
        {
            ...ltcData,
            can_update: false
        },
        { transaction }
    );

    return updated;
};