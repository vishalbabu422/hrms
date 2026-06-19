const { Op } = require("sequelize");
const AppError = require("../../utils/appError");
const RoleMaster = require("../../models/roleMaster");
const RolePermission = require("../../models/RolePermission");


// GET ALL
exports.getAllRoles = async (query) => {
  return await RoleMaster.findAll({
    ...query,
    where: {
      is_deleted: false,
      ...query.where
    }
  });
};

// GET BY ID
exports.getRoleById = async (id, queryOptions) => {
  const role = await RoleMaster.findOne({
    ...queryOptions, 
    where: {
      id,
      is_deleted: false,
      ...queryOptions.where,
    },
  });

  if (!role) {
    throw new AppError("Role not found", 404);
  }

  return role;
};

// CREATE
exports.createRole = async (body) => {
  // check duplicate
  const existing = await RoleMaster.findOne({
    where: {
      role_code: body.role_code,
      is_system_role: false,
      is_super_admin: false,
      is_deleted: false,
    },
  });

  if (existing) {
    throw new AppError("Role code already exists", 400);
  }

  return await RoleMaster.create(body);
};

// UPDATE
exports.updateRole = async (id, body) => {
  const role = await RoleMaster.findOne({
    where: { id, is_deleted: false },
  });

  if (!role) {
    throw new AppError("Role not found", 400);
  }

  // PROTECTION CHECK
  if (role.is_system_role || role.is_super_admin) {
    throw new AppError("System roles cannot be updated", 403);
  }
  // duplicate check
  if (body.role_code) {
    const duplicate = await RoleMaster.findOne({
      where: {
        role_code: body.role_code,
        id: { [Op.ne]: id },
        is_deleted: false,
      },
    });

    if (duplicate) {
      throw new AppError("Duplicate role code", 400);
    }
  }

  await role.update(body);
  return role;
};

// DELETE (SOFT DELETE)
exports.deleteRole = async (id) => {
  const role = await RoleMaster.findOne({
    where: { id, is_deleted: false },
  });

  if (!role) {
    throw new AppError("Role not found or already deleted", 400);
  }

  // PROTECTION CHECK
  if (role.is_system_role || role.is_super_admin) {
    throw new AppError("System roles cannot be deleted", 403);
  }
  await role.update({
    is_deleted: true,
  });
};

// ASSIGN ROLE PERMISSIONS (BULK)
exports.assignRolePermissions = async (roleId, permissions) => {

  // 1. CHECK ROLE EXIST
  const role = await RoleMaster.findOne({
    where: {
      id: roleId,
      is_deleted: false,
    },
  });

  if (!role) {
    throw new AppError("Role not found", 404);
  }

  // 2. CHECK EXISTING ROLE PERMISSIONS
  const existing = await RolePermission.findAll({
    where: { role_id: roleId },
  });

  // 3. DELETE IF EXIST
  if (existing.length > 0) {
    await RolePermission.destroy({
      where: { role_id: roleId },
    });
  }

  // 4. INSERT NEW (BULK)
  const bulkData = permissions.map((permId) => ({
    role_id: roleId,
    permission_id: permId,
  }));

  const result = await RolePermission.bulkCreate(bulkData);

  return result;
};