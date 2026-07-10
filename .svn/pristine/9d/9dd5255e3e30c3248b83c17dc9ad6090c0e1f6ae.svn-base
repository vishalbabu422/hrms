const {
  EmployeeSalaryAddon,
} = require("../../../models");

const AppError = require("../../../utils/appError");

// List
exports.index = async (queryOptions) => {
  return await EmployeeSalaryAddon.findAndCountAll({
    ...queryOptions,
  });
};

// By ID
exports.dataById = async (id) => {
  return await EmployeeSalaryAddon.findOne({
    where: {
      id,
      is_deleted: false,
    },
  });
};

// Create
exports.create = async (payload) => {

  // BULK CREATE
  if (Array.isArray(payload)) {

    const bulkPayload = payload.map((item) => ({
      ...item,
      is_active: true,
      is_deleted: false,
    }));

    return await EmployeeSalaryAddon.bulkCreate(
      bulkPayload,
      {
        returning: true,
      }
    );
  }

  // SINGLE CREATE
  return await EmployeeSalaryAddon.create({
    ...payload,
    is_active: true,
    is_deleted: false,
  });
};

// Update
exports.edit = async (id, updates) => {
  const record = await EmployeeSalaryAddon.findOne({
    where: {
      id,
      is_deleted: false,
    },
  });

  if (!record) {
    throw new AppError(
      "Employee Salary Addon not found",
      404
    );
  }

  await record.update({
    ...updates,
    updated_at: new Date(),
  });

  return record;
};

// Delete
exports.deleteById = async (id) => {
  const record = await EmployeeSalaryAddon.findOne({
    where: {
      id,
      is_deleted: false,
    },
  });

  if (!record) {
    throw new AppError(
      "Employee Salary Addon not found",
      404
    );
  }

  await record.update({
    is_deleted: true,
    is_active: false,
    updated_at: new Date(),
  });

  return true;
};