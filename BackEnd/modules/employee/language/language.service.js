const { EmployeeLanguage, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


// Get Languages
exports.getLanguages = async (queryOptions) => {

    return await EmployeeLanguage.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });
};

// Add Language
exports.addLanguage = async (employeeId, languageData, transaction) => {

    const employee = await Employee.findByPk(employeeId, { transaction });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    // Duplicate language check
    const existingLanguage = await EmployeeLanguage.findOne({
        where: {
            employee_id: employeeId,
            language_name: languageData.language_name
        }
    });

    if (existingLanguage) {
        throw new AppError("Language already exists for this employee", 400);
    }

    return await EmployeeLanguage.create(
        {
            ...languageData,
            employee_id: employeeId
        },
        { transaction }
    );

};


// Update Language
exports.updateLanguage = async (employeeId, languageId, languageData, transaction) => {

    const language = await EmployeeLanguage.findOne({
        where: {
            id: languageId,
            employee_id: employeeId
        },
        transaction
    });

    if (!language) {
        throw new AppError("Language record not found", 404);
    }

    return await language.update(languageData, { transaction });

};