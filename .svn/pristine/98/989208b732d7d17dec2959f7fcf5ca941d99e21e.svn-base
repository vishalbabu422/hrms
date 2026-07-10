const { EmployeeAsset, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


// Get Assets
exports.getAssets = async (queryOptions) => {

    return await EmployeeAsset.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });

};


// Assign Asset
exports.assignAsset = async (employeeId, assetData, transaction) => {

    const employee = await Employee.findByPk(employeeId, { transaction });

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    // Duplicate asset check
    const existingAsset = await EmployeeAsset.findOne({
        where: {
            employee_id: employeeId,
            asset_code: assetData.asset_code
        }
    });

    if (existingAsset) {
        throw new Error("Asset already exists for this employee", 400);
    }

    return await EmployeeAsset.create(
        {
            ...assetData,
            employee_id: employeeId
        },
        { transaction }
    );

};


// Update Asset
exports.updateAsset = async (employeeId, assetId, assetData, transaction) => {

    const asset = await EmployeeAsset.findOne({
        where: {
            id: assetId,
            employee_id: employeeId
        },
        transaction
    });

    if (!asset) {
        throw new AppError("Asset record not found", 404);
    }

    return await asset.update(assetData, { transaction });

};