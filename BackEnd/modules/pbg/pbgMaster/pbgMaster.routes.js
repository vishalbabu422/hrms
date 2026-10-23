const router = require("express").Router();
const pbgUpload = require("../../../middlewares/pbgUpload");
const PbgMasterController = require("./pbgMaster.controller");

const {
  protect,
  restrictTo,
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

// Calculate Work Order Total
router
  .route("/calculate-total")
  .post(
    restrictTo(...ROLES),
    PbgMasterController.calculateWorkOrderTotal
  );

// Get PBG List
router
  .route("/index")
  .get(
    restrictTo(...ROLES),
    PbgMasterController.index
  );

  // Get Workorder PBG by PBG ID
router
  .route("/:pbg_id")
  .get(
    restrictTo(...ROLES),
    PbgMasterController.dataByPbgId
  )
  .patch(
    restrictTo(...ROLES),
    PbgMasterController.update
  )
  .delete(
    restrictTo(...ROLES),
    PbgMasterController.deletePbg
  );

  
  // Create PBG Master and Workorder PBG
router
  .route("/")
  .post(
    restrictTo(...ROLES),
    PbgMasterController.create
  );

// Upload PBG PDF
router.post(
  "/:pbg_id/upload",
  restrictTo(...ROLES),
  pbgUpload,
  PbgMasterController.uploadPbgDocument
);

// Download PBG PDF
router.get(
  "/:pbg_id/download",
  restrictTo(...ROLES),
  PbgMasterController.downloadPbgDocument
);  

module.exports = router;