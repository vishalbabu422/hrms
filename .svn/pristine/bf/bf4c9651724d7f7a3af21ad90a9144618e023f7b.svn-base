const router = require("express").Router();

const SalaryAddonMasterController = require("./salaryAddonMaster.controller");

const {
  protect,
  restrictTo,
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
  .route("/index")
  .get(
    restrictTo(...ROLES),
    SalaryAddonMasterController.index
  );

router
  .route("/create")
  .post(
    restrictTo(...ROLES),
    SalaryAddonMasterController.create
  );

router
  .route("/edit/:id")
  .patch(
    restrictTo(...ROLES),
    SalaryAddonMasterController.edit
  );

router
  .route("/delete/:id")
  .delete(
    restrictTo(...ROLES),
    SalaryAddonMasterController.deleteById
  );

router
  .route("/:id")
  .get(
    restrictTo(...ROLES),
    SalaryAddonMasterController.dataById
  );

module.exports = router;