const catchAsync = require("../../../utils/catchAsync");
const Service = require("./employeeSalaryRegisterFinancial.service");

const generateFinancialSalary = catchAsync(async (req, res) => {

  const result = await Service.generateFinancialSalary(req.body);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

module.exports = {
  generateFinancialSalary,
};