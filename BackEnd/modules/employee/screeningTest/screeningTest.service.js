const { EmployeeScreeningTest, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


exports.getScreeningTestById = async (queryOptions) => {
    return await EmployeeScreeningTest.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });
};


exports.assignScreeningTest = async (employeeId, screeningTestData, transaction) => {

    // Check employee exists
    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) throw new AppError("Employee not found", 404);

    const existingTest = await EmployeeScreeningTest.findOne({
        where: {
            employee_id: employeeId
        },
        transaction
    });

    if (existingTest) {
        throw new AppError("Screening test already exists for this employee", 400);
    }

    return await EmployeeScreeningTest.create(
        {
            ...screeningTestData,
            employee_id: employeeId
        },
        { transaction }
    );
};


exports.updateScreeningTest = async (employeeId, screeningTestData, transaction) => {

    const screeningTest = await EmployeeScreeningTest.findOne({
        where: {
            employee_id: employeeId
        },
        transaction
    });

    if (!screeningTest) {
        throw new AppError("Screening test not found", 404);
    }

    return await screeningTest.update(screeningTestData, { transaction });
};