const router = require("express").Router({ mergeParams: true });

const ScreeningTestController = require("./screeningTest.controller");

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
        ScreeningTestController.getScreeningTestById
    )
    .post(
        restrictTo(...ROLES),
        ScreeningTestController.assignScreeningTest
    )
    .patch(
        restrictTo(...ROLES),
        ScreeningTestController.updateScreeningTest
    );

module.exports = router;