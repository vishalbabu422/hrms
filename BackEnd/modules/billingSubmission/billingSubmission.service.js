const {
  WorkOrder,
  VendorMaster,
  WoDesgnMapping,
  BillingSubmission,
  PbgMaster,
  Employee,
  EmployeeWorkOrderDeployment,
  Designation,
  ResourceRate,
  EmployeeWorkOrderLeave,
  EmpanelmentMaster,
  CompanyMaster,
  EmployeeSalaryRegister,
  EmpSalaryStructure,
  EmployeeSalaryAddon,
  SalaryComponent,
  StateMaster,
  GstCodeMaster
} = require("../../models");
const { Op } = require("sequelize");
const buildFinancialYear = (year, month) => {
  const startYear = month >= 4 ? year : year - 1;
  const endYear = startYear + 1;

  return `${String(startYear).slice(-2)}-${String(endYear).slice(-2)}`;
};

const numberToIndianWords = (amount) => {
  const number = Number(amount);

  if (!Number.isFinite(number) || number < 0) {
    return "";
  }

  const whole = Math.floor(number);
  const paise = Math.round((number - whole) * 100);

  const ones = [
    "",
    "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen",
    "Fifteen", "Sixteen", "Seventeen", "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty",
    "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  const belowThousand = (n) => {
    let words = [];

    if (n >= 100) {
      words.push(ones[Math.floor(n / 100)], "Hundred");
      n %= 100;
    }

    if (n >= 20) {
      words.push(tens[Math.floor(n / 10)]);
      n %= 10;
    }

    if (n > 0) {
      words.push(ones[n]);
    }

    return words.join(" ");
  };

  const indianNumberWords = (n) => {
    if (n === 0) return "Zero";

    const parts = [];

    const crore = Math.floor(n / 10000000);
    n %= 10000000;

    const lakh = Math.floor(n / 100000);
    n %= 100000;

    const thousand = Math.floor(n / 1000);
    n %= 1000;

    if (crore) parts.push(`${belowThousand(crore)} Crore`);
    if (lakh) parts.push(`${belowThousand(lakh)} Lakh`);
    if (thousand) parts.push(`${belowThousand(thousand)} Thousand`);
    if (n) parts.push(belowThousand(n));

    return parts.join(" ");
  };

  let result = `INR ${indianNumberWords(whole)}`;

  if (paise > 0) {
    result += ` and ${indianNumberWords(paise)} Paise`;
  }

  return `${result} Only`;
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
const monthName = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Kolkata",
  month: "short",
}).format(now).toUpperCase();

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
"id",
"desgn_id_fk",
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


  // Resource-wise employee details using Sequelize models
  const resourceDetails = [];

  for (const mapping of designationMappings) {
    const deployments = await EmployeeWorkOrderDeployment.findAll({
      where: {
        wo_desgn_id: mapping.id,
        is_deleted: false,
      },
      attributes: ["employee_id", "wo_desgn_id"],
    });

    for (const deployment of deployments) {
      const employee = await Employee.findOne({
        where: {
          id: deployment.employee_id,
          is_active: true,
          is_deleted: false,
        },
        attributes: [
          "id",
          "first_name",
          "middle_name",
          "last_name",
        ],
      });

      if (!employee) continue;

      const designation = await Designation.findOne({
        where: {
          id: mapping.desgn_id_fk,
          is_active: true,
        },
        attributes: ["id", "designation", "exp_in_years"],
      });

      const resourceRate = await ResourceRate.findOne({
        where: {
          desgn_id_fk: mapping.desgn_id_fk,
          is_active: true,
        },
        attributes: ["nicsi_margin_amount"],
      });

      const salaryRegister = await EmployeeSalaryRegister.findOne({
        where: {
          employee_id: employee.id,
          month,
          year,
          is_deleted: false,
        },
        attributes: ["leave_deduction"],
      });
      
      const employeeLeave = await EmployeeWorkOrderLeave.findOne({
  where: {
    wo_id: billing.wo_id,
    employee_id: employee.id,
    month: Number(billing.month),
    year: String(billing.year),
  },
});
  const empanelment = await EmpanelmentMaster.findOne({
      where: {
        is_active: true,
      },
      attributes: ["leaves_per_month"],
    });

      resourceDetails.push({
        employee_id: employee.id,
        employee_name: [
          employee.first_name,
          employee.middle_name,
          employee.last_name,
        ]
          .filter(Boolean)
          .join(" "),

        designation: designation?.designation || "",
        experience: designation?.exp_in_years ?? null,
        leaves_per_month: empanelment?.leaves_per_month ?? 0,
        work_order_id: workOrder.id,
        work_order_no: workOrder.work_order_no,

        nicsi_rate_margin:
          resourceRate?.nicsi_margin_amount ?? null,

        current_month: monthName,
        current_month_days: new Date(year, month, 0).getDate(),

        leave_deduction: employeeLeave?.leave_granted ?? 0,
      });
    }
  }


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
    resourceDetails,
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

  const gstEffectiveDate = billing.invoice_date
  ? new Date(billing.invoice_date).toISOString().slice(0, 10)
  : `${billing.year}-${String(billing.month).padStart(2, "0")}-01`;

const gstDetails = await GstCodeMaster.findOne({
  where: {
    code_type: "SAC",
    is_active: true,
    effective_from: {
      [Op.lte]: gstEffectiveDate,
    },
    [Op.or]: [
      { effective_to: null },
      {
        effective_to: {
          [Op.gte]: gstEffectiveDate,
        },
      },
    ],
  },
  attributes: ["code", "gst_rate", "effective_from"],
  order: [["effective_from", "DESC"]],
});
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
  const vendorState = vendor.state
  ? await StateMaster.findOne({
      where: {
        state_name: {
          [Op.iLike]: vendor.state.trim(),
        },
        is_active: true,
      },
      attributes: ["state_name", "state_code", "lgd_code"],
    })
  : null;

const vendorAddress = [
  vendor.address_line1,
  vendor.address_line2,
  [vendor.city, vendor.state].filter(Boolean).join(", "),
]
  .filter(Boolean)
  .join("\n");

  // 4. Get Deployment Details for this Work Order
  const deploymentDetails = await WoDesgnMapping.findAll({
  where: {
    work_order_id: workOrder.id,
    is_active: true,
  },
  attributes: [
    "id",
    "desgn_id_fk",
    "deployment_from",
    "deployment_to",
    "req_person_count",
  ],
  order: [["id", "ASC"]],
});


// 5. Get resource-wise employee details for the billing month
const resourceDetails = [];

const billingMonth = Number(billing.month);
const billingYear = Number(billing.year);

const currentMonthName = new Date(
  Date.UTC(billingYear, billingMonth - 1, 1)
)
  .toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  })
  .toUpperCase();

const currentMonthDays = new Date(
  billingYear,
  billingMonth,
  0
).getDate();

const reportEmpanelment = await EmpanelmentMaster.findOne({
  where: {
    is_active: true,
    effective_from: {
      [Op.lte]: `${billingYear}-${String(billingMonth).padStart(2, "0")}-01`,
    },
    [Op.or]: [
      { effective_to: null },
      {
        effective_to: {
          [Op.gte]: `${billingYear}-${String(billingMonth).padStart(2, "0")}-01`,
        },
      },
    ],
  },
  attributes: [
    "category",
    "empanelment_no",
    "leaves_per_month",
  ],
  include: [
  {
    model: CompanyMaster,
   attributes: [
  "company_name",
  "address_line1",
  "address_line2",
  "city",
  "state",
  "pincode",
],
    required: false,
  },
],
  order: [["effective_from", "DESC"]],
});
const buyerCompany = reportEmpanelment?.CompanyMaster;

const buyerState = buyerCompany?.state
  ? await StateMaster.findOne({
      where: {
        state_name: {
          [Op.iLike]: buyerCompany.state.trim(),
        },
        is_active: true,
      },
      attributes: ["state_name", "state_code", "lgd_code"],
    })
  : null;


const buyerAddress = [
  buyerCompany?.address_line1,
  buyerCompany?.address_line2,
  [
    buyerCompany?.city,
    buyerCompany?.state,
    buyerCompany?.pincode,
  ]
    .filter(Boolean)
    .join(", "),
]
  .filter(Boolean)
  .join("\n");

  
for (const mapping of deploymentDetails) {
  const deployments = await EmployeeWorkOrderDeployment.findAll({
    where: {
      wo_desgn_id: mapping.id,
      is_deleted: false,
    },
    attributes: ["employee_id", "wo_desgn_id"],
  });

  for (const deployment of deployments) {
    const employee = await Employee.findOne({
      where: {
        id: deployment.employee_id,
        is_active: true,
        is_deleted: false,
      },
      attributes: [
        "id",
        "first_name",
        "middle_name",
        "last_name",
      ],
    });

    if (!employee) continue;

    const designation = await Designation.findOne({
      where: {
        id: mapping.desgn_id_fk,
        is_active: true,
      },
      attributes: ["id", "designation", "exp_in_years"],
    });

    const resourceRate = await ResourceRate.findOne({
      where: {
        desgn_id_fk: mapping.desgn_id_fk,
        is_active: true,
      },
      attributes: ["nicsi_margin_amount"],
    });

   const employeeLeave = await EmployeeWorkOrderLeave.findOne({
  where: {
    wo_id: billing.wo_id,
    employee_id: employee.id,
    month: billingMonth,
    year: String(billingYear),
  },
  attributes: ["leave_taken", "leave_granted"],
});

// Employee salary register for billing month
const salaryRegister = await EmployeeSalaryRegister.findOne({
  where: {
    employee_id: employee.id,
    month: billingMonth,
    year: billingYear,
    is_deleted: false,
  },
  attributes: [
    "net_salary",
    "gross_earnings",
    "total_deductions",
    "leave_deduction",
    "paid_days",
    "lop_days",
  ],
});

// Salary structure CTC effective during billing month
const monthStart = `${billingYear}-${String(billingMonth).padStart(2, "0")}-01`;
const monthEnd = new Date(
  billingYear,
  billingMonth,
  0
).toISOString().slice(0, 10);

const salaryStructure = await EmpSalaryStructure.findOne({
  where: {
    employee_id: employee.id,
    is_deleted: false,
    is_active: true,
    effective_from: { [Op.lte]: monthEnd },
    [Op.or]: [
      { effective_to: null },
      { effective_to: { [Op.gte]: monthStart } },
    ],
  },
  attributes: ["ctc", "effective_from", "effective_to"],
  order: [["effective_from", "DESC"]],
});

// Employee salary addons effective during billing month
const salaryAddons = await EmployeeSalaryAddon.findAll({
  where: {
    employee_id: employee.id,
    is_active: true,
    is_deleted: false,
    effective_from: { [Op.lte]: monthEnd },
    [Op.or]: [
      { effective_to: null },
      { effective_to: { [Op.gte]: monthStart } },
    ],
  },
  attributes: ["amount", "recurrence_type"],
});

const totalAddonAmount = salaryAddons.reduce(
  (sum, addon) => sum + Number(addon.amount || 0),
  0
);

const netSalary = Number(salaryRegister?.net_salary || 0);
const totalSalaryReleased = netSalary + totalAddonAmount;

const grantedLeaves = Number(employeeLeave?.leave_granted || 0);
const payDays = Math.max(0, currentMonthDays - grantedLeaves);

    resourceDetails.push({
      employee_id: employee.id,

      resource_name: [
        employee.first_name,
        employee.middle_name,
        employee.last_name,
      ]
        .filter(Boolean)
        .join(" "),

      designation: designation?.designation || "",
      experience: designation?.exp_in_years ?? null,
      leaves_per_month: reportEmpanelment?.leaves_per_month ?? 0,
      nicsi_rate_margin:
        resourceRate?.nicsi_margin_amount ?? null,

      current_month: currentMonthName,
      current_month_days: currentMonthDays,
      
       leave_taken: employeeLeave?.leave_taken ?? 0,
       final_unpaid_leave: employeeLeave?.leave_granted ?? 0,
       leave_deduction: employeeLeave?.leave_granted ?? 0,

       resource_ctc: Number(salaryStructure?.ctc || 0),

available_leave_balance: "",

month_days: currentMonthDays,

mpr_leaves: Number(reportEmpanelment?.leaves_per_month || 0),

leave_deduction_leave_in_month: "",

leave_balance_after_adjustment: "",

pay_days: payDays,

tds: "",
pt_tax: "",
pf: "",
other_deductions: "",

net_pay: netSalary,

total_salary_released_incl: totalSalaryReleased,

utr_amount: totalSalaryReleased,    
    });
  }
}

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

  const descriptionOfServices = [
  ...new Set(
    resourceDetails
      .map((item) => {
        const designation = item.designation?.trim();
        if (!designation) return "";

        const experience =
          item.experience !== null &&
          item.experience !== undefined &&
          item.experience !== ""
            ? ` (${item.experience} years Experience)`
            : "";

        return `${designation}${experience}`;
      })
      .filter(Boolean)
  ),
].join("\n");
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
  resourceDetails,
  
  total_required_persons: totalRequiredPersons,
  wo_date: formatDate(workOrder.work_order_date),
  wo_period_from: woPeriodFrom,
  wo_period_to: woPeriodTo,

  // Leave Balance Report Details
category: reportEmpanelment?.category || "",
department: reportEmpanelment?.CompanyMaster?.company_name || "",
empanelment_no: reportEmpanelment?.empanelment_no || "",

// Vendor details for Tax Invoice
vendor_address: vendorAddress,
vendor_state: vendorState?.state_name || vendor.state || "",
vendor_state_code: vendorState?.state_code || "",
vendor_email: vendor.contact_email || "",

// Buyer details from CompanyMaster
buyer_company_name: buyerCompany?.company_name || "",
buyer_address: buyerAddress,
buyer_state: buyerState?.state_name || buyerCompany?.state || "",
buyer_state_code: buyerState?.lgd_code || "",

// Project name from WorkOrder
project_name: workOrder.project_name || "",  

description_of_services: descriptionOfServices,
hsn_sac: gstDetails?.code || "",
gst_rate: gstDetails?.gst_rate ?? "",
billing_amount: Number(billing.billing_amount || 0),

// Tax Invoice details from database
hsn_sac: gstDetails?.code ?? "",

taxable_value: Number(billing.billing_amount || 0),

gst_rate: gstDetails?.gst_rate ?? "",

igst_amount: Number(billing.billing_igst_amt || 0),

total_tax_amount: Number(
  billing.billing_igst_amt || 0
),

amount_in_words: numberToIndianWords(
  Number(billing.total_amount || 0)
),

bank_name: vendor?.bank_name || "",
account_number: vendor?.account_number || "",
branch_name: vendor?.branch_name || "",
ifsc_code: vendor?.ifsc_code || "",
};
};

// Preview Billing Submission PDF Data
exports.getBillingSubmissionPreview = async (id) => {
  const pdfData = await exports.generateBillingSubmissionPdf(id);

  return {
    generalDetails: {
      vendor_name: pdfData.vendor_name,
      project_no: pdfData.project_no,
      work_order_no: pdfData.work_order_no,
      milestone_based: pdfData.milestone_based,
      wo_date: pdfData.wo_date,
      wo_period_from: pdfData.wo_period_from,
      wo_period_to: pdfData.wo_period_to,
      project_name: pdfData.project_name,
      total_required_persons: pdfData.total_required_persons,
    },

    invoiceDetails: {
      invoice_no: pdfData.invoice_no,
      invoice_date: pdfData.invoice_date,
      month: pdfData.month,
      year: pdfData.year,
      billing_amount: pdfData.billing_amount,
      igst_amount: pdfData.igst_amount,
      total_amount: pdfData.total_amount,
    },

    pbgSubmissionDetails: {
      pbg_submission_date: pdfData.pbg_submission_date,
      nicsi_reg_no: pdfData.nicsi_reg_no,
      nicsi_reg_date: pdfData.nicsi_reg_date,
    },

    invoiceCalculation: {
      deployment_details: pdfData.deployment_details,
      resource_details: pdfData.resourceDetails,
      total_required_persons: pdfData.total_required_persons,
    },

    leaveBalanceReport: {
      category: pdfData.category,
      department: pdfData.department,
      empanelment_no: pdfData.empanelment_no,
      resource_details: pdfData.resourceDetails,
    },

    salaryCalculation: {
      resource_details: pdfData.resourceDetails,
    },
  };
};

