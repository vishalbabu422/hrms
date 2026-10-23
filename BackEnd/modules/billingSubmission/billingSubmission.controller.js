
const BillingSubmissionService = require("./billingSubmission.service");
const catchAsync = require("../../utils/catchAsync");
const BillingSubmissionPdf = require("../../utils/billingSubmissionPdf");
const APIFeatures = require("../../utils/apiFeature");

// Generate Invoice Number Preview
const generateInvoicePreview = catchAsync(async (req, res) => {
  const { wo_id } = req.params;

  const result =
    await BillingSubmissionService.generateInvoicePreview(
      wo_id
    );

  res.status(200).json({
    status: "success",
    message: "Invoice number generated successfully",
    data: result,
  });
});

// Get All Billing Submissions
const index = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  if (!features.query.where) {
    features.query.where = {};
  }

  const { rows, count } = await BillingSubmissionService.index(
    features.query
  );

  res.status(200).json({
    status: "success",
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    results: rows.length,
    data: {
      billingSubmissions: rows,
    },
  });
});

// Get Billing Submission by ID
const getById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await BillingSubmissionService.getById(id);

  if (!result || result.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "Submission Id not found",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      billingSubmission: result,
    },
  });
});

// Create Billing Submission
const create = catchAsync(async (req, res) => {
  const {
    wo_id,
    month,
    year,
    invoice_no,
    invoice_date,
    billing_amount,
    total_amount,
    pbg_id,
    pbg_submission_date,
    billing_igst_amt,
    billing_cgst_amt,
    billing_sgst_amt,
  } = req.body;

  if (!wo_id || !Number.isInteger(Number(wo_id)) || Number(wo_id) <= 0) {
    const error = new Error("Valid Work Order ID is required");
    error.statusCode = 400;
    throw error;
  }

  if (!Number.isInteger(Number(month)) || Number(month) < 1 || Number(month) > 12) {
    const error = new Error("Month must be between 1 and 12");
    error.statusCode = 400;
    throw error;
  }

  if (!invoice_no || !invoice_date) {
    const error = new Error("Invoice number and invoice date are required");
    error.statusCode = 400;
    throw error;
  }

  const payload = {
    wo_id,
    month,
    year,
    invoice_no,
    invoice_date,
    billing_amount,
    total_amount,
    pbg_id: pbg_id || null,
    pbg_submission_date: pbg_submission_date || null,
    billing_igst_amt,
    billing_cgst_amt,
    billing_sgst_amt,
  };

  const result = await BillingSubmissionService.create(payload);

  res.status(201).json({
    status: "success",
    message: "Billing Submission created successfully",
    data: {
      billingSubmission: result,
    },
  });
});
// Update Billing Submission
const update = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await BillingSubmissionService.update(
    id,
    req.body
  );

  res.status(200).json({
    status: "success",
    message: "Billing Submission updated successfully",
    data: {
      billingSubmission: result,
    },
  });
});

// Soft Delete Billing Submission
const deleteBillingSubmission = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await BillingSubmissionService.deleteBillingSubmission(id);

  res.status(200).json({
    status: "success",
    message: "Billing Submission deleted successfully",
  });
});


const generatePdf = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Get billing, work order, vendor and PBG data
  const data =
    await BillingSubmissionService.generateBillingSubmissionPdf(id);

  // Generate PDF buffer
  const pdfBuffer = await BillingSubmissionPdf.generate(data);

  // Send PDF as downloadable response
  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="billing-submission-${id}.pdf"`
  );

  res.setHeader("Content-Length", pdfBuffer.length);

  return res.status(200).send(pdfBuffer);
});


module.exports = {
  generateInvoicePreview,
  index,
  getById,
  create,
  update,
  deleteBillingSubmission,
  generatePdf,
  
};