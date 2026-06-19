const router = require("express").Router({ mergeParams: true });

const controller = require("./employeeSalaryStructure.controller");

const { protect, restrictTo,checkPermission } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
  .route("/")
  .get(restrictTo(...ROLES), checkPermission("EMP_SALARY.READ"), controller.getEmployeeSalaryStructures)
  .post(restrictTo(...ROLES), checkPermission("EMP_SALARY.CREATE"), controller.createEmployeeSalaryStructure);

router
  .route("/:id")
  .get(restrictTo(...ROLES), checkPermission("EMP_SALARY.READ"), controller.getEmployeeSalaryStructureById)
  .patch(restrictTo(...ROLES),  checkPermission("EMP_SALARY.UPDATE"), controller.updateEmployeeSalaryStructure)
  .delete(restrictTo(...ROLES),  checkPermission("EMP_SALARY.DELETE"), controller.deleteEmployeeSalaryStructure);

router
  .route("/:id/workorder/:wo_id")
  .get(restrictTo(...ROLES), checkPermission("EMP_SALARY.READ"), controller.getEmployeeSalaryStructureByWorkOrder);

router
  .route("/:id/emp/:emp_id")
  .get(
    restrictTo(...ROLES),
    checkPermission("EMP_SALARY.READ"),
    controller.getEmployeeSalaryBreakdownByEmployee
  );  
  

module.exports = router;
