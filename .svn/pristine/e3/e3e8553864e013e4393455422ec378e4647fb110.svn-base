const catchAsync = require("../../../utils/catchAsync");
const BankService = require("./bank.service");
const sequelize = require("../../../utils/database");

// Get Qualification By ID
const getBankById = catchAsync(async (req, res, next) => {
      const whereCondition = {
         employee_id: req.params.employeeId 
     };

    const result = await BankService.getById({where: whereCondition});
    if (!result || result.length === 0) {
        return res.status(404).json({
            status: "fail",
            message: "No Bank details found for this employee"
        });
    }

    res.status(200).json({
        status: "success",
        data: result
    });
});

const assignBank = catchAsync(async (req, res, next) => {

    const { employeeId } = req.params;

    await sequelize.transaction(async (t) => {
        await BankService.assignBank(employeeId, req.body, t);
    });

    res.status(201).json({
        status: "success",
        message: "Bank assigned successfully"
    });
});
const updateBank = catchAsync(async (req, res, next) => {
    const { employeeId } = req.params;

    const result = await sequelize.transaction(async (t) => {

        return await BankService.updateBank(
            employeeId,
            req.body,
            t
        );
    });

    res.status(200).json({
        status: "success",
        data: result
    });
});
module.exports = {
getBankById,
assignBank,
updateBank
};