const catchAsync = require("../../../utils/catchAsync");
const service = require("./employeeWOMpr.service");
const sequelize = require("../../../utils/database");
const AppError = require("../../../utils/appError");
const EmployeeMprUtils = require("../../../utils/employeeMprUtils");
const path = require("path");
const fs = require("fs");

const generateMprPdf = require("../../../utils/generateMprPdf");

const getEmployeeWOMpr = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { employeeIds, month, year, mpr_generated } = req.query;

    const { Op } = require("sequelize");

    let where = { wo_id: id };

    if (employeeIds) {
        where.employee_id = {
            [Op.in]: employeeIds.split(",").map(Number),
        };
    }

    if (month) where.month = month;
    if (year) where.year = year;

    if (mpr_generated !== undefined) {
        where.mpr_generated = mpr_generated === "true";
    }


    const result = await service.getEmployeeWOMpr({ where });

    res.status(200).json({
        status: "success",
        results: result.length,
        data: result,
    });
});
const uploadEmployeeWOMpr = catchAsync(async (req, res, next) => {
    const { id: wo_id } = req.params;

    let { employee_ids, month, year, created_by } = req.body;

    // Handle FormData cases (employee_ids[] OR string OR single value)
    if (!employee_ids) {
        employee_ids = req.body["employee_ids[]"];
    }

    if (!employee_ids) {
        return res.status(400).json({
            status: "fail",
            message: "employee_ids are required",
        });
    }

    // Convert to array
    if (!Array.isArray(employee_ids)) {
        // Handle comma-separated string
        if (typeof employee_ids === "string" && employee_ids.includes(",")) {
            employee_ids = employee_ids.split(",");
        } else {
            employee_ids = [employee_ids];
        }
    }

    // Convert to numbers
    employee_ids = employee_ids.map(id => Number(id)).filter(Boolean);

    if (employee_ids.length === 0) {
        return res.status(400).json({
            status: "fail",
            message: "Valid employee_ids are required",
        });
    }

    // 📁 File validation
    if (!req.file) {
        return next(new AppError("File is required", 400));
    }

    if (req.file.mimetype !== "application/pdf") {
        return next(new AppError("Only PDF files are allowed", 400));
    }

    if (!month || !year) {
        return res.status(400).json({
            status: "fail",
            message: "month and year are required",
        });
    }

    // 📁 File details
    const fileName = req.file.filename;
    const filePath = `/uploads/mpr/${wo_id}/${req.file.filename}`;

    const result = await sequelize.transaction(async (t) => {

        // 🔹 Step 1: Validate employees under this WO
        const employees = await service.getEmployeesByIds( employee_ids,
            wo_id,
            month,
            year);

        if (!employees || employees.length === 0) {
            throw new AppError("No valid employees found for this Work Order", 404);
        }

        const validEmployeeIds = employees.map(emp => emp.id);

        // 🔹 Step 2: Check existing records (single query)
        const existingRecords = await service.getEmployeeWOMpr({
            where: {
                employee_id: validEmployeeIds,
                wo_id,
                month,
                year,
            },
            transaction: t
        });

        const existingIds = new Set(existingRecords.map(r => r.employee_id));

        // 🔹 Step 3: Create entries for each employee
        const createdRecords = [];

        for (const emp of employees) {
            if (existingIds.has(emp.id)) {
                continue; // skip duplicates
            }

            const record = await service.createEmployeeWOMpr(
                {
                    employee_id: emp.id,
                    wo_id,
                    mpr_file_name: fileName,
                    mpr_file_path: filePath,
                    mpr_generated: false,
                    month,
                    year,
                    created_by
                },
                t
            );

            createdRecords.push(record);
        }

        return createdRecords;
    });

    res.status(201).json({
        status: "success",
        message: "MPR uploaded and mapped successfully",
        total_requested: employee_ids.length,
        created_count: result.length,
        skipped_duplicates: employee_ids.length - result.length,
        data: result,
    });
});

const deleteEmployeeWOMpr = catchAsync(async (req, res) => {
    const { id, mprId } = req.params;

    await sequelize.transaction(async (t) => {
        const deleted = await service.deleteEmployeeWOMpr(mprId, id, t);

        if (!deleted) {
            throw new Error("Record not found or already deleted");
        }
    });

    res.status(200).json({
        status: "success",
        message: "MPR deleted successfully",
    });
});

const createEmployeeWOMpr = catchAsync(async (req, res) => {
    const { id: wo_id } = req.params;
    const { employee_ids, month, year, created_by } = req.body;

    if (!employee_ids || !Array.isArray(employee_ids) || employee_ids.length === 0) {
        return res.status(400).json({
            status: "fail",
            message: "employee_ids must be a non-empty array",
        });
    }

    if (!month || !year) {
        return res.status(400).json({
            status: "fail",
            message: "month and year are required",
        });
    }

    // SAFE FORMATTER
    const formatDate = (d) => {
        if (!d || !(d instanceof Date) || isNaN(d.getTime())) return "-";

        const dd = String(d.getDate()).padStart(2, "0");
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const yyyy = d.getFullYear();

        return `${dd}-${mm}-${yyyy}`;
    };
       const m = Number(month);
       const y = Number(year);

       console.log({ month, year, m, y });
        const monthStart = new Date(y, m - 1, 1);
        const monthEnd = new Date(y, m, 0);
        const result = await sequelize.transaction(async (t) => {

        //  STEP 1: Fetch employees
        const employees = await service.getEmployeesByIds(
            employee_ids,
            wo_id,
            month,
            year
        );
        if (!employees || employees.length === 0) {
            throw new Error("No valid employees found");
        }

        // ✅ STEP 2: FORMAT DATA
        const formattedEmployees = employees
            .map((emp, index) => {

                const fullName = [
                    emp.first_name,
                    emp.middle_name,
                    emp.last_name
                ].filter(Boolean).join(" ");


const deployment = emp.employeeWorkOrderDeployment?.[0] || {};

const designation = EmployeeMprUtils.getDesignation(emp);
           

                const joining = emp.employeeWorkOrderDeployment.joining_date;
                const relieving = deployment?.relieving_date;

              
                const jDate = joining ? new Date(joining) : null;
                const rDate = relieving ? new Date(relieving) : null;

                let fromDate = monthStart;
                let toDate = monthEnd;


                // ✅ joining logic
                if (jDate && !isNaN(jDate.getTime())) {
                    if (jDate > monthStart) {
                        fromDate = jDate;
                    }
                }

                // ✅ relieving logic
                if (rDate && !isNaN(rDate.getTime())) {
                    if (rDate < monthEnd) {
                        toDate = rDate;
                    }
                }


                return {
                    sr: index + 1,
                    category: designation,
                    name: fullName,
                    doj: formatDate(jDate),
                    from: formatDate(fromDate),
                    to: formatDate(toDate),
                    leave: emp.employeeWorkOrderLeaves?.[0]?.leave_taken || 0,
                    performance: true
                };
            })
            .filter(Boolean);

        if (formattedEmployees.length === 0) {
            throw new Error("No valid employee data to generate MPR");
        }

        // ✅ STEP 3: GENERATE PDF
        const { fileName, filePath } = await generateMprPdf(
            formattedEmployees,
            { month, year, wo_id }
        );

        // ✅ STEP 4: SAVE RECORDS
        const createdRecords = await Promise.all(
            employees.map(async (emp) => {

                const existing = await service.getEmployeeWOMpr({
                    where: {
                        employee_id: emp.id,
                        month,
                        year,
                        wo_id,
                    },
                    transaction: t
                });

                if (existing.length > 0) return null;

                return await service.createEmployeeWOMpr(
                    {
                        employee_id: emp.id,
                        wo_id,
                        month,
                        year,
                        mpr_generated: true,
                        mpr_file_name: fileName,
                        mpr_file_path: filePath,
                        created_by,
                    },
                    t
                );
            })
        );

        return createdRecords.filter(Boolean);
    });

    res.status(201).json({
        status: "success",
        message: "MPR generated and mapped to employees",
        count: result.length,
        data: result,
    });
});
const downloadEmployeeWOMpr = catchAsync(async (req, res) => {
    const { id: wo_id, mprId } = req.params;

    const mpr = await service.getEmployeeWOMpr({
        where: {
            id: mprId,
            wo_id
        }
    });

    if (!mpr.length) {
        return res.status(404).json({
            status: "fail",
            message: "MPR record not found"
        });
    }

    const record = mpr[0];

    if (!record.mpr_file_path) {
        return res.status(404).json({
            status: "fail",
            message: "No document found"
        });
    }

    const filePath = path.join(
        process.cwd(),
        record.mpr_file_path.replace(/^\/+/, "")
    );

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            status: "fail",
            message: "File not found"
        });
    }

    return res.download(filePath, record.mpr_file_name);
});

module.exports = {
    getEmployeeWOMpr,
    createEmployeeWOMpr,
    deleteEmployeeWOMpr,
    uploadEmployeeWOMpr,
    downloadEmployeeWOMpr
    
    
};