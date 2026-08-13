const router = require("express").Router();

const DistrictMasterController = require("./districtMaster.controller");

const { protect, restrictTo } = require("../../middlewares/authMiddleware");
const { checkSSOSession } = require("../../middlewares/ssoMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(checkSSOSession);
router.use(protect);

router
  .route("/index")
  .get(restrictTo(...ROLES), DistrictMasterController.getAll);

module.exports = router;
