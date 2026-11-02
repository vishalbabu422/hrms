const router = require("express").Router();
const pbgUpload = require("../../../middlewares/pbgUpload");
const PbgMasterController = require("./pbgMaster.controller");

const {
  protect,
  restrictTo,
  checkPermission,
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

// Calculate Work Order Total
router
  .route("/calculate-total")
  .post(
    checkPermission("PBG_DETAILS.CREATE"),
    restrictTo(...ROLES),
    PbgMasterController.calculateWorkOrderTotal
  );

// Get PBG List
router
  .route("/index")
  .get(
    checkPermission("PBG_DETAILS.READ"),
    restrictTo(...ROLES),
    PbgMasterController.index
  );

  // Get Workorder PBG by PBG ID
router
  .route("/:pbg_id")
  .get(
    checkPermission("PBG_DETAILS.READ"),
    restrictTo(...ROLES),
    PbgMasterController.dataByPbgId
  )
  .patch(
    checkPermission("PBG_DETAILS.UPDATE"),
    restrictTo(...ROLES),
    PbgMasterController.update
  )
  .delete(
    checkPermission("PBG_DETAILS.DELETE"),
    restrictTo(...ROLES),
    PbgMasterController.deletePbg
  );

  
  // Create PBG Master and Workorder PBG
router
  .route("/")
  .post(
    checkPermission("PBG_DETAILS.CREATE"),
    restrictTo(...ROLES),
    PbgMasterController.create
  );

// Upload PBG PDF
router.post(
  "/:pbg_id/upload",
  checkPermission("PBG_DETAILS.CREATE"),
  restrictTo(...ROLES),
  pbgUpload,
  PbgMasterController.uploadPbgDocument
);

// Download PBG PDF
router.get(
  "/:pbg_id/download",
  checkPermission("PBG_DETAILS.READ"),
  restrictTo(...ROLES),
  PbgMasterController.downloadPbgDocument
);  

module.exports = router;