const router = require("express").Router({ mergeParams: true });

const TrainingController = require("./training.controller");

const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
.route("/")
.get(
    restrictTo(...ROLES),
    TrainingController.getTrainingByEmployeeId
)
.post(
    restrictTo(...ROLES),
    TrainingController.addTraining
);

router
.route("/:trainingId")
.patch(
    restrictTo(...ROLES),
    TrainingController.updateTraining
);

module.exports = router;