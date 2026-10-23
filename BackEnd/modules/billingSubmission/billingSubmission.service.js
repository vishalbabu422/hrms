
const { WorkOrder, VendorMaster,WoDesgnMapping, BillingSubmission, PbgMaster} = require("../../models");

const buildFinancialYear = (year, month) => {
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;

  return `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
};

// Invoice Number Preview
exports.generateInvoicePreview = async (wo_id) => {
  if (!wo_id || !Number.isInteger(Number(wo_id)) || Number(wo_id) <= 0) 
    {
    const error = new Error("Valid Work Order ID is required");
    error.statusCode = 400;
    throw error;
    }

// Get current date according to Indian timezone
const now = new Date();

const dateParts = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
}).formatToParts(now);

const dateValues = Object.fromEntries(
  dateParts.map(({ type, value }) => [type, value])
);

const day = dateValues.day;
const month = Number(dateValues.month);
const year = Number(dateValues.year);

const workOrder = await WorkOrder.findOne({
where: {
      id: wo_id,
      is_active: true,
    },
    attributes: ["id", "work_order_no", "vendor_id_fk"],
  });

  if (!workOrder) {
    const error = new Error("Work Order not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  const vendor = await VendorMaster.findOne({
    where: {
      id: workOrder.vendor_id_fk,
      is_active: true,
    },
    attributes: ["id", "vendor_code", "vendor_name"],
  });

  if (!vendor) {
    const error = new Error("Vendor not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  if (!vendor.vendor_code) {
    const error = new Error("Vendor code is missing");
    error.statusCode = 400;
    throw error;
  }

const designationMappings = await WoDesgnMapping.findAll({
 where: {
work_order_id: workOrder.id,
is_active: true,
},
attributes: [
"deployment_from",
"deployment_to",
"duration_days",
"req_person_count",
"monthly_unit_rate",
"cgst_amount",
"sgst_amount",
"igst_amount",
],
order: [["id", "ASC"]],
});

const deploymentDetails = designationMappings.map((item) => ({
from: item.deployment_from,
to: item.deployment_to,
duration_days: item.duration_days,
req_person_count: item.req_person_count,
monthly_unit_rate: item.monthly_unit_rate,
cgst_amount: item.cgst_amount,
sgst_amount: item.sgst_amount,
igst_amount: item.igst_amount,
}));

  const monthName = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Kolkata",
  month: "short",
}).format(now);

const financialYear = buildFinancialYear(year, month);

const invoice_no =
  `${vendor.vendor_code}/${financialYear}/${monthName}${day}`;

  return {
    wo_id: workOrder.id,
    work_order_no: workOrder.work_order_no,
    vendor_id: vendor.id,
    vendor_code: vendor.vendor_code,
    month,
    year,
    financial_year: financialYear,
    invoice_no,
    deploymentDetails,
  };
};

// Get All Billing Submissions
exports.index = async (queryOptions) => {
  return await BillingSubmission.findAndCountAll({
    ...queryOptions,

    where: {
      ...(queryOptions.where || {}),
      is_active: true,
    },

    // Related PBG details
    include: [
      {
        model: PbgMaster,
        as: "pbg",
        attributes: [
          "id",
          "pbg_no",
          "start_date",
          "end_date",
          "amount",
          "is_active",
        ],
        required: false,
      },
    ],
  });
};
// Get Billing Submission by ID
exports.getById = async (id) => {
  const billingSubmission = await BillingSubmission.findOne({
    where: {
      id,
      is_active: true,
    },
    include: [
      {
        model: PbgMaster,
        as: "pbg",
        required: false,
      },
    ],
  });

  if (!billingSubmission) {
    const error = new Error("Billing Submission not found");
    error.statusCode = 404;
    throw error;
  }

  return billingSubmission;
};
// Create Billing Submission
exports.create = async (payload) => {
  return await BillingSubmission.create(payload);
};
// Update Billing Submission
exports.update = async (id, data) => {
  const billingSubmission = await BillingSubmission.findOne({
    where: {
      id,
      is_active: true,
    },
  });

  if (!billingSubmission) {
    const error = new Error("Billing Submission not found");
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = [
    "wo_id",
    "month",
    "year",
    "invoice_no",
    "invoice_date",
    "billing_amount",
    "total_amount",
    "pbg_id",
    "pbg_submission_date",
    "billing_igst_amt",
    "billing_cgst_amt",
    "billing_sgst_amt",
  ];

  const updateData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    const error = new Error(
      "At least one valid field is required for update"
    );
    error.statusCode = 400;
    throw error;
  }

  updateData.updated_at = new Date();

  await billingSubmission.update(updateData);

  return billingSubmission;
};
// Soft Delete Billing Submission
exports.deleteBillingSubmission = async (id) => {
  const billingSubmission = await BillingSubmission.findOne({
    where: {
      id,
      is_active: true,
    },
  });

  if (!billingSubmission) {
    const error = new Error("Billing Submission not found");
    error.statusCode = 404;
    throw error;
  }

  await billingSubmission.update({
    is_active: false,
    updated_at: new Date(),
  });
};

// Generate Billing Submission PDF Data
exports.generateBillingSubmissionPdf = async (id) => {

 const formatDate = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getUTCDate()).padStart(2, "0");

  const month = date.toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });

  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
};

  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
    const error = new Error("Valid Billing Submission ID is required");
    error.statusCode = 400;
    throw error;
  }

  // 1. Get Billing Submission
  const billing = await BillingSubmission.findOne({
    where: {
      id: Number(id),
      is_active: true,
    },
  });

  if (!billing) {
    const error = new Error("Billing Submission not found");
    error.statusCode = 404;
    throw error;
  }

  // 2. Get Work Order
  const workOrder = await WorkOrder.findOne({
    where: {
      id: billing.wo_id,
      is_active: true,
    },
  });

  if (!workOrder) {
    const error = new Error("Work Order not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  // 3. Get Vendor Details
  const vendor = await VendorMaster.findOne({
    where: {
      id: workOrder.vendor_id_fk,
      is_active: true,
    },
  });

  if (!vendor) {
    const error = new Error("Vendor not found or inactive");
    error.statusCode = 404;
    throw error;
  }

  // 4. Get Deployment Details for this Work Order
  const deploymentDetails = await WoDesgnMapping.findAll({
    where: {
      work_order_id: workOrder.id,
      is_active: true,
    },
    attributes: [
      "deployment_from",
      "deployment_to",
      "req_person_count",
    ],
    order: [["id", "ASC"]],
  });

  // 5. Calculate total required persons
  const totalRequiredPersons = deploymentDetails.reduce(
    (sum, item) => sum + Number(item.req_person_count || 0),
    0
  );

 const validFromDates = deploymentDetails
  .map((item) => item.deployment_from)
  .filter(Boolean);

const validToDates = deploymentDetails
  .map((item) => item.deployment_to)
  .filter(Boolean);

const woPeriodFrom = validFromDates.length
  ? formatDate(
      new Date(
        Math.min(
          ...validFromDates.map((date) => new Date(date).getTime())
        )
      )
    )
  : "";

const woPeriodTo = validToDates.length
  ? formatDate(
      new Date(
        Math.max(
          ...validToDates.map((date) => new Date(date).getTime())
        )
      )
    )
  : "";
  // 6. Get PBG Details (PBG is optional)
  let pbg = null;

  if (billing.pbg_id) {
    pbg = await PbgMaster.findOne({
      where: {
        id: billing.pbg_id,
      },
      attributes: [
        "id",
        "nicsi_reg_no",
        "nicsi_reg_date",
      ],
    });
  }

  // 7. Prepare PDF data
  return {
  vendor_name: vendor.vendor_name || "",

  project_no: workOrder.project_no,
  work_order_no: workOrder.work_order_no,

  milestone_based:
    workOrder.type === "MILESTONES_PROJECT_BASIS" ? "Y" : "N",

  invoice_no: billing.invoice_no,
  invoice_date: formatDate(billing.invoice_date),
  month: billing.month,
  year: billing.year,

  billing_amount: Number(billing.billing_amount || 0),
  igst_amount: Number(billing.billing_igst_amt || 0),
  cgst_amount: Number(billing.billing_cgst_amt || 0),
  sgst_amount: Number(billing.billing_sgst_amt || 0),
  total_amount: Number(billing.total_amount || 0),

  pbg_submission_date: formatDate(billing.pbg_submission_date),

  nicsi_reg_no: pbg?.nicsi_reg_no || "",
  nicsi_reg_date: formatDate(pbg?.nicsi_reg_date),

  contact_person: vendor.contact_person || "",
  contact_phone: vendor.contact_phone || "",
  contact_email: vendor.contact_email || "",

  deployment_details: deploymentDetails.map((item) => ({
    deployment_from: formatDate(item.deployment_from),
    deployment_to: formatDate(item.deployment_to),
    req_person_count: Number(item.req_person_count || 0),
  })),

  total_required_persons: totalRequiredPersons,
  wo_date: formatDate(workOrder.work_order_date),
  wo_period_from: woPeriodFrom,
  wo_period_to: woPeriodTo,
};
};

