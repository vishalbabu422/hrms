const router = require("express").Router();

const DistrictMasterController = require("./districtMaster.controller");

const {
  protect,
  restrictTo,
} = require("../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
  .route("/index")
  .get(
    restrictTo(...ROLES),
    DistrictMasterController.getAll
  );

module.exports = router;