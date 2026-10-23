const router = require("express").Router({ mergeParams: true });

const controller = require("./employeeWOMpr.controller");
const { protect, checkPermission ,restrictTo } = require("../../../middlewares/authMiddleware");
const uploadMpr = require("../../../middlewares/mprdocumentUpload.middleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
  .route("/")
  .get(
    checkPermission("MPR.READ"),
    controller.getEmployeeWOMpr
  )
  .post(
    checkPermission("MPR.CREATE"),
    controller.createEmployeeWOMpr);

router
  .route("/upload")
  .post(
    checkPermission("MPR.CREATE"),
    uploadMpr,
    controller.uploadEmployeeWOMpr);

router
  .route("/:mprId")
  .delete(
    checkPermission("MPR.DELETE"),
    controller.deleteEmployeeWOMpr);

    router
  .route("/:mprId/download")
  .get(
    checkPermission("MPR.READ"),
    controller.downloadEmployeeWOMpr
  );
module.exports = router;