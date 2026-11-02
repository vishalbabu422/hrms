
const router = require("express").Router();

const BillingSubmissionController = require("./billingSubmission.controller");

const {
  protect,
  restrictTo,
  checkPermission,
} = require("../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

// Get All Billing Submissions
router
  .route("/index")
  .get(
    checkPermission("BILLING_SUB_DETAILS.READ"),
    restrictTo(...ROLES),
    BillingSubmissionController.index
  );

// Invoice Number Preview
router.get(
  "/work-order/:wo_id/invoice-preview",
  checkPermission("BILLING_SUB_DETAILS.READ"),
  restrictTo(...ROLES),
  BillingSubmissionController.generateInvoicePreview
);

// Get, Update and Soft Delete Billing Submission
router
  .route("/:id")
  .get(
    checkPermission("BILLING_SUB_DETAILS.READ"),
    restrictTo(...ROLES),
    BillingSubmissionController.getById
  )
  .patch(
    checkPermission("BILLING_SUB_DETAILS.UPDATE"),
    restrictTo(...ROLES),
    BillingSubmissionController.update
  )
  .delete(
    checkPermission("BILLING_SUB_DETAILS.DELETE"),
    restrictTo(...ROLES),
    BillingSubmissionController.deleteBillingSubmission
  );

// Create Billing Submission
router
  .route("/")
  .post(
    checkPermission("BILLING_SUB_DETAILS.UPDATE"),
    restrictTo(...ROLES),
    BillingSubmissionController.create
  );  

  // Generate Billing Submission PDF
router.post(
  "/:id/generatePdf",
  checkPermission("BILLING_SUB_DETAILS.CREATE"),
  restrictTo(...ROLES),
  BillingSubmissionController.generatePdf
);

  router
  .route("/:id/previewPdf")
  .get(
    checkPermission("BILLING_SUB_DETAILS.READ"),
    restrictTo(...ROLES),
    BillingSubmissionController.previewPdf
  );

module.exports = router;