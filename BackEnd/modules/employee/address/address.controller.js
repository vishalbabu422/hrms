const catchAsync = require("../../../utils/catchAsync");
const APIFeatures = require("../../../utils/apiFeature");
const AddressService = require("./address.service");
const sequelize = require("../../../utils/database");



// Get Address By ID
const getAddressById = catchAsync(async (req, res, next) => {
      const whereCondition = {
         employee_id: req.params.employeeId 
     };

    const result = await AddressService.getById({where: whereCondition});
    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No address found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });
});

const assignAddress = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    await sequelize.transaction(async (t) => {
        await AddressService.assignAddress(employeeId, req.body, t);
    });

    res.status(201).json({
        status: "success",
        message: "Address assigned successfully"
    });
});

const updateAddress = catchAsync(async (req, res, next) => {
    const { employeeId ,addressId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await AddressService.updateAddress(
            employeeId,
            addressId,
            req.body,
            t
        );
    });

    res.status(200).json({
        status: "success",
        data: result
    });
});

const deleteAddress = catchAsync(async (req, res, next) => {

    const { employeeId ,addressId } = req.params;

     const result = await sequelize.transaction(async (t) => {

        return await AddressService.deleteAddress(
            employeeId,
            addressId,
            req.body,
            t
        );
    });

    res.status(200).json({
        status: "success",
        message: "Address removed from primary successfully",
        data: result
    });
});

module.exports = {
 getAddressById,
 assignAddress,
 updateAddress,
 deleteAddress
};
