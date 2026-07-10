const router = require("express").Router({ mergeParams: true });

const VaccinationController = require("./vaccination.controller");

const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
.route("/")
.get(restrictTo(...ROLES), VaccinationController.getVaccinationsByEmployeeId)
.post(restrictTo(...ROLES), VaccinationController.assignVaccination);

router
.route("/:vaccinationId")
.patch(restrictTo(...ROLES), VaccinationController.updateVaccination);

module.exports = router;