const router = require("express").Router({ mergeParams: true });

const AssetController = require("./asset.controller");

const { protect, restrictTo } = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
.route("/")
.get(
    restrictTo(...ROLES),
    AssetController.getAssetsByEmployeeId
)
.post(
    restrictTo(...ROLES),
    AssetController.assignAsset
);

router
.route("/:assetId")
.patch(
    restrictTo(...ROLES),
    AssetController.updateAsset
);

module.exports = router;