const router = require("express").Router({ mergeParams: true });

const DisciplineController = require("./discipline.controller");

const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
.route("/")
.get(
    restrictTo(...ROLES),
    DisciplineController.getDisciplineByEmployeeId
)
.post(
    restrictTo(...ROLES),
    DisciplineController.addDiscipline
);

router
.route("/:disciplineId")
.patch(
    restrictTo(...ROLES),
    DisciplineController.updateDiscipline
);

module.exports = router;