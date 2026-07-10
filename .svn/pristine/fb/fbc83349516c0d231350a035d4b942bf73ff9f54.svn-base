const catchAsync = require("../../utils/catchAsync");
const rolesService = require("../role/role.service");
const APIFeatures = require("../../utils/apiFeature");

// GET ALL
const getAllRoles = catchAsync(async (req, res) => {
  const features = new APIFeatures(req.query, [
    "role_code",
    "role_name",
  ])
    .filter()
    .search()
    .limitFields()
    .join();

  if (!features.query.where) features.query.where = {};

  if (!req.isSuperAdmin) {
    features.query.where = {
      ...features.query.where,
      organization_id: req.user.organization_id,
    };
  }

  const data = await rolesService.getAllRoles(features.query);

  res.status(200).json({
    success: true,
    message: "Roles fetched successfully",
    data,
  });
});

// GET BY ID
const getRoleById = catchAsync(async (req, res) => {
  const features = new APIFeatures(req.query)
    .limitFields()
    .join(); // filter/search hata do (not needed)

  if (!features.query.where) features.query.where = {};

  features.query.where = {
    ...features.query.where,
    id: req.params.id,
  };

  if (!req.isSuperAdmin) {
    features.query.where.organization_id = req.user.organization_id;
  }

  const data = await rolesService.getRoleById(
    req.params.id,
    features.query
  );

  res.status(200).json({
    success: true,
    message: "Role fetched successfully",
    data,
  });
});

// CREATE
const createRole = catchAsync(async (req, res) => {
  if (!req.isSuperAdmin) {
    req.body.organization_id = req.user.organization_id;
  }
  const data = await rolesService.createRole(req.body);

  res.status(201).json({
    success: true,
    message: "Role created successfully",
    data,
  });
});

// UPDATE
const updateRole = catchAsync(async (req, res) => {
  const data = await rolesService.updateRole(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: "Role updated successfully",
    data,
  });
});

// DELETE (SOFT)
const deleteRole = catchAsync(async (req, res) => {
  await rolesService.deleteRole(req.params.id);

  res.status(200).json({
    success: true,
    message: "Role deleted successfully",
  });
});

// ASSIGN ROLE PERMISSIONS
const assignRolePermissions = catchAsync(async (req, res) => {
  const roleId = req.params.id;
  const permissions = req.body.permissions; // array of permission_ids

  const data = await rolesService.assignRolePermissions(
    roleId,
    permissions
  );

  res.status(200).json({
    success: true,
    message: "Role permissions updated successfully",
    data,
  });
});

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignRolePermissions
};