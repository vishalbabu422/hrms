const catchAsync = require("../../../utils/catchAsync");
const sequelize = require("../../../utils/database");

const EmployeeRoleService = require("./employeeRole.service");

// Assign / Replace Employee Roles
const assignEmployeeRoles = catchAsync(async (req, res, next) => {
  const { employeeId } = req.params;

  if (!req.isSuperAdmin) {
    req.body.organization_id = req.user.organization_id;
  }

  const { roles, organization_id } = req.body;

  await sequelize.transaction(async (t) => {
    await EmployeeRoleService.assignEmployeeRoles(
      employeeId,
      roles,
      organization_id,
      req.user?.id,
      t
    );
  });

  res.status(201).json({
    status: "success",
    message: "Employee roles assigned successfully"
  });
});

// Remove Employee Role(s)
const removeEmployeeRoles = catchAsync(async (req, res, next) => {
  const { employeeId } = req.params;

  await sequelize.transaction(async (t) => {
    await EmployeeRoleService.removeEmployeeRoles(
      employeeId,
      t
    );
  });

  res.status(200).json({
    status: "success",
    message: "Employee roles removed successfully"
  });
});
module.exports = {
  assignEmployeeRoles,
  removeEmployeeRoles
};