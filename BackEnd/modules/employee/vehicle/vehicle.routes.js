const router = require("express").Router({ mergeParams: true });

const VehicleController = require("./vehicle.controller");

const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
.route("/")
.get(restrictTo(...ROLES), VehicleController.getVehiclesByEmployeeId)
.post(restrictTo(...ROLES), VehicleController.assignVehicle);

router
.route("/:vehicleId")
.patch(restrictTo(...ROLES), VehicleController.updateVehicle);

module.exports = router;