const router = require("express").Router({ mergeParams: true });

const SkillController = require("./skills.controller");

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
        SkillController.getSkillsByEmployeeId
    )
    .post(
        restrictTo(...ROLES),
        SkillController.assignSkill
    );

router
    .route("/:skillId")
    .patch(
        restrictTo(...ROLES),
        SkillController.updateSkill
    );

module.exports = router;