const router = require("express").Router({ mergeParams: true });

const HobbyController = require("./hobby.controller");

const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
.route("/")
.get(restrictTo(...ROLES), HobbyController.getHobbiesByEmployeeId)
.post(restrictTo(...ROLES), HobbyController.addHobby);

router
.route("/:hobbyId")
.patch(restrictTo(...ROLES), HobbyController.updateHobby);

module.exports = router;