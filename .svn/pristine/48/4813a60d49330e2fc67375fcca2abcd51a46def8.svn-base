const catchAsync = require("../../../utils/catchAsync");
const AssetService = require("./asset.service");
const sequelize = require("../../../utils/database");


// Get Assets By Employee Id
const getAssetsByEmployeeId = catchAsync(async (req, res) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await AssetService.getAssets({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No asset details found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });

});


// Assign Asset
const assignAsset = catchAsync(async (req, res) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await AssetService.assignAsset(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Asset assigned successfully",
        data: result
    });

});


// Update Asset
const updateAsset = catchAsync(async (req, res) => {

    const { employeeId, assetId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await AssetService.updateAsset(
            employeeId,
            assetId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Asset updated successfully",
        data: result
    });

});


module.exports = {
    getAssetsByEmployeeId,
    assignAsset,
    updateAsset
};