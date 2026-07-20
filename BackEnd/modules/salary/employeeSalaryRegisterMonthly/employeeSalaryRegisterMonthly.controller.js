const catchAsync = require("../../../utils/catchAsync");
const Service = require("./employeeSalaryRegisterMonthly.service");
const sequelize = require("../../../utils/database");
const path = require("path");
const fs = require("fs");

const generateMonthlySalary = catchAsync(async (req, res) => {
    
  const result = await Service.generateMonthlySalary(req.body);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const dispatchSalary = catchAsync(async (req, res) => {
  const result = await sequelize.transaction(async (t) => {
    return await Service.dispatchSalary(req.body, t);
  });

  res.status(201).json({
    status: "success",
    ...result,
  });
});

const generateSalarySlip = catchAsync(async (req, res) => {

  const { register_id } = req.params;

  const result = await sequelize.transaction(async (t) => {

    return await Service.generateSalarySlip(
      register_id,
      t
    );
  });

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const downloadSalarySlip = catchAsync(async (req, res) => {

  const { register_id } = req.params;

  const register = await Service.downloadSalarySlip(register_id);

  if (!register) {
    return res.status(404).json({
      status: "fail",
      message: "Salary register not found",
    });
  }

  if (
    !register.mon_salaryslip_generated ||
    !register.mon_salaryslip_filepath
  ) {
    return res.status(404).json({
      status: "fail",
      message: "Salary slip not generated",
    });
  }

  const filePath = path.join(
    process.cwd(),
    register.mon_salaryslip_filepath.replace(/^\/+/, "")
  );

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: "fail",
      message: "Salary slip file not found",
    });
  }

  return res.download(
    filePath,
    register.mon_salaryslip_filename
  );
});

module.exports = {
  generateMonthlySalary,
  dispatchSalary,
  generateSalarySlip,
  downloadSalarySlip,
};
