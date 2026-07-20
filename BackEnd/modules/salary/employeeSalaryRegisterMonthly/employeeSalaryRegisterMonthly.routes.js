const router = require("express").Router({ mergeParams: true });

const Controller = require("./employeeSalaryRegisterMonthly.controller");
const { protect, restrictTo,checkPermission } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router.post( "/generate",
  restrictTo(...ROLES),
  checkPermission("EMP_SALARY.CREATE"),
  Controller.generateMonthlySalary
);

router.post("/dispatch",  
  restrictTo(...ROLES),
  checkPermission("EMP_SALARY.CREATE"),
  Controller.dispatchSalary
);
router.post(
  "/generate-slip/:register_id",
  restrictTo(...ROLES),
  checkPermission("EMP_SALARY.CREATE"),
  Controller.generateSalarySlip
);
router.get(
  "/download-slip/:register_id",
  restrictTo(...ROLES),
  checkPermission("EMP_SALARY.READ"),
  Controller.downloadSalarySlip
);

module.exports = router;


