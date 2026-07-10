const { EmployeeQualification, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");
const sequelize = require("../../../utils/database");

exports.getById = async (queryOptions) => {
  return await EmployeeQualification.findAll({
    ...queryOptions,
    where: {
      ...queryOptions.where,
    },
  });
};
exports.assignQualification = async (
  employeeId,
  qualificationData,
  transaction,
) => {
  // Check employee exists
  const employee = await Employee.findByPk(employeeId, { transaction });
  if (!employee) throw new AppError("Employee not found", 404);

  const existingQualification = await EmployeeQualification.findOne({
    where: {
      employee_id: employeeId,
      qualification_type: qualificationData.qualification_type,
      is_deleted: false,
    },
    transaction,
  });

  if (existingQualification) {
    throw new AppError("Qualification already exists for this employee", 409);
  }

  // Create only
  return await EmployeeQualification.create(
    {
      ...qualificationData,
      employee_id: employeeId,
    },
    { transaction },
  );
};

exports.updateQualification = async (
  employeeId,
  qualificationId,
  qualificationData,
  transaction,
) => {
  const qualification = await EmployeeQualification.findOne({
    where: {
      id: qualificationId,
      employee_id: employeeId,
    },
    transaction,
  });

  if (!qualification) {
    throw new AppError("Qualification not found", 404);
  }

  return await qualification.update(qualificationData, { transaction });
};

exports.deleteQualification = async (
  employeeId,
  qualificationId,
  transaction,
) => {
  const qualification = await EmployeeQualification.findOne({
    where: {
      id: qualificationId,
      employee_id: employeeId,
      is_deleted: false,
    },
    transaction,
  });

  if (!qualification) {
    throw new AppError("Qualification not found", 404);
  }

  await qualification.update({ is_deleted: true }, { transaction });

  return true;
};
