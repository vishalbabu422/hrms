const router = require("express").Router({ mergeParams: true });

const LanguageController = require("./language.controller");

const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
.route("/")
.get(
    restrictTo(...ROLES),
    LanguageController.getLanguagesByEmployeeId
)
.post(
    restrictTo(...ROLES),
    LanguageController.addLanguage
);

router
.route("/:languageId")
.patch(
    restrictTo(...ROLES),
    LanguageController.updateLanguage
);

module.exports = router;