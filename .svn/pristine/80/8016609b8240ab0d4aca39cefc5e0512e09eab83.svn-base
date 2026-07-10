const sequelize = require("../../../utils/database");
const { Employee, DesignationMaster, EmployeeDesignation } = require("../../../models");
const catchAsync = require("../../../utils/catchAsync");
const APIFeatures = require("../../../utils/apiFeature");
const AppError = require("../../../utils/appError");

exports.assignDesignation = catchAsync(async (req, res, next) => {
    const { employeeId } = req.params;
    const { designation_id, effective_from } = req.body;

    if (!effective_from) {
        throw new AppError("effective_from is required", 400);
    }

    await sequelize.transaction(async (t) => {

        const employee = await Employee.findByPk(employeeId, { transaction: t });
        if (!employee) throw new AppError("Employee not found", 404);

        const designation = await DesignationMaster.findByPk(designation_id, { transaction: t });
        if (!designation) throw new AppError("Designation not found", 404);

        // Org validation (VERY IMPORTANT)
        if (employee.organization_id !== designation.organization_id) {
            throw new AppError("Cross organization assignment not allowed", 400);
        }

        // Close previous current designation
        await EmployeeDesignation.update(
            {
                is_current: false,
                effective_to: new Date()
            },
            {
                where: {
                    employee_id: employeeId,
                    is_current: true
                },
                transaction: t
            }
        );

        // Create new record
        await EmployeeDesignation.create(
            {
                employee_id: employeeId,
                designation_id,
                effective_from,
                is_current: true
            },
            { transaction: t }
        );
    });

    res.status(201).json({
        status: "success",
        message: "Designation assigned successfully"
    });
});

exports.getEmployeeDesignations = catchAsync(async (req, res) => {
    const { employeeId } = req.params;

    const employee = await Employee.findByPk(employeeId);

    if (!employee) {
        throw new AppError("Employee not found", 404);
    }

    const records = await EmployeeDesignation.findAll({
        where: { employee_id: employeeId },
        include: [
            {
                model: DesignationMaster,
                as: "designation"
            }
        ],
        order: [["effective_from", "DESC"]]
    });

    res.status(200).json({
        status: "success",
        message: "Get Employee Designation",
        data: records
    });
});

exports.updateEmployeeDesignation = catchAsync(async (req, res) => {

    const { employeeId, id } = req.params;
    const { effective_from, effective_to, is_current } = req.body;

    await sequelize.transaction(async (t) => {

        const record = await EmployeeDesignation.findOne({
            where: { id, employee_id: employeeId },
            transaction: t
        });

        if (!record) {
            throw new AppError("Designation record not found", 404);
        }

        if (is_current === true) {

            await EmployeeDesignation.update(
                {
                    is_current: false,
                    effective_to: new Date()
                },
                {
                    where: {
                        employee_id: employeeId,
                        is_current: true
                    },
                    transaction: t
                }
            );

        }

        await record.update(
            {
                effective_from: effective_from ?? record.effective_from,
                effective_to: effective_to ?? record.effective_to,
                is_current: is_current ?? record.is_current
            },
            { transaction: t }
        );

    });

    res.status(200).json({
        status: "success",
        message: "Employee Designation updated successfully"
    });

});

