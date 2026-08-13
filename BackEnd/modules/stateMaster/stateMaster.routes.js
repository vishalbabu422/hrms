const router = require("express").Router();

const StateController = require("./stateMaster.controller");

const { protect, restrictTo } = require("../../middlewares/authMiddleware");
const { checkSSOSession } = require("../../middlewares/ssoMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(checkSSOSession);
router.use(protect);

router.route("/index").get(restrictTo(...ROLES), StateController.index);

module.exports = router;
