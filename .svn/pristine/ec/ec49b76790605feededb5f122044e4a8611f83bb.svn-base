const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateMprPdf = (employees = [], { month, year, wo_id }) => {
    return new Promise((resolve, reject) => {
        try {
            if (!employees.length) {
                throw new Error("No employees provided");
            }

            const fileName = `MPR_WO_${wo_id}_${month}_${year}_${Date.now()}.pdf`;
            const uploadDir = path.join(__dirname, "../uploads/mpr", String(wo_id));
            const filePath = path.join(uploadDir, fileName);

            fs.mkdirSync(uploadDir, { recursive: true });

            const doc = new PDFDocument({
                size: "A4",
                layout: "landscape",
                margin: 40
            });
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            // =========================
            // 🔷 HEADER
            // =========================
            doc
                .fontSize(16)
                .font("Helvetica-Bold")
                .text("MONTHLY PERFORMANCE REPORT (MPR)", { align: "center" });

            doc.moveDown(1);

            doc.fontSize(10).font("Helvetica");

            const dateStr = `Date: ${new Date().toLocaleDateString()}`;
            const usableWidth = doc.page.width - 80; // account for left/right margins (40 each)

            doc.text(dateStr, 40, doc.y, { width: usableWidth, align: "right" });
            doc.text(`MPR for Month: ${month}    Year: ${year}`);
            doc.text(`Work Order No: ${wo_id}`);

            doc.moveDown(1);

            // =========================
            // 🔷 ORGANIZATION DETAILS
            // =========================
            doc
                .font("Helvetica-Bold")
                .text("Project Details:");

            doc
                .font("Helvetica")
                .text("Project No: XXXXX")
                .text("Project Name: XXXXX")
                .text("Department: XXXXX")
                .text("Location: XXXXX");

            doc.moveDown(1);

            // =========================
            // 🔷 DESCRIPTION
            // =========================
            doc.text(
                "Reference to the above mentioned work order, the attendance and performance of the manpower deployed is as under:"
            );

            doc.moveDown(1);

            // =========================
            // 🔷 TABLE HEADER
            // =========================
            const headerY = doc.y;

            const col = {
                sr: 40,
                category: 80,
                name: 220,
                doj: 400,
                period: 480,
                leave: 600,
                performance: 680,
            };

            const headerHeight = 30;

            doc.font("Helvetica-Bold").fontSize(9);

            doc.text("S.No", col.sr, headerY, { width: 30 });
            doc.text("Resource Category & Profile", col.category, headerY, { width: 90 });
            doc.text("Name of the Resource", col.name, headerY, { width: 120 });
            doc.text("Joining Date", col.doj, headerY, { width: 50 });
            doc.text("MPR Working Period", col.period, headerY, { width: 80 });
            doc.text("Leave Taken", col.leave, headerY, { width: 40 });
            doc.text("Satisfactory Performance", col.performance, headerY, { width: 60 });

            doc.moveTo(40, headerY + headerHeight)
                .lineTo(750, headerY + headerHeight)
                .stroke();
            let y = headerY + headerHeight + 5;

            // =========================
            // 🔁 EMPLOYEE ROWS
            // =========================
            employees.forEach((emp, i) => {

                // Calculate dynamic height
                const categoryHeight = doc.heightOfString(emp.category || "-", { width: 90 });
                const nameHeight = doc.heightOfString(emp.name || "-", { width: 120 });

                const rowHeight = Math.max(categoryHeight, nameHeight, 20);

                // Page break
                if (y + rowHeight > doc.page.height - 100) {
                    doc.addPage();
                    y = 50;
                }

                doc.fontSize(9);

                doc.text(i + 1, col.sr, y, { width: 30 });
                doc.text(emp.category || "-", col.category, y, { width: 90 });
                doc.text(emp.name || "-", col.name, y, { width: 120 });
                doc.text(emp.doj || "-", col.doj, y, { width: 50 });
                doc.text(`${emp.from || "-"} to ${emp.to || "-"}`, col.period, y, { width: 80 });
                doc.text(emp.leave || "-", col.leave, y, { width: 40 });
                doc.text(emp.performance ? "Yes" : "No", col.performance, y, { width: 60 });

                y += rowHeight + 5;
            });

            doc.moveDown(2);

            doc.moveTo(40, y)
                .lineTo(750, y)
                .stroke();
            // =========================
            // 🔷 FOOTER NOTES
            // =========================
            y += 20;

            doc.text("* Leaves are adjusted as per policy.", 40, y, {
                width: 500
            });

            y += 15;

            doc.text("* This report is generated for billing purpose.", 40, y, {
                width: 500
            });

            doc.moveDown(2);
            // =========================
            // 🔷 SIGNATURE SECTION
            // =========================

            y += 30;

            doc.text("Signature with seal/stamp:", 40, y);
            y += 20;

            doc.text("Name of Authorized Person: ____________", 40, y);
            y += 20;

            doc.text("Designation: ____________", 40, y);

            doc.text("Authorized Signatory", 650, y + 20);

            // =========================
            // 🔷 FINALIZE
            // =========================
            doc.end();

            stream.on("finish", () => {
                resolve({
                    fileName,
                    filePath: `/uploads/mpr/${wo_id}/${fileName}`,
                });
            });

            stream.on("error", reject);

        } catch (err) {
            reject(err);
        }
    });
};

module.exports = generateMprPdf;