const router = require("express").Router({ mergeParams: true });

const AchievementController = require("./achievement.controller");

const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
.route("/")
.get(
    restrictTo(...ROLES), 
    AchievementController.getAchievementsByEmployeeId
)
.post(
    restrictTo(...ROLES),
     AchievementController.addAchievement
);

router
.route("/:achievementId")
.patch(
    restrictTo(...ROLES), 
    AchievementController.updateAchievement
);

module.exports = router;