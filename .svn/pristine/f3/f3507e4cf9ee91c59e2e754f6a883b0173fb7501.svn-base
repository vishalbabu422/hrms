const catchAsync = require("../../../utils/catchAsync");
const VehicleService = require("./vehicle.service");
const sequelize = require("../../../utils/database");

// Get Vehicles By Employee Id
const getVehiclesByEmployeeId = catchAsync(async (req, res) => {

    const whereCondition = {
        employee_id: req.params.employeeId
    };

    const result = await VehicleService.getVehicles({ where: whereCondition });

    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No vehicle details found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });

});


// Assign Vehicle
const assignVehicle = catchAsync(async (req, res) => {

    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await VehicleService.assignVehicle(
            employeeId,
            req.body,
            t
        );

    });

    res.status(201).json({
        status: "success",
        message: "Vehicle details created successfully",
        data: result
    });

});

// Update Vehicle
const updateVehicle = catchAsync(async (req, res) => {

    const { employeeId, vehicleId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await VehicleService.updateVehicle(
            employeeId,
            vehicleId,
            req.body,
            t
        );

    });

    res.status(200).json({
        status: "success",
        message: "Vehicle details updated successfully",
        data: result
    });

});

module.exports = {
    getVehiclesByEmployeeId,
    assignVehicle,
    updateVehicle
};