
const router = require("express").Router();

const BillingSubmissionController = require("./billingSubmission.controller");

const {
  protect,
  restrictTo,
} = require("../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

// Get All Billing Submissions
router
  .route("/index")
  .get(
    restrictTo(...ROLES),
    BillingSubmissionController.index
  );

// Invoice Number Preview
router.get(
  "/work-order/:wo_id/invoice-preview",
  restrictTo(...ROLES),
  BillingSubmissionController.generateInvoicePreview
);

// Get, Update and Soft Delete Billing Submission
router
  .route("/:id")
  .get(
    restrictTo(...ROLES),
    BillingSubmissionController.getById
  )
  .patch(
    restrictTo(...ROLES),
    BillingSubmissionController.update
  )
  .delete(
    restrictTo(...ROLES),
    BillingSubmissionController.deleteBillingSubmission
  );

// Create Billing Submission
router
  .route("/")
  .post(
    restrictTo(...ROLES),
    BillingSubmissionController.create
  );  

  // Generate Billing Submission PDF
router.post(
  "/:id/generatePdf",
  restrictTo(...ROLES),
  BillingSubmissionController.generatePdf
);

module.exports = router;