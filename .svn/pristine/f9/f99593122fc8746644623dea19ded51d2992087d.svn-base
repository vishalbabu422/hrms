const router = require("express").Router({ mergeParams: true });

const LtcController = require("./ltc.controller");

const {
    protect,
    restrictTo
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
    .route("/")
    .get(
        restrictTo(...ROLES),
        LtcController.getLtcByEmployeeId
    )
    .post(
        restrictTo(...ROLES),
        LtcController.assignLtc
    )
    .patch(
        restrictTo(...ROLES),
        LtcController.updateLtc
    );

module.exports = router;