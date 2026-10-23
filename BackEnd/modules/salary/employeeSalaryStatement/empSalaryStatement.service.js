const {
  EmpSalaryStatement,
  Employee,
  EmployeeSalaryRegister,
} = require("../../../models");

exports.getSalaryStatements = async (month, year) => {
  const statements = await EmpSalaryStatement.findAll({
    where: {
      month,
      year,
      is_active: true,
    },

    attributes: [
      "id",
      "emp_id",
      "month",
      "year",
      "statement_path",
    ],

    include: [
      {
        model: Employee,
        as: "employee",
        attributes: [
          "id",
          "first_name",
          "middle_name",
          "last_name",
        ],

        include: [
          {
            model: EmployeeSalaryRegister,
            as: "employeeSalaryRegisters",
            required: false,

            where: {
              month,
              year,
              status: "DISPATCHED",
              is_deleted: false,
            },

            attributes: [
              "gross_earnings",
              "net_salary",
              "status",
              "dispatched_at",
            ],
          },
        ],
      },
    ],

    order: [["id", "DESC"]],
  });

  return statements;
};

exports.createSalaryStatement = async ({
  emp_id,
  month,
  year,
  statement_path,
}) => {
  const employee = await Employee.findOne({
    where: {
      id: emp_id,
      is_active: true,
      is_deleted: false,
    },
  });

  if (!employee) {
    const error = new Error("Employee not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  const salaryRegister = await EmployeeSalaryRegister.findOne({
    where: {
      employee_id: emp_id,
      month,
      year,
      status: "DISPATCHED",
      is_deleted: false,
    },
  });

  if (!salaryRegister) {
    const error = new Error(
      "Dispatched salary register not found for this month and year"
    );
    error.statusCode = 404;
    throw error;
  }

  const existingStatement = await EmpSalaryStatement.findOne({
    where: {
      emp_id,
      month,
      year,
    },
  });

  if (existingStatement) {
    const error = new Error(
      "Salary statement already exists for this employee, month and year"
    );
    error.statusCode = 409;
    throw error;
  }

  return await EmpSalaryStatement.create({
    emp_id,
    month,
    year,
    statement_path,
    is_active: true,
  });
};

exports.getSalaryStatementById = async ({ id, emp_id }) => {
  return await EmpSalaryStatement.findOne({
    where: {
      id,
      emp_id,
      is_active: true,
    },
    attributes: [
      "id",
      "emp_id",
      "month",
      "year",
      "statement_path",
    ],
  });
};

exports.deleteSalaryStatements = async (empId, statementIds) => {
  const statements = await EmpSalaryStatement.findAll({
    where: {
      id: statementIds,
      emp_id: empId,
      is_active: true,
    },
    attributes: ["id"],
  });

  const matchedIds = statements.map((statement) =>
    Number(statement.id)
  );

  if (matchedIds.length === 0) {
    return {
      deletedCount: 0,
      deletedIds: [],
    };
  }

  const deletedCount = await EmpSalaryStatement.destroy({
    where: {
      id: matchedIds,
      emp_id: empId,
      is_active: true,
    },
  });

  return {
    deletedCount,
    deletedIds: matchedIds,
  };
};