const router = require("express").Router();

const StateController = require("./stateMaster.controller");

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
    StateController.index
  );

module.exports = router;