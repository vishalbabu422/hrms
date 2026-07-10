const router = require("express").Router({ mergeParams: true });

const EmployeeRoleController = require("./employeeRole.controller");

const {
  protect,
  restrictTo
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

// Apply auth middleware
router.use(protect);

router
  .route("/")
  .post(
    restrictTo(...ROLES),
    EmployeeRoleController.assignEmployeeRoles
  )
  .delete(
    restrictTo(...ROLES),
    EmployeeRoleController.removeEmployeeRoles
  );

module.exports = router;