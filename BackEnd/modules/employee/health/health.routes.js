const router = require("express").Router({ mergeParams: true });

const HealthController = require("./health.controller");

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
        HealthController.getHealthByEmployeeId
    )
    .post(
        restrictTo(...ROLES),
        HealthController.assignHealth
    )
    .patch(
        restrictTo(...ROLES),
        HealthController.updateHealth
    );

module.exports = router;