const router = require("express").Router({ mergeParams: true });

const PassportVisaController = require("./passportVisa.controller");

const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
.route("/")
.get(
    restrictTo(...ROLES),
    PassportVisaController.getPassportVisaByEmployeeId
)
.post(
    restrictTo(...ROLES),
    PassportVisaController.addPassportVisa
);

router
.route("/:passportVisaId")
.patch(
    restrictTo(...ROLES),
    PassportVisaController.updatePassportVisa
);

module.exports = router;