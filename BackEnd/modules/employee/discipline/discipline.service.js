const { EmployeeDiscipline, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


// Get Discipline Records
exports.getDisciplines = async (queryOptions) => {

    return await EmployeeDiscipline.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });

};


// Add Discipline Record
exports.addDiscipline = async (employeeId, disciplineData, transaction) => {

    const employee = await Employee.findByPk(employeeId, { transaction });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }
    
    // Duplicate discipline check
    const existingDiscipline = await EmployeeDiscipline.findOne({
        where: {
            employee_id: employeeId,
            offence: disciplineData.offence,
            offence_date: disciplineData.offence_date
        }
    });

    if (existingDiscipline) {
        throw new AppError("Discipline record already exists for this offence and date", 400);
    }

    return await EmployeeDiscipline.create(
        {
            ...disciplineData,
            employee_id: employeeId
        },
        { transaction }
    );

};

// Update Discipline Record
exports.updateDiscipline = async (employeeId, disciplineId, disciplineData, transaction) => {

    const discipline = await EmployeeDiscipline.findOne({
        where: {
            id: disciplineId,
            employee_id: employeeId
        },
        transaction
    });

    if (!discipline) {
        throw new AppError("Discipline record not found", 404);
    }

    return await discipline.update(disciplineData, { transaction });
};