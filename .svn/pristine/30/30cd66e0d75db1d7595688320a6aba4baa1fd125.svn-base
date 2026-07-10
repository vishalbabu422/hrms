const { EmployeeRole, Employee } = require("../../../models");
const AppError = require("../../../utils/appError");

// Assign / Replace Roles
exports.assignEmployeeRoles = async (employeeId, roles, oId, userId, transaction) => {

  // Check employee exists
  const employee = await Employee.findByPk(employeeId, { transaction });
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  // Validate roles array
  if (!roles || !Array.isArray(roles) || roles.length === 0) {
    throw new AppError("Roles array is required", 400);
  }

  // Delete existing roles
  await EmployeeRole.destroy({
    where: { employee_id: employeeId },
    transaction
  });

  // Prepare bulk data
  const roleData = roles.map((roleId) => ({
    employee_id: employeeId,
    role_id: roleId,
    organization_id: oId,
    assigned_by: userId || null
  }));

  // Bulk insert
  return await EmployeeRole.bulkCreate(roleData, { transaction });
};

// Remove Roles
exports.removeEmployeeRoles = async (employeeId, transaction) => {

  // Check employee exists
  const employee = await Employee.findByPk(employeeId, { transaction });
  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  return await EmployeeRole.destroy({
    where: { employee_id: employeeId },
    transaction
  });
};