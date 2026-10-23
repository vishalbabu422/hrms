const router = require("express").Router();

const controller = require("./empSalaryStatement.controlller");
const uploadSalaryStatement = require("../../../middlewares/salaryStatementUpload");

const {
  protect,
  restrictTo,
} = require("../../../middlewares/authMiddleware");

const ROLES = [
  "ORG_ADMIN",
  "SUPER_ADMIN",
];

router.use(protect);

router
  .route("/")
  .get(
    restrictTo(...ROLES),
    controller.getSalaryStatements
  );

  router.post(
  "/:empId",
  restrictTo(...ROLES),
  uploadSalaryStatement,
  controller.createSalaryStatement
);

router
  .route("/:empId/:statementId/download")
  .get(
    controller.downloadSalaryStatement
  );

  router.delete(
  "/:empId",
  restrictTo(...ROLES),
  controller.deleteSalaryStatements
);

module.exports = router;