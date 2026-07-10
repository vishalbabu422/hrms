const { EmployeeHobby, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");

// Get Hobbies
exports.getHobbies = async (queryOptions) => {

    return await EmployeeHobby.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });

};


// Add Hobby
exports.addHobby = async (employeeId, hobbyData, transaction) => {

    const employee = await Employee.findByPk(employeeId, { transaction });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    // Duplicate hobby check
    const existingHobby = await EmployeeHobby.findOne({
        where: {
            employee_id: employeeId,
            hobby: hobbyData.hobby
        }
    });

    if (existingHobby) {
        throw new Error("Hobby already exists for this employee");
    }

    return await EmployeeHobby.create(
        {
            ...hobbyData,
            employee_id: employeeId
        },
        { transaction }
    );

};


// Update Hobby
exports.updateHobby = async (employeeId, hobbyId, hobbyData, transaction) => {

    const hobby = await EmployeeHobby.findOne({
        where: {
            id: hobbyId,
            employee_id: employeeId
        },
        transaction
    });

    if (!hobby) {
        throw new AppError("Hobby record not found", 404);
    }

    return await hobby.update(hobbyData, { transaction });

};