const catchAsync = require("../../../utils/catchAsync");
const LanguageService = require("./language.service");
const sequelize = require("../../../utils/database");


// Get Languages By Employee Id
const getLanguagesByEmployeeId = catchAsync(async (req, res) => {
    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await LanguageService.getLanguages({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No language details found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });

});

// Add Language
const addLanguage = catchAsync(async (req, res) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await LanguageService.addLanguage(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Language added successfully",
        data: result
    });

});

// Update Language
const updateLanguage = catchAsync(async (req, res) => {

    const { employeeId, languageId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await LanguageService.updateLanguage(
            employeeId,
            languageId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Language updated successfully",
        data: result
    });

});

module.exports = {
    getLanguagesByEmployeeId,
    addLanguage,
    updateLanguage
};