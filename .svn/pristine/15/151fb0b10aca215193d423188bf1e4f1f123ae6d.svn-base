const router = require("express").Router({ mergeParams: true });

const SalaryStructureController = require("./salaryStructure.controller");

const { protect, restrictTo,checkPermission } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
  .route("/")
  .get(restrictTo(...ROLES), checkPermission("EMP_SALARY.READ"), SalaryStructureController.getSalaryStructures)
  .post(restrictTo(...ROLES), checkPermission("EMP_SALARY.CREATE"), SalaryStructureController.createSalaryStructure);

router
  .route("/:id")
  .get(restrictTo(...ROLES), checkPermission("EMP_SALARY.READ"), SalaryStructureController.getSalaryStructureById)
  .patch(restrictTo(...ROLES), checkPermission("EMP_SALARY.UPDATE"), SalaryStructureController.updateSalaryStructure)
  .delete(
    restrictTo(...ROLES),
    checkPermission("EMP_SALARY.DELETE"),
    SalaryStructureController.deleteSalaryStructure,
  );

router
  .route("/:id/employees")
  .get(
    restrictTo(...ROLES),
    checkPermission("EMP_SALARY.READ"),
    SalaryStructureController.getEmployeeBySalaryStructure,
  );

module.exports = router;
