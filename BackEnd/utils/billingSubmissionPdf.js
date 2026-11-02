const PDFDocument = require("pdfkit");

const PAGE_WIDTH = 595.28;
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
  const pageWidth = doc.page.width;
  const contentWidth = pageWidth - MARGIN * 2;

  doc
    .font("Helvetica-Bold")
    .fontSize(11)
    .text(
      "NATIONAL INFORMATICS CENTRE SERVICES INC., NEW DELHI",
      MARGIN,
      28,
      {
        width: contentWidth,
        align: "center",
      }
    );

  doc.moveDown(0.5);

  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(title, MARGIN, doc.y + 4, {
      width: contentWidth,
      align: "center",
    });

  doc.moveDown(0.5);

  doc
    .moveTo(MARGIN, doc.y + 3)
    .lineTo(pageWidth - MARGIN, doc.y + 3)
    .lineWidth(1)
    .stroke();

  doc.y += 12;
}

function drawSectionTitle(doc, title) {
  doc.moveDown(0.35);

  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .text(title, MARGIN, doc.y, {
      width: doc.page.width - MARGIN * 2,
    });

  doc.moveDown(0.25);
}

function drawTable(doc, rows, widths, options = {}) {
  const xStart = options.x ?? MARGIN;
  const fontSize = options.fontSize || 8;
  const header = options.header ?? false;
  const paddingX = options.paddingX ?? 4;
  const paddingY = options.paddingY ?? 4;

  rows.forEach((row, rowIndex) => {
    const values = row.map(textValue);

    doc
      .font(rowIndex === 0 && header ? "Helvetica-Bold" : "Helvetica")
      .fontSize(fontSize);

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

    // Preserve the current page orientation on overflow.
    const bottomLimit = doc.page.height - MARGIN;

    if (doc.y + rowHeight > bottomLimit) {
      const layout =
        doc.page.width > doc.page.height ? "landscape" : "portrait";

      doc.addPage({
        size: "A4",
        layout,
        margins: {
          top: MARGIN,
          bottom: MARGIN,
          left: MARGIN,
          right: MARGIN,
        },
      });

      doc.x = MARGIN;
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
  const pageContentWidth = doc.page.width - MARGIN * 2;
  const valueWidth = (pageContentWidth - labelWidth * 2) / 2;

  const rows = pairs.map((pair) => [
    pair[0] ?? "",
    pair[1] ?? "",
    pair[2] ?? "",
    pair[3] ?? "",
  ]);

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

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;
  const contentWidth = pageWidth - MARGIN * 2;

  doc.page.margins.bottom = 5;

  doc
    .font("Helvetica")
    .fontSize(7)
    .fillColor("#444444")
    .text(text, MARGIN, pageHeight - 28, {
      width: contentWidth,
      height: 10,
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

    // =========================================================
    // PAGE 1: BILL SUBMISSION FORM
    // =========================================================

    drawMainHeading(doc, "BILL SUBMISSION FORM");

    doc
      .font("Helvetica")
      .fontSize(9)
      .text(
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
        [
          "Milestone Base (Y/N)",
          data.milestone_based,
          "Stage of % (if milestone based)",
          data.milestone_stage,
        ],
      ],
      {
        fontSize: 7.5,
        labelWidth: 112,
        minRowHeight: 21,
      }
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
      {
        fontSize: 7.5,
        minRowHeight: 18,
      }
    );

    drawSectionTitle(doc, "III. Invoice Details");

    drawTable(
      doc,
      [
        [
          "Invoice No.",
          "Invoice Date",
          "Month & Year",
          "Bill Amount",
          "IGST",
          "Total Amount",
        ],
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
      {
        fontSize: 7,
        minRowHeight: 25,
      }
    );

    drawSectionTitle(doc, "IV. PBG Submission Details");

    drawTable(
      doc,
      [
        [
          "PBG (NICSI Register No.)",
          [data.nicsi_reg_no, data.nicsi_reg_date]
            .filter(
              (value) =>
                value !== null &&
                value !== undefined &&
                value !== ""
            )
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

    doc
      .font("Helvetica")
      .fontSize(8)
      .text("This is to certify that:", MARGIN, doc.y);

    doc.moveDown(0.25);

    doc
      .fontSize(7.5)
      .text(
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

    // Contact details
    const startY = doc.y + 10;
    const leftX = MARGIN;
    const rightX = MARGIN + CONTENT_WIDTH / 2;

    doc.font("Helvetica").fontSize(8);

    doc.text(
      `Mobile No.: ${textValue(data.contact_phone)}`,
      leftX,
      startY,
      { width: CONTENT_WIDTH / 2 - 10 }
    );

    doc.text(
      `Email ID: ${textValue(data.contact_email)}`,
      leftX,
      startY + 12,
      { width: CONTENT_WIDTH / 2 - 10 }
    );

    doc.text(
      `Project Manager: ${textValue(data.contact_person)}`,
      leftX,
      startY + 24,
      { width: CONTENT_WIDTH / 2 - 10 }
    );

    // Vendor signature
    doc
      .font("Helvetica-Bold")
      .text(
        "Signature & Stamp of the Vendor",
        rightX,
        startY,
        { width: CONTENT_WIDTH / 2 }
      );

    doc
      .font("Helvetica")
      .text(
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
      {
        fontSize: 7.5,
        minRowHeight: 18,
      }
    );

    drawFooterNote(doc, "Computer-generated bill submission form");

    // =========================================================
    // PAGE 2: INVOICE CALCULATION
    // =========================================================

    doc.addPage({
      size: "A4",
      layout: "portrait",
      margins: {
        top: MARGIN,
        bottom: MARGIN,
        left: MARGIN,
        right: MARGIN,
      },
    });

    drawMainHeading(doc, "INVOICE CALCULATION");

    const billingDays = new Date(
      Number(data.year),
      Number(data.month),
      0
    ).getDate();

    const resourceRows =
      Array.isArray(data.resourceDetails) &&
      data.resourceDetails.length
        ? data.resourceDetails.map((item, index) => [
            index + 1,
            textValue(item.experience)
              ? `${textValue(item.designation)} (${textValue(item.experience)} years Experience)`
              : textValue(item.designation),
            textValue(
              item.employee_name ??
              item.resource_name ??
              ""
            ),
            billingDays,
            money(item.nicsi_rate_margin),
            textValue(item.current_month),
            "",
            textValue(item.current_month_days),
            textValue(item.leaves_per_month),
            money(item.leave_deduction),
            "",
            billingDays,
            money(data.billing_amount),
          ])
        : [[
            "1", "", "", "", "",
            monthYear(data.month, data.year),
            "", "", "", "", "", "", "",
          ]];

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
          "Leave Balance After Leave Adjustment",
          "Billing Days",
          "Invoice Amount",
        ],
        ...resourceRows,
        [
          "", "", "", "", "", "", "", "", "", "", "",
          "TOTAL",
          money(data.billing_amount),
        ],
      ],
      [22, 55, 45, 35, 45, 38, 42, 30, 30, 35, 45, 35, 68],
      {
        fontSize: 5.5,
        minRowHeight: 38,
        paddingX: 2,
        paddingY: 3,
      }
    );

    drawFooterNote(
      doc,
      "Fields without source data are intentionally left blank."
    );

    // =========================================================
    // PAGE 3: LEAVE BALANCE REPORT
    // =========================================================

    doc.addPage({
      size: "A4",
      layout: "portrait",
      margins: {
        top: MARGIN,
        bottom: MARGIN,
        left: MARGIN,
        right: MARGIN,
      },
    });

    drawMainHeading(doc, "LEAVE BALANCE REPORT");

    drawTable(
      doc,
      [
        [
          "Sr. No.",
          "Category",
          "Work Order Number",
          "Department",
          "Work Order Tenure Start Date",
          "End Date",
        ],
        [
          "1",
          textValue(data.category),
          textValue(data.work_order_no),
          textValue(data.department),
          textValue(data.wo_period_from),
          textValue(data.wo_period_to),
        ],
      ],
      [35, 135, 85, 105, 75, CONTENT_WIDTH - 435],
      {
        fontSize: 7,
        minRowHeight: 36,
      }
    );

    doc.moveDown(1);

    doc
      .font("Helvetica")
      .fontSize(8)
      .text(
        `Empanelment No.: ${textValue(data.empanelment_no)}`,
        MARGIN,
        doc.y
      );

    doc.moveDown(1);

    drawTable(
      doc,
      [
        [
          "Sr. No.",
          "Candidate Name",
          "Leave Applicable / Month",
          "Leave Taken as per MPR",
          "Final Unpaid Leave",
          "Balance after Leave Taken",
        ],
        ...(Array.isArray(data.resourceDetails) &&
        data.resourceDetails.length > 0
          ? data.resourceDetails.map((item, index) => [
              index + 1,
              textValue(item.employee_name ?? item.resource_name),
              textValue(item.leaves_per_month),
              textValue(item.leave_taken),
              textValue(item.final_unpaid_leave),
              textValue(item.balance_after_leave_taken),
            ])
          : [["1", "", "", "", "", ""]]),
      ],
      [35, 125, 90, 90, 90, CONTENT_WIDTH - 430],
      {
        fontSize: 7,
        minRowHeight: 38,
      }
    );

    drawFooterNote(
      doc,
      "Leave information is blank where it was not available in the source data."
    );

    // =========================================================
    // PAGE 4: SALARY CALCULATION (LANDSCAPE)
    // =========================================================

    doc.addPage({
      size: "A4",
      layout: "landscape",
      margins: {
        top: MARGIN,
        bottom: MARGIN,
        left: MARGIN,
        right: MARGIN,
      },
    });

    drawMainHeading(doc, "SALARY CALCULATION");

    const salaryHeaders = [
      "Sr. No.",
      "Designation",
      "Resource Name",
      "Resource CTC",
      "Month",
      "Available Leave Balance",
      "Month Days",
      "MPR Leaves",
      "Leave Deduction Leave in Month",
      "Leave Balance After Leave Adjustment",
      "Pay Days",
      "TDS",
      "P.T. Tax",
      "PF",
      "Other Deductions",
      "Net Pay",
      "Total Salary Released Incl",
      "UTR Amount",
    ];

    const salaryRows =
      Array.isArray(data.resourceDetails) &&
      data.resourceDetails.length
        ? data.resourceDetails.map((item, index) => [
            index + 1,
            [
              textValue(item.designation),
              item.experience != null
                ? `(${textValue(item.experience)} years Experience)`
                : "",
            ]
              .filter(Boolean)
              .join(" "),
            textValue(item.employee_name ?? item.resource_name),
            money(item.resource_ctc),
            monthYear(data.month, data.year),
            "",
            textValue(item.month_days ?? item.current_month_days),
            textValue(item.mpr_leaves ?? item.leaves_per_month),
            "",
            "",
            textValue(item.pay_days),
            money(item.tds),
            money(item.pt_tax),
            money(item.pf),
            money(item.other_deductions),
            money(item.net_pay),
            money(item.total_salary_released_incl),
            money(item.utr_amount),
          ])
        : [];

    const salaryBaseWidths = [
      25, 75, 65, 58, 43, 52, 38, 38, 58,
      58, 38, 35, 40, 35, 48, 48, 65, 55,
    ];

    const salaryBaseTotal = salaryBaseWidths.reduce(
      (sum, width) => sum + width,
      0
    );

    const salaryAvailableWidth = doc.page.width - MARGIN * 2;

    const salaryColumnWidths = salaryBaseWidths.map(
      (width) => (width / salaryBaseTotal) * salaryAvailableWidth
    );

    drawTable(
      doc,
      [salaryHeaders, ...salaryRows],
      salaryColumnWidths,
      {
        fontSize: 6,
        minRowHeight: 38,
        paddingX: 2,
        paddingY: 3,
        header: false,
      }
    );

    drawFooterNote(
      doc,
      "Salary and deduction details are intentionally blank unless supplied by the backend."
    );

    // =========================================================
    // PAGE 5: TAX INVOICE (PORTRAIT)
    // =========================================================

    doc.addPage({
      size: "A4",
      layout: "portrait",
      margins: {
        top: 23,
        bottom: 23,
        left: 23,
        right: 23,
      },
    });

    const IX = 23;
    const IW = doc.page.width - IX * 2;
    const BORDER = 0.6;

    let iy = 42;

    const val = (v) =>
      v === null || v === undefined ? "" : String(v);

    const amt = (v) => {
      if (v === null || v === undefined || v === "") return "";

      const n = Number(v);

      return Number.isFinite(n)
        ? n.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        : "";
    };

    const cell = (x, y, w, h, value = "", opts = {}) => {
      doc.save();
      doc.lineWidth(BORDER).strokeColor("#000000");
      doc.rect(x, y, w, h).stroke();
      doc.restore();

      if (value !== "") {
        doc
          .font(opts.bold ? "Helvetica-Bold" : "Helvetica")
          .fontSize(opts.size || 7)
          .fillColor("#000000")
          .text(val(value), x + 4, y + (opts.top ?? 3), {
            width: w - 8,
            height: h - (opts.top ?? 3) - 2,
            align: opts.align || "left",
            lineGap: 0,
            ellipsis: true,
          });
      }
    };

    const centered = (value, x, y, w, size = 8) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(size)
        .fillColor("#000000")
        .text(value, x, y, {
          width: w,
          align: "center",
        });
    };

    // Tax Invoice heading
    centered("Tax Invoice", IX, iy, IW, 12);
    iy += 27;

    // Seller + Invoice details
    const leftW = IW * 0.535;
    const rightW = IW - leftW;
    const splitX = IX + leftW;
    const labelW = rightW * 0.53;
    const valueX = splitX + labelW;
    const valueW = rightW - labelW;

    const metadata = [
      ["Invoice No.", data.invoice_no, "Dated", data.invoice_date],
      [
        "Delivery Note",
        data.delivery_note,
        "Mode/Terms of Payment",
        data.payment_terms || "30 Days",
      ],
      [
        "Reference No. & Date",
        data.reference_no_date,
        "Project No.",
        data.project_no,
      ],
      [
        "Buyer's Order No.",
        data.work_order_no,
        "Dated",
        data.wo_date,
      ],
      [
        "Dispatch Doc No.",
        data.dispatch_doc_no,
        "Delivery Note Date",
        data.delivery_note_date,
      ],
      [
        "Dispatched through",
        data.dispatched_through,
        "Destination",
        data.destination,
      ],
    ];

    const metaRowH = 27;
    const sellerH = metadata.length * metaRowH;

    // Vendor details
    cell(IX, iy, leftW, sellerH);

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(val(data.vendor_name), IX + 5, iy + 5, {
        width: leftW - 10,
      });

    const vendorLines = [
      val(data.vendor_address),
      data.vendor_state
        ? `State Name: ${val(data.vendor_state)}, Code: ${val(data.vendor_state_code)}`
        : "",
      data.vendor_email ? `Email: ${val(data.vendor_email)}` : "",
    ].filter(Boolean);

    doc
      .font("Helvetica")
      .fontSize(7)
      .text(vendorLines.join("\n"), IX + 5, iy + 19, {
        width: leftW - 10,
        lineGap: 1,
      });

    metadata.forEach((r, i) => {
      const y = iy + i * metaRowH;

      cell(splitX, y, labelW, metaRowH);
      cell(valueX, y, valueW, metaRowH);

      doc
        .font("Helvetica")
        .fontSize(6.5)
        .text(val(r[0]), splitX + 4, y + 3, {
          width: labelW - 8,
          height: 8,
          ellipsis: true,
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .text(val(r[1]), splitX + 4, y + 13, {
          width: labelW - 8,
          height: 11,
          ellipsis: true,
        });

      doc
        .font("Helvetica")
        .fontSize(6.5)
        .text(val(r[2]), valueX + 4, y + 3, {
          width: valueW - 8,
          height: 8,
          ellipsis: true,
        });

      doc
        .font("Helvetica-Bold")
        .fontSize(7)
        .text(val(r[3]), valueX + 4, y + 13, {
          width: valueW - 8,
          height: 11,
          ellipsis: true,
        });
    });

    iy += sellerH;

    // Buyer + Project Name
    const buyerH = 100;
    const projectLabelH = 23;

    cell(IX, iy, leftW, buyerH);
    cell(splitX, iy, rightW, buyerH);

    doc
      .font("Helvetica-Bold")
      .fontSize(7.5)
      .text("Buyer (Bill to)", IX + 5, iy + 4);

    const buyerLines = [
      val(data.buyer_company_name),
      val(data.buyer_address),
      data.buyer_gstin
        ? `GSTIN/UIN: ${val(data.buyer_gstin)}`
        : "",
      data.buyer_pan
        ? `PAN/IT No.: ${val(data.buyer_pan)}`
        : "",
      data.buyer_state
        ? `State Name: ${val(data.buyer_state)}, Code: ${val(data.buyer_state_code)}`
        : "",
    ].filter(Boolean);

    doc
      .font("Helvetica")
      .fontSize(7)
      .text(buyerLines.join("\n"), IX + 5, iy + 16, {
        width: leftW - 10,
        lineGap: 1,
      });

    doc
      .font("Helvetica")
      .fontSize(7)
      .text("Project Name: -", splitX + 5, iy + 4, {
        width: rightW - 10,
      });

    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .text(val(data.project_name), splitX + 5, iy + projectLabelH, {
        width: rightW - 10,
        height: buyerH - projectLabelH - 5,
      });

    iy += buyerH;

    // Description of services table
    const descWidths = [
      IW * 0.535,
      IW * 0.20,
      IW * 0.105,
      IW * 0.16,
    ];

    const descHeaders = [
      "Description of Services",
      "HSN/SAC",
      "GST Rate",
      "Amount",
    ];

    let x = IX;

    descHeaders.forEach((label, i) => {
      cell(x, iy, descWidths[i], 20, label, {
        bold: true,
        size: 7,
        align: "center",
      });

      x += descWidths[i];
    });

    iy += 20;

    const description = val(data.description_of_services);

    x = IX;

    [
      description,
      val(data.hsn_sac),
      data.gst_rate !== null &&
      data.gst_rate !== undefined &&
      data.gst_rate !== ""
        ? `${val(data.gst_rate)}%`
        : "",
      amt(data.billing_amount),
    ].forEach((value, i) => {
      cell(x, iy, descWidths[i], 32, value, {
        size: 7,
        align: i === 0 ? "left" : i === 3 ? "right" : "center",
      });

      x += descWidths[i];
    });

    iy += 32;

    // IGST on sales
    cell(IX, iy, IW - descWidths[3], 18, "IGST on Sales", {
      size: 7,
    });

    cell(
      IX + IW - descWidths[3],
      iy,
      descWidths[3],
      18,
      amt(data.igst_amount),
      {
        size: 7,
        align: "right",
      }
    );

    iy += 18;

    // Total
    cell(IX, iy, IW - descWidths[3], 19, "Total", {
      bold: true,
      align: "right",
    });

    cell(
      IX + IW - descWidths[3],
      iy,
      descWidths[3],
      19,
      `₹ ${amt(data.total_amount)}`,
      {
        bold: true,
        align: "right",
      }
    );

    iy += 19;

    // Amount in words
    const wordsLabel = "Amount Chargeable (in words):";
    const wordsValue = val(data.amount_in_words);

    cell(IX, iy, IW, 29, wordsLabel, {
      size: 7,
    });

    doc.font("Helvetica").fontSize(7);

    const labelWidth = doc.widthOfString(wordsLabel);

    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .text(wordsValue, IX + labelWidth + 4, iy + 3, {
        width: IW - labelWidth - 4,
        lineBreak: false,
        ellipsis: true,
      });

    doc
      .font("Helvetica-Oblique")
      .fontSize(7)
      .text("E. & O.E", IX + IW - 65, iy + 4, {
        width: 58,
        align: "right",
      });

    iy += 29;

    // Tax summary
    const tw = [
      IW * 0.32,
      IW * 0.19,
      IW * 0.075,
      IW * 0.12,
      IW * 0.12,
      IW * 0.175,
    ];

    cell(IX, iy, tw[0], 30, "HSN/SAC", {
      bold: true,
      align: "center",
    });

    cell(IX + tw[0], iy, tw[1], 30, "Taxable Value", {
      bold: true,
      align: "center",
    });

    const igstX = IX + tw[0] + tw[1];

    cell(igstX, iy, tw[2] + tw[3], 15, "IGST", {
      bold: true,
      align: "center",
    });

    cell(igstX, iy + 15, tw[2], 15, "Rate", {
      align: "center",
    });

    cell(igstX + tw[2], iy + 15, tw[3], 15, "Amount", {
      align: "center",
    });

    cell(
      igstX + tw[2] + tw[3],
      iy,
      tw[4] + tw[5],
      30,
      "Total Tax Amount",
      {
        bold: true,
        align: "center",
      }
    );

    iy += 30;

    const taxTotal = Number(data.total_tax_amount || 0);

    const igstRate =
      data.gst_rate !== null &&
      data.gst_rate !== undefined &&
      data.gst_rate !== ""
        ? `${String(data.gst_rate).replace(/%/g, "")}%`
        : "";

    const taxRows = [
      [
        val(data.hsn_sac),
        amt(data.taxable_value),
        igstRate,
        amt(data.igst_amount),
        amt(taxTotal),
      ],
      [
        "Total",
        amt(data.taxable_value),
        "",
        amt(data.igst_amount),
        amt(taxTotal),
      ],
    ];

    taxRows.forEach((row) => {
      const widths = [
        tw[0],
        tw[1],
        tw[2],
        tw[3],
        tw[4] + tw[5],
      ];

      let cx = IX;

      row.forEach((value, i) => {
        cell(cx, iy, widths[i], 16, value, {
          size: 7,
          bold: row[0] === "Total",
          align: i === 0 ? "left" : "right",
        });

        cx += widths[i];
      });

      iy += 16;
    });

    // Bank details
    const bankH = 65;
    const bankLeftW = IW * 0.44;
    const bankRightX = IX + bankLeftW;
    const bankRightW = IW - bankLeftW;

    cell(IX, iy, bankLeftW, bankH);

    doc.save();
    doc.lineWidth(BORDER).strokeColor("#000000");
    doc.rect(bankRightX, iy, bankRightW, bankH).stroke();
    doc.restore();

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor("#000000")
      .text(
        "Company's Bank Details",
        bankRightX + 5,
        iy + 4,
        {
          width: bankRightW - 10,
        }
      );

    const bankDetails = [
      ["A/c Holder's Name", val(data.vendor_name)],
      ["Bank Name", val(data.bank_name)],
      ["A/c No.", val(data.account_number)],
      [
        "Branch & IFSC Code",
        [data.branch_name, data.ifsc_code]
          .filter(
            (value) =>
              value !== null &&
              value !== undefined &&
              String(value).trim() !== ""
          )
          .join(", "),
      ],
    ];

    doc.font("Helvetica").fontSize(7);

    bankDetails.forEach(([label, value], index) => {
      doc.text(
        `${label} : ${value}`,
        bankRightX + 5,
        iy + 19 + index * 10,
        {
          width: bankRightW - 10,
          height: 10,
          lineBreak: false,
          ellipsis: true,
        }
      );
    });

    iy += bankH;

    // Company PAN + Declaration + Signature
    const panW = IW * 0.44;
    const bottomH = 65;

    cell(
      IX,
      iy,
      panW,
      17,
      `Company's PAN : ${val(data.vendor_pan)}`,
      { size: 7 }
    );

    cell(
      IX,
      iy + 17,
      panW,
      bottomH - 17,
      `Declaration:\n${val(
        data.declaration ||
          "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct."
      )}`,
      { size: 7 }
    );

    cell(IX + panW, iy, IW - panW, bottomH);

    doc
      .font("Helvetica-Bold")
      .fontSize(7)
      .text(
        `for ${val(data.vendor_name)}`,
        IX + panW + 5,
        iy + 4,
        {
          width: IW - panW - 10,
          align: "right",
        }
      );

    doc
      .font("Helvetica")
      .fontSize(7)
      .text(
        "Authorized Signatory",
        IX + panW + 5,
        iy + bottomH - 12,
        {
          width: IW - panW - 10,
          align: "right",
        }
      );

    iy += bottomH + 5;
    iy += 22;

    doc
      .font("Helvetica")
      .fontSize(8)
      .text(
        "This is a Computer-Generated Invoice",
        IX,
        iy,
        {
          width: IW,
          align: "center",
        }
      );

    // =========================================================
    // PAGE NUMBERS
    // Use each page's own dimensions to avoid overflow.
    // =========================================================

    const range = doc.bufferedPageRange();

    for (let i = 0; i < range.count; i += 1) {
      doc.switchToPage(i);

      const originalBottomMargin = doc.page.margins.bottom;

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;
      const contentWidth = pageWidth - MARGIN * 2;

      doc.page.margins.bottom = 5;

      doc
        .font("Helvetica")
        .fontSize(7)
        .fillColor("#555555")
        .text(
          `Page ${i + 1} of ${range.count}`,
          MARGIN,
          pageHeight - 16,
          {
            width: contentWidth,
            height: 10,
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