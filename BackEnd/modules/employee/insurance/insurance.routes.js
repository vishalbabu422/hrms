const router = require("express").Router({ mergeParams: true });

const InsuranceController = require("./insurance.controller");

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
        InsuranceController.getInsuranceById
    )
    .post(
        restrictTo(...ROLES),
        InsuranceController.assignInsurance
    )
    .patch(
        restrictTo(...ROLES),
        InsuranceController.updateInsurance
    );

module.exports = router;