const router = require("express").Router({ mergeParams: true });

const DetailController = require("./detail.controller");

const {
    protect,
    restrictTo
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

// All routes protected
router.use(protect);

router
    .route("/")
    .get(
        restrictTo(...ROLES),
        DetailController.getEmployeeDetailsById
    )
    .post(
        restrictTo(...ROLES),
        DetailController.addEmployeeDetails
    )
    .patch(
        restrictTo(...ROLES),
        DetailController.updateEmployeeDetails
    );

module.exports = router;