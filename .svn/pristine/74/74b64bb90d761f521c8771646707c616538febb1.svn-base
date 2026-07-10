const {
  EmployeeWorkOrderLeave,
  Employee,
  WorkOrder,
} = require("../../../models");

const AppError = require("../../../utils/appError");
const { Op } = require("sequelize");

// GET
exports.getEmployeeWOLeave = async (queryOptions) => {
  const where = { ...queryOptions.where };

  if (where.employee_id) {
    if (Array.isArray(where.employee_id)) {
      where.employee_id = {
        [Op.in]: where.employee_id,
      };
    } else {
      where.employee_id = Number(where.employee_id);
    }
  }

  return await EmployeeWorkOrderLeave.findAll({
    ...queryOptions,
    where,
  });
};

// BULK CREATE
exports.assignEmployeeWOLeaveBulk = async (
  data,
  transaction
) => {
  const {
    employees,
    wo_id,
    month,
    year,
    created_by,
  } = data;

  // validate work order
  const workOrder = await WorkOrder.findByPk(wo_id, {
    transaction,
  });

  if (!workOrder) {
    throw new AppError("Work Order not found", 404);
  }

  // employee ids
  const employeeIds = employees.map(
    (emp) => emp.employee_id
  );

  // validate employees
  const existingEmployees = await Employee.findAll({
    where: {
      id: {
        [Op.in]: employeeIds,
      },
    },
    transaction,
  });

  if (existingEmployees.length !== employeeIds.length) {
    throw new AppError("Some employees not found", 404);
  }

  // check duplicates
  const existingRecords =
    await EmployeeWorkOrderLeave.findAll({
      where: {
        employee_id: {
          [Op.in]: employeeIds,
        },
        wo_id,
        month,
        year,
      },
      transaction,
    });

  if (existingRecords.length > 0) {
    const duplicateIds = existingRecords.map(
      (item) => item.employee_id
    );

    throw new AppError(
      `Leave already assigned for employees: ${duplicateIds.join(
        ", "
      )}`,
      400
    );
  }

  // payload
  const payload = employees.map((emp) => ({
    employee_id: emp.employee_id,
    leave_taken: emp.leave_taken || 0,
    holiday_worked: emp.holiday_worked || 0,
    leave_granted: emp.leave_granted || 0,
    wo_id,
    month,
    year,
    created_by,
  }));

  // bulk create
  return await EmployeeWorkOrderLeave.bulkCreate(payload, {
    transaction,
  });
};

// BULK UPDATE
exports.updateEmployeeWOLeaveBulk = async (
  data,
  transaction
) => {
  const { employees, wo_id, updated_by } = data;

  const updatedRecords = [];

  for (const emp of employees) {
    const existing =
      await EmployeeWorkOrderLeave.findOne({
        where: {
          id: emp.id,
          wo_id,
        },
        transaction,
      });

    if (!existing) {
      throw new AppError(
        `Record not found for ID ${emp.id}`,
        404
      );
    }

    await EmployeeWorkOrderLeave.update(
      {
        employee_id:
          emp.employee_id || existing.employee_id,
        leave_taken:
          emp.leave_taken ?? existing.leave_taken,
        holiday_worked:
          emp.holiday_worked ??
          existing.holiday_worked,
        leave_granted:
          emp.leave_granted ??
          existing.leave_granted,
        month: emp.month || existing.month,
        year: emp.year || existing.year,
        updated_by,
      },
      {
        where: {
          id: emp.id,
        },
        transaction,
      }
    );

    const updated =
      await EmployeeWorkOrderLeave.findByPk(
        emp.id,
        {
          transaction,
        }
      );

    updatedRecords.push(updated);
  }

  return updatedRecords;
};