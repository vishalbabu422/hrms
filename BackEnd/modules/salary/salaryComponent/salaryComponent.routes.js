const router = require("express").Router({ mergeParams: true });

const SalaryComponentController = require("./salaryComponent.controller");

const {
  protect,
  restrictTo,
  checkPermission,
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
  .route("/")
  .get(
    restrictTo(...ROLES),
    checkPermission("EMP_SALARY.READ"),
    SalaryComponentController.getSalaryComponents
  )
  .post(
    restrictTo(...ROLES),
    checkPermission("EMP_SALARY.CREATE"),
    SalaryComponentController.createSalaryComponent
  );

router
  .route("/:id")
  .get(
    restrictTo(...ROLES),
    checkPermission("EMP_SALARY.READ"),
    SalaryComponentController.getSalaryComponentById
  )
  .patch(
    restrictTo(...ROLES),
    checkPermission("EMP_SALARY.UPDATE"),
    SalaryComponentController.updateSalaryComponent
  )
  .delete(
    restrictTo(...ROLES),
    checkPermission("EMP_SALARY.DELETE"),
    SalaryComponentController.deleteSalaryComponent
  );

module.exports = router;