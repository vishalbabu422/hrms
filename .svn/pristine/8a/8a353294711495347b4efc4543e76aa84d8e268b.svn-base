const { EmployeeDetail, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");

// Get Employee Details by query
exports.getDetailsById = async (queryOptions) => {
    return await EmployeeDetail.findOne({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });
};

// Add Employee Details
exports.addDetails = async (employeeId, detailData, transaction) => {

    // Check if employee exists
    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    // Check if details already exist
    const existingDetails = await EmployeeDetail.findOne({
        where: { employee_id: employeeId },
        transaction
    });

    if (existingDetails) {
        throw new AppError("Employee details already exist", 400);
    }

    // Create new details
    return await EmployeeDetail.create(
        {
            ...detailData,
            employee_id: employeeId
        },
        { transaction }
    );
};

// Update Employee Details
exports.updateDetails = async (employeeId, detailData, transaction) => {

    const details = await EmployeeDetail.findOne({
        where: { employee_id: employeeId },
        transaction
    });

    if (!details) {
        throw new AppError("Employee details not found", 404);
    }

    return await details.update(detailData, { transaction });
};