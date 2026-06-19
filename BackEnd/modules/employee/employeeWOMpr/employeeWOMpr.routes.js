const router = require("express").Router({ mergeParams: true });

const controller = require("./employeeWOMpr.controller");
const { protect, checkPermission ,restrictTo } = require("../../../middlewares/authMiddleware");
const upload = require("../../../middlewares/mprdocumentUpload.middleware");

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
    upload.single("file"), 
    checkPermission("MPR.CREATE"),
    controller.uploadEmployeeWOMpr);

router
  .route("/:mprId")
  .delete(
    checkPermission("MPR.DELETE"),
    controller.deleteEmployeeWOMpr);

module.exports = router;