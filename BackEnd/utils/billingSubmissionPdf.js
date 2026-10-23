const PDFDocument = require("pdfkit");

const PAGE_WIDTH = 595.28; // A4 points
const PAGE_HEIGHT = 841.89;
const MARGIN = 35;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const textValue = (value) =>
  value === null || value === undefined ? "" : String(value);

const money = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return number.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const monthYear = (month, year) => {
  if (!month || !year) return "";
  const date = new Date(Number(year), Number(month) - 1, 1);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
};

function drawMainHeading(doc, title) {
  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text("NATIONAL INFORMATICS CENTRE SERVICES INC., NEW DELHI", MARGIN, 28, {
      width: CONTENT_WIDTH,
      align: "center",
    });

  doc.moveDown(0.5);
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(title, MARGIN, doc.y + 4, {
      width: CONTENT_WIDTH,
      align: "center",
    });

  doc.moveDown(0.5);
  doc
    .moveTo(MARGIN, doc.y + 3)
    .lineTo(PAGE_WIDTH - MARGIN, doc.y + 3)
    .lineWidth(1)
    .stroke();

  doc.y += 12;
}

function drawSectionTitle(doc, title) {
  doc.moveDown(0.35);
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(title, MARGIN, doc.y, { width: CONTENT_WIDTH });
  doc.moveDown(0.25);
}

function drawTable(doc, rows, widths, options = {}) {
  const xStart = options.x || MARGIN;
  const widthTotal = widths.reduce((sum, width) => sum + width, 0);
  const fontSize = options.fontSize || 8;
  const header =  false;
  const paddingX = options.paddingX ?? 4;
  const paddingY = options.paddingY ?? 4;

  rows.forEach((row, rowIndex) => {
    const values = row.map(textValue);
    doc.font(rowIndex === 0 && header ? "Helvetica-Bold" : "Helvetica");
    doc.fontSize(fontSize);

    const heights = values.map((value, cellIndex) =>
      doc.heightOfString(value, {
        width: widths[cellIndex] - paddingX * 2,
        fontSize,
        lineGap: 1,
      })
    );

    const rowHeight = Math.max(
      options.minRowHeight || 22,
      ...heights.map((height) => height + paddingY * 2)
    );

  if (doc.y + rowHeight > PAGE_HEIGHT - MARGIN)
  {
   doc.addPage();
   doc.y = MARGIN;
  }

    let x = xStart;
    const y = doc.y;

    values.forEach((value, cellIndex) => {
      const cellWidth = widths[cellIndex];

      if (rowIndex === 0 && header) {
        doc.save();
        doc.rect(x, y, cellWidth, rowHeight).fill("#EDEDED");
        doc.restore();
      }

      doc
        .lineWidth(0.5)
        .rect(x, y, cellWidth, rowHeight)
        .stroke("#555555");

      doc
        .font(rowIndex === 0 && header ? "Helvetica-Bold" : "Helvetica")
        .fontSize(fontSize)
        .fillColor("#000000")
        .text(value, x + paddingX, y + paddingY, {
          width: cellWidth - paddingX * 2,
          height: rowHeight - paddingY * 2,
          lineGap: 1,
          valign: "center",
        });

      x += cellWidth;
    });

    doc.y = y + rowHeight;
  });

  doc.y += 5;
  doc.x = MARGIN;
  doc.fillColor("#000000");
}

function drawLabelValueTable(doc, pairs, options = {}) {
  const labelWidth = options.labelWidth || 112;
  const valueWidth = (CONTENT_WIDTH - labelWidth * 2) / 2;

  const rows = [
    ...pairs.map((pair) => [
      pair[0] ?? "",
      pair[1] ?? "",
      pair[2] ?? "",
      pair[3] ?? "",
    ]),
  ];

  drawTable(
    doc,
    rows,
    [labelWidth, valueWidth, labelWidth, valueWidth],
    {
      fontSize: options.fontSize || 8,
      minRowHeight: options.minRowHeight || 21,
      header: false,
    }
  );
}


function drawFooterNote(doc, text) {
  const originalBottomMargin = doc.page.margins.bottom;

  doc.page.margins.bottom = 5;

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor("#444444")
    .text(text, MARGIN, PAGE_HEIGHT - 28, {
      width: CONTENT_WIDTH,
      align: "center",
      lineBreak: false,
    });

  doc.page.margins.bottom = originalBottomMargin;
  doc.fillColor("#000000");
}


class BillingSubmissionPdf {
  static async generate(data = {}) {
    const doc = new PDFDocument({
      size: "A4",
      margins: {
        top: MARGIN,
        bottom: MARGIN,
        left: MARGIN,
        right: MARGIN,
      },
      bufferPages: true,
      autoFirstPage: true,
      info: {
        Title: "NICSI Bill Submission Form",
        Author: "NICSI",
        Subject: "Billing Submission",
      },
    });

    const chunks = [];
    const pdfBufferPromise = new Promise((resolve, reject) => {
      doc.on("data", (chunk) => chunks.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });

    // PAGE 1: BILL SUBMISSION FORM
    drawMainHeading(doc, "BILL SUBMISSION FORM");

    doc.font("Helvetica").fontSize(9).text(
      `Name of Vendor: ${textValue(data.vendor_name)}`,
      MARGIN,
      doc.y,
      { width: CONTENT_WIDTH }
    );
    doc.moveDown(0.4);

    drawSectionTitle(doc, "I. General Details");
    drawLabelValueTable(
      doc,
      [
        ["Project No.", data.project_no, "Regular/Backdated WO", data.wo_category],
        ["WO/AO No.", data.work_order_no, "WO/AO Date", data.wo_date],
        ["Period of WO From", data.wo_period_from, "To", data.wo_period_to],
        ["No. of Bill as per WO", "1", "Bill Count No.", data.bill_count_no],
        ["No. of Manpower", data.total_required_persons, "Category", data.category],
        ["Milestone Base (Y/N)", data.milestone_based, "Stage of % (if milestone based)", data.milestone_stage],
      ],
      { fontSize: 7.5, labelWidth: 112, minRowHeight: 21 }
    );

    drawSectionTitle(doc, "II. Check List");
    drawTable(
      doc,
      [
        ["Particulars", "Tick (Y/N)", "NICSI Observations"],
        ["Copy of WO & AO (if applicable)", "", ""],
        ["Triplicate Invoices", "", ""],
        ["Attendance Certificate", "", ""],
        ["Proof of Payment", "", ""],
        ["Short Manager (if applicable)", "", ""],
        ["BG attached (if applicable)", "", ""],
        ["Any other like SNR etc.", "", ""],
      ],
      [260, 90, CONTENT_WIDTH - 350],
      { fontSize: 7.5, minRowHeight: 18 }
    );

    drawSectionTitle(doc, "III. Invoice Details");
    drawTable(
      doc,
      [
        ["Invoice No.", "Invoice Date", "Month & Year", "Bill Amount", "IGST", "Total Amount"],
        [
          data.invoice_no,
          textValue(data.invoice_date),
          monthYear(data.month, data.year),
          money(data.billing_amount),
          money(data.igst_amount),
          money(data.total_amount),
        ],
      ],
      [110, 75, 75, 82, 65, CONTENT_WIDTH - 407],
      { fontSize: 7, minRowHeight: 25 }
    );
drawSectionTitle(doc, "IV. PBG Submission Details");

drawTable(
  doc,
  [
    [
      "PBG (NICSI Register No.)",
      [data.nicsi_reg_no, data.nicsi_reg_date]
        .filter((value) => value !== null && value !== undefined && value !== "")
        .join(" "),
    ],
    ["PBG Submission Date", data.pbg_submission_date ?? ""],
  ],
  [190, CONTENT_WIDTH - 190],
  {
    fontSize: 8,
    minRowHeight: 22,
    header: false,
  }
);

    drawSectionTitle(doc, "V. Certification");
    doc.font("Helvetica").fontSize(8).text(
      "This is to certify that:",
      MARGIN,
      doc.y
    );
    doc.moveDown(0.25);
    doc.fontSize(7.5).text(
      "i. Previous month bill(s) of this WO is not pending for submission. No claim for payment will be made against this WO for previous months.",
      MARGIN + 10,
      doc.y,
      { width: CONTENT_WIDTH - 20 }
    );
    doc.moveDown(0.25);
    doc.text(
      "ii. A complete/full-service bill for the month is submitted & paid.",
      MARGIN + 10,
      doc.y,
      { width: CONTENT_WIDTH - 20 }
    );
    doc.moveDown(0.7);

    // Contact Details - Without Table
const startY = doc.y + 10;

const leftX = MARGIN;
const rightX = MARGIN + CONTENT_WIDTH / 2;

doc.font("Helvetica").fontSize(8);

doc.text(`Mobile No.: ${textValue(data.contact_phone)}`, leftX, startY, {
  width: CONTENT_WIDTH / 2 - 10,
});

doc.text(`Email ID: ${textValue(data.contact_email)}`, leftX, startY + 12, {
  width: CONTENT_WIDTH / 2 - 10,
});

doc.text(
  `Project Manager: ${textValue(data.contact_person)}`,
  leftX,
  startY + 24,
  { width: CONTENT_WIDTH / 2 - 10 }
);

// Vendor Signature Section
doc.font("Helvetica-Bold").text(
  "Signature & Stamp of the Vendor",
  rightX,
  startY,
  { width: CONTENT_WIDTH / 2 }
);

doc.font("Helvetica").text(
  `Name: ${textValue(data.contact_person)}`,
  rightX,
  startY + 12,
  { width: CONTENT_WIDTH / 2 }
);



doc.y = startY + 50;

    drawSectionTitle(doc, "VI. For Office Use (Amount in INR)");
    drawTable(
      doc,
      [
        ["NICSI-Accounts (Provision)", "Amount", "Projects", "Amount"],
        ["Amount", "", "Bill Amount", ""],
        ["Penalty", "", "OM ______ %", ""],
        ["TDS", "", "Service Tax", ""],
        ["Net Amount", "", "Total Amount", ""],
        ["Signature DM (Account)", "", "", ""],
      ],
      [155, 85, 155, CONTENT_WIDTH - 395],
      { fontSize: 7.5, minRowHeight: 18 }
    );
    drawFooterNote(doc, "Computer-generated bill submission form");

    // PAGE 2: INVOICE CALCULATION
    doc.addPage();
    drawMainHeading(doc, "INVOICE CALCULATION");
    drawTable(
      doc,
      [
        [
          "Sr. No.",
          "Designation",
          "Resource Name",
          "Billing Days",
          "NICSI Rate Inc. Margin",
          "Month",
          "Available Leave Balance",
          "Total Days",
          "MPR Leaves",
          "Leave Deduction",
          "Balance After Leave Adjustment",
          "Billing Days",
          "Invoice Amount",
        ],
        ...(Array.isArray(data.deployment_details) && data.deployment_details.length
          ? data.deployment_details.map((item, index) => [
              index + 1,
              textValue(item.designation),
              textValue(item.resource_name),
              "",
              "",
              monthYear(data.month, data.year),
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ])
          : [["1", "", "", "", "", monthYear(data.month, data.year), "", "", "", "", "", "", ""]]),
        ["", "", "", "", "", "", "", "", "", "", "", "TOTAL", money(data.billing_amount)],
      ],
      [22, 55, 45, 35, 45, 38, 42, 30, 30, 35, 45, 35, 68],
      { fontSize: 5.5, minRowHeight: 38, paddingX: 2, paddingY: 3 }
    );
    drawFooterNote(doc, "Fields without source data are intentionally left blank.");

    // PAGE 3: LEAVE BALANCE REPORT
    doc.addPage();
    drawMainHeading(doc, "LEAVE BALANCE REPORT");
    drawTable(
      doc,
      [
        ["Sr. No.", "Category", "Work Order Number", "Department", "Work Order Tenure Start Date", "End Date"],
        ["1", textValue(data.category), textValue(data.work_order_no), textValue(data.department), textValue(data.wo_period_from), textValue(data.wo_period_to)],
      ],
      [35, 135, 85, 105, 75, CONTENT_WIDTH - 435],
      { fontSize: 7, minRowHeight: 36 }
    );

    doc.moveDown(1);
    doc.font("Helvetica").fontSize(8).text(
      `Empanelment No.: ${textValue(data.empanelment_no)}`,
      MARGIN,
      doc.y
    );
    doc.moveDown(1);

    drawTable(
      doc,
      [
        ["Sr. No.", "Candidate Name", "Leave Applicable / Month", "Leave Taken as per MPR", "Final Unpaid Leave", "Balance after Leave Taken"],
        ["1", textValue(data.candidate_name), monthYear(data.month, data.year), "", "", ""],
      ],
      [35, 125, 90, 90, 90, CONTENT_WIDTH - 430],
      { fontSize: 7, minRowHeight: 38 }
    );
    drawFooterNote(doc, "Leave information is blank where it was not available in the source data.");

    // PAGE 4: SALARY CALCULATION
    doc.addPage();
    drawMainHeading(doc, "SALARY CALCULATION");
    drawTable(
      doc,
      [
        [
          "Sr. No.",
          "Designation",
          "Resource Name",
          "Resource CTC",
          "Month",
          "Available Leave Balance",
          "Month Days",
          "MPR Leaves",
          "Leave Deduction",
          "Balance After Leave Adjustment",
          "Pay Days",
          "TDS",
          "P.T. Tax",
          "PF",
          "Other Deductions",
          "Net Pay",
          "Total Salary Released",
          "UTR Amount",
        ],
        [
          "1",
          textValue(data.designation),
          textValue(data.resource_name),
          "",
          monthYear(data.month, data.year),
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ],
        ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "TOTAL", ""],
      ],
      [20, 40, 35, 30, 30, 32, 22, 22, 25, 28, 22, 22, 22, 22, 28, 28, 35, 62],
      { fontSize: 5, minRowHeight: 45, paddingX: 1.5, paddingY: 3 }
    );
    drawFooterNote(doc, "Salary and deduction details are intentionally blank unless supplied by the backend.");

    // PAGE 5: TAX INVOICE
    doc.addPage();
    drawMainHeading(doc, "TAX INVOICE");

    const halfWidth = CONTENT_WIDTH / 2;
    drawTable(
      doc,
      [
        ["Seller Details", "Invoice Details"],
        [
          [
            textValue(data.vendor_name),
            textValue(data.vendor_address),
            data.vendor_gstin ? `GSTIN/UIN: ${data.vendor_gstin}` : "",
            data.vendor_state ? `State Name: ${data.vendor_state}` : "",
            data.contact_email ? `Email: ${data.contact_email}` : "",
          ].filter(Boolean).join("\n"),
          [
            `Invoice No.: ${textValue(data.invoice_no)}`,
            `Dated: ${textValue(data.invoice_date)}`,
            `Project No.: ${textValue(data.project_no)}`,
            `WO/AO No.: ${textValue(data.work_order_no)}`,
            `WO/AO Date: ${textValue(data.wo_date)}`,
          ].join("\n"),
        ],
      ],
      [halfWidth, halfWidth],
      { fontSize: 7, minRowHeight: 65, paddingY: 3 }
    );

    drawTable(
      doc,
      [
        ["Buyer (Bill to)", "Buyer Details"],
        [
          "National Informatics Centre Services Incorporated (NICSI)\nHall No. 2 & 3, 6th Floor, NBCC Tower,\n15 Bhikaji Cama Place, New Delhi – 110066",
          [
            "GSTIN/UIN: 07AAACN2185J1ZE",
            "PAN/IT No.: ABMWP2185J",
            "State Name: Delhi, Code: 07",
          ].join("\n"),
        ],
      ],
      [halfWidth, halfWidth],
      { fontSize: 7, minRowHeight: 55, paddingY: 3 }
    );

    drawSectionTitle(doc, "Description of Services");
    const deploymentDescription =
      Array.isArray(data.deployment_details) && data.deployment_details.length
        ? data.deployment_details
            .map((item) => {
              const dates = [textValue(item.deployment_from), textValue(item.deployment_to)]
                .filter(Boolean)
                .join(" to ");
              return [
                textValue(item.designation),
                dates ? `from ${dates}` : "",
              ]
                .filter(Boolean)
                .join(" ");
            })
            .filter(Boolean)
            .join("\n")
        : "";

    drawTable(
      doc,
      [
        ["Description of Services", "HSN/SAC", "GST Rate", "Amount"],
        [deploymentDescription, textValue(data.hsn_sac), textValue(data.gst_rate), money(data.billing_amount)],
        ["IGST on Sales", "", "", money(data.igst_amount)],
        ["CGST on Sales", "", "", money(data.cgst_amount)],
        ["SGST on Sales", "", "", money(data.sgst_amount)],
        ["Total", "", "", money(data.total_amount)],
      ],
      [CONTENT_WIDTH - 190, 55, 55, 80],
      { fontSize: 7, minRowHeight: 20, paddingY: 2 }
    );

    doc.moveDown(0.6);
    doc.font("Helvetica").fontSize(8).text(
      `Amount Chargeable (in words): ${textValue(data.amount_in_words)}`,
      MARGIN,
      doc.y,
      { width: CONTENT_WIDTH }
    );
    doc.moveDown(0.8);

    drawSectionTitle(doc, "Tax Summary");
    drawTable(
      doc,
      [
        ["HSN/SAC", "Taxable Value", "IGST Rate", "IGST Amount", "Total Tax Amount"],
        [
          textValue(data.hsn_sac),
          money(data.billing_amount),
          textValue(data.gst_rate),
          money(data.igst_amount),
          money(data.igst_amount),
        ],
        ["Total", money(data.billing_amount), "", money(data.igst_amount), money(data.igst_amount)],
      ],
      [75, 105, 75, 100, CONTENT_WIDTH - 355],
      { fontSize: 7, minRowHeight: 18, paddingY: 2 }
    );

    drawSectionTitle(doc, "Company's Bank Details");
    drawTable(
      doc,
      [
        ["Particulars", "Details"],
        ["A/c Holder's Name", textValue(data.bank_account_holder)],
        ["Bank Name", textValue(data.bank_name)],
        ["A/c No.", textValue(data.bank_account_no)],
        ["Branch & IFS Code", textValue(data.bank_branch_ifsc)],
        ["Company's PAN", textValue(data.vendor_pan)],
      ],
      [190, CONTENT_WIDTH - 190],
      { fontSize: 7, minRowHeight: 18, paddingY: 2 }
    );

    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(7.5).text(
      textValue(data.declaration),
      MARGIN,
      doc.y,
      { width: CONTENT_WIDTH }
    );
    doc.moveDown(0.8);
    doc.font("Helvetica-Bold").fontSize(8).text(
      `For ${textValue(data.vendor_name)}`,
      MARGIN,
      doc.y,
      { width: CONTENT_WIDTH, align: "right" }
    );
    doc.moveDown(1.5);
    doc.font("Helvetica").fontSize(8).text("Authorized Signatory", MARGIN, doc.y, {
      width: CONTENT_WIDTH,
      align: "right",
    });
    drawFooterNote(doc, "This PDF was generated from available Billing Submission data.");

    // Add page numbers to every page.
   
const range = doc.bufferedPageRange();

for (let i = 0; i < range.count; i += 1) {
  doc.switchToPage(i);

  const originalBottomMargin = doc.page.margins.bottom;
  doc.page.margins.bottom = 5;

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor("#555555")
    .text(
      `Page ${i + 1} of ${range.count}`,
      MARGIN,
      PAGE_HEIGHT - 16,
      {
        width: CONTENT_WIDTH,
        align: "right",
        lineBreak: false,
      }
    );

  doc.page.margins.bottom = originalBottomMargin;
}

doc.end();
return pdfBufferPromise;

  }
}

module.exports = BillingSubmissionPdf;