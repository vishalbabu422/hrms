const express = require("express");
const router = express.Router();

const rolesController = require("../role/role.controller");

const {
  protect,
  checkPermission,
  restrictTo,
} = require("../../middlewares/authMiddleware");
const { checkSSOSession } = require("../../middlewares/ssoMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(checkSSOSession);
router.use(protect);

router.get(
  "/roles/index",
  checkPermission("ROLE_PER.READ"),
  rolesController.getAllRoles,
);

router.get(
  "/roles/:id",
  checkPermission("ROLE_PER.READ"),
  rolesController.getRoleById,
);

router.post(
  "/roles/create",
  checkPermission("ROLE_PER.CREATE"),
  rolesController.createRole,
);

router.patch(
  "/roles/edit/:id",
  checkPermission("ROLE_PER.UPDATE"),
  rolesController.updateRole,
);

router.delete(
  "/roles/delete/:id",
  checkPermission("ROLE_PER.DELETE"),
  rolesController.deleteRole,
);

router.post(
  "/roles/:id/rolespermission",
  checkPermission("ROLE_PER.CREATE"),
  rolesController.assignRolePermissions,
);
module.exports = router;
