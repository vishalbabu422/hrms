const catchAsync = require("../../../utils/catchAsync");
const fs = require("fs");
const path = require("path");
const empSalaryStatementService = require("./empSalaryStatement.service");

const getSalaryStatements = catchAsync(async (req, res, next) => {
  const { month, year } = req.query;

  const result =
    await empSalaryStatementService.getSalaryStatements(
      month,
      year
    );

    if (!result || result.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "Salary Statement not found",
    });
  }

    const data = result.map((statement) => {
    const employee = statement.employee;

    const salaryRegister = employee?.employeeSalaryRegisters?.[0];

    const middleName = employee?.middle_name ? ` ${employee.middle_name}`: "";
    const lastName = employee?.last_name ? ` ${employee.last_name}`: "";

    return {
      emp_id: statement.emp_id,
      emp_name: `${employee?.first_name || ""}${middleName}${lastName}`.trim(),
      month: statement.month,
      year: statement.year,
      statement_path: statement.statement_path,
      gross_earnings: salaryRegister?.gross_earnings || null,
      net_salary: salaryRegister?.net_salary || null,
    };
  });

  res.status(200).json({
    status: "success",
    results: data.length,
    data: {
      salaryStatements: data,
    },
  });
});

const createSalaryStatement = catchAsync(async (req, res, next) => {
  const emp_id = req.params.empId;
  const { month, year } = req.body;

  if (!emp_id || !month || !year) {
    return res.status(400).json({
      status: "fail",
      message: "Employee ID, month and year are required",
    });
  }

  if (!Number.isInteger(Number(emp_id)) || Number(emp_id) <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "Valid employee ID is required",
    });
  }

  if (
    !Number.isInteger(Number(month)) ||
    Number(month) < 1 ||
    Number(month) > 12
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Month must be between 1 and 12",
    });
  }

  if (!Number.isInteger(Number(year)) || Number(year) < 2000) {
    return res.status(400).json({
      status: "fail",
      message: "Please provide a valid year",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      status: "fail",
      message: "Salary statement PDF is required",
    });
  }

  const result = await empSalaryStatementService.createSalaryStatement({
    emp_id: Number(emp_id),
    month: Number(month),
    year: Number(year),
    statement_path: req.file.path,
  });

  res.status(201).json({
    status: "success",
    message: "Salary statement created successfully",
    data: {
      salaryStatement: result,
    },
  });
});

const downloadSalaryStatement = catchAsync(async (req, res) => {
  const { empId, statementId } = req.params;

  const statement = await empSalaryStatementService.getSalaryStatementById({
    id: statementId,
    emp_id: empId,
  });

  if (!statement) {
    return res.status(404).json({
      status: "fail",
      message: "Salary statement not found",
    });
  }

  if (!statement.statement_path) {
    return res.status(404).json({
      status: "fail",
      message: "No document found",
    });
  }

  const filePath = path.resolve(
    process.cwd(),
    statement.statement_path.replace(/^[/\\]+/, "")
  );

  const uploadRoot = path.resolve(process.cwd(), "uploads");
  if (!filePath.startsWith(uploadRoot + path.sep)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid document path",
    });
  }

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      status: "fail",
      message: "File not found",
    });
  }

  return res.download(
    filePath,
    path.basename(filePath)
  );
});

const deleteSalaryStatements = catchAsync(async (req, res) => {
  const { empId } = req.params;
  const { statementIds } = req.body;

  // Validate employee ID
  if (!Number.isInteger(Number(empId)) || Number(empId) <= 0) {
    return res.status(400).json({
      status: "fail",
      message: "Valid employee ID is required",
    });
  }

  // Validate statement IDs
  if (
    !Array.isArray(statementIds) ||
    statementIds.length === 0 ||
    !statementIds.every(
      (id) => Number.isInteger(Number(id)) && Number(id) > 0
    )
  ) {
    return res.status(400).json({
      status: "fail",
      message: "statementIds must be a non-empty array of positive integers",
    });
  }

  // Remove duplicate IDs
  const uniqueIds = [...new Set(statementIds.map(Number))];

  const result =
    await empSalaryStatementService.deleteSalaryStatements(
      Number(empId),
      uniqueIds
    );

  if (result.deletedCount === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No matching salary statements found for this employee",
    });
  }

  res.status(200).json({
    status: "success",
    message: "Salary statement(s) deleted successfully",
     data: {
    deletedCount: result.deletedCount,
    deletedIds: result.deletedIds,
    notFoundIds: uniqueIds.filter(
      (id) => !result.deletedIds.includes(id)
    ),
  },
  });
});

module.exports = {
  getSalaryStatements,
  createSalaryStatement,
  downloadSalaryStatement,
  deleteSalaryStatements,



};