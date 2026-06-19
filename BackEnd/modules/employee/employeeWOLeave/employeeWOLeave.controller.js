const catchAsync = require("../../../utils/catchAsync");
const EmployeeWOLeaveService = require("./employeeWOLeave.service");
const sequelize = require("../../../utils/database");

// GET
const getEmployeeWOLeave = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { employeeIds, month, year } = req.query;

  let whereCondition = {};

  if (employeeIds) {
    whereCondition.employee_id = employeeIds.split(",");
  }

  if (id) whereCondition.wo_id = id;
  if (month) whereCondition.month = month;
  if (year) whereCondition.year = year;

  const result = await EmployeeWOLeaveService.getEmployeeWOLeave({
    where: whereCondition,
  });

  if (!result || result.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No records found",
    });
  }

  res.status(200).json({
    status: "success",
    data: result,
  });
});

// BULK POST
const assignEmployeeWOLeave = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { employees, month, year, created_by } = req.body;

  // validations
  if (
    !employees ||
    !Array.isArray(employees) ||
    employees.length === 0
  ) {
    return res.status(400).json({
      status: "fail",
      message: "employees array is required",
    });
  }

  if (!month || !year) {
    return res.status(400).json({
      status: "fail",
      message: "month and year are required",
    });
  }

  const result = await sequelize.transaction(async (t) => {
    return await EmployeeWOLeaveService.assignEmployeeWOLeaveBulk(
      {
        employees,
        wo_id: id,
        month,
        year,
        created_by,
      },
      t
    );
  });

  res.status(201).json({
    status: "success",
    message: "Employee WO Leave created successfully",
    data: result,
  });
});

// UPDATE
// BULK UPDATE
const updateEmployeeWOLeave = catchAsync(async (req, res) => {
  const { id } = req.params;

  const { employees, updated_by } = req.body;

  if (
    !employees ||
    !Array.isArray(employees) ||
    employees.length === 0
  ) {
    return res.status(400).json({
      status: "fail",
      message: "employees array is required",
    });
  }

  const result = await sequelize.transaction(async (t) => {
    return await EmployeeWOLeaveService.updateEmployeeWOLeaveBulk(
      {
        employees,
        wo_id: id,
        updated_by,
      },
      t
    );
  });

  res.status(200).json({
    status: "success",
    message: "Employee WO Leave updated successfully",
    data: result,
  });
});

module.exports = {
  getEmployeeWOLeave,
  assignEmployeeWOLeave,
  updateEmployeeWOLeave,
};