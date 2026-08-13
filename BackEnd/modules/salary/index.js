const router = require("express").Router();
const { checkSSOSession } = require("../../middlewares/ssoMiddleware");

router.use(checkSSOSession);
router.use(
  "/salary-component",
  require("./salaryComponent/salaryComponent.routes"),
);
router.use(
  "/salary-structure",
  require("./salaryStructure/salaryStructure.routes"),
);
router.use(
  "/employee-salary-structure",
  require("./employeeSalaryStructure/employeeSalaryStructure.routes"),
);
router.use(
  "/employee-salary-register-monthly",
  require("./employeeSalaryRegisterMonthly/employeeSalaryRegisterMonthly.routes"),
);
router.use(
  "/salary-addon-master",
  require("./salaryAddonMaster/salaryAddonMaster.routes"),
);
router.use(
  "/employee-salary-addon",
  require("./employeeSalaryAddon/employeeSalaryAddon.routes"),
);
router.use(
  "/employee-salary-register-financial/",
  require("./employeeSalaryRegisterFinancial/employeeSalaryRegisterFinancial.routes"),
);

module.exports = router;
