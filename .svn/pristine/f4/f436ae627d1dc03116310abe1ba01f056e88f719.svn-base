const router = require("express").Router();

const WoMilestoneController = require("./milestone.controller");

const {
    protect,
    restrictTo
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

// Get By ID | Update | Delete
router
    .route("/:id")
    .get(
        restrictTo(...ROLES),
        WoMilestoneController.getMilestoneById
    )
    .patch(
        restrictTo(...ROLES),
        WoMilestoneController.updateMilestone
    )
    .delete(
        restrictTo(...ROLES),
        WoMilestoneController.deleteMilestone
    );

// Create
router
    .route("/")
    .post(
        restrictTo(...ROLES),
        WoMilestoneController.addMilestone
    );

module.exports = router;