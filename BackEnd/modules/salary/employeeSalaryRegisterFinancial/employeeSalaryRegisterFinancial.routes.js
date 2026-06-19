const router = require("express").Router({ mergeParams: true });

const Controller = require("./employeeSalaryRegisterFinancial.controller");

const {
  protect,
  restrictTo,
  checkPermission,
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router.post(
  "/generate",
  restrictTo(...ROLES),
  checkPermission("EMP_SALARY.CREATE"),
  Controller.generateFinancialSalary
);

module.exports = router;