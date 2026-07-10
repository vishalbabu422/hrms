const { EmployeeVehicle, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");


exports.getVehicles = async (queryOptions) => {

    return await EmployeeVehicle.findAll({
        ...queryOptions,
        where: {
            ...queryOptions.where
        }
    });

};

exports.assignVehicle = async (employeeId, vehicleData, transaction) => {

    const employee = await Employee.findByPk(employeeId, { transaction });
    if (!employee) throw new AppError("Employee not found", 404);

     // Duplicate vehicle check
    const existingVehicle = await EmployeeVehicle.findOne({
  where: {
    employee_id: employeeId,
    vehicle_registration_number: vehicleData.vehicle_registration_number
  }
});

if (existingVehicle) {
  throw new Error("Vehicle already exists for this employee");
}

    return await EmployeeVehicle.create(
        {
            ...vehicleData,
            employee_id: employeeId
        },
        { transaction }
    );

};


exports.updateVehicle = async (employeeId,vehicleId,vehicleData,transaction) => {

    const vehicle = await EmployeeVehicle.findOne({
        where: {
            id: vehicleId,
            employee_id: employeeId
        },
        transaction
    });

    if (!vehicle) {
        throw new AppError("Vehicle record not found", 404);
    }

    return await vehicle.update(vehicleData, { transaction });

};