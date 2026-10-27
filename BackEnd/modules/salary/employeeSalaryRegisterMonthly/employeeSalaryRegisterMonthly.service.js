const { Op } = require("sequelize");
const {
  EmployeeSalaryRegister,
  EmpSalaryStructure,
  SalaryStructureComponent,
  SalaryComponent,
  EmployeeSalaryRegisterSnapshot,
  Employee,
  EmployeeWorkOrderLeave,
  EmployeeSalaryAddon,
  SalaryAddonMaster,
  EmployeeWorkOrderDeployment,
  WoDesgnMapping,
} = require("../../../models");

const AppError = require("../../../utils/appError");
const SalarySlipPdf = require("../../../utils/salarySlipPdf");

// helper method
const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

const getDateOnlyUTC = (date) => {
  const d = new Date(date);

  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

exports.generateMonthlySalary = async (data) => {
  const { employee_id, month, year } = data;

  const requestedDate = new Date(Date.UTC(year, month - 1, 1));
  const totalDays = getDaysInMonth(month, year);

  const monthStart = Date.UTC(year, month - 1, 1);
  const monthEnd = Date.UTC(year, month, 0);

  const DAY_MS = 24 * 60 * 60 * 1000;

  // Normalize a date to UTC midnight.
  const toTimestamp = (value) => {
    if (!value) return null;

    const date = new Date(value);

    return Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
    );
  };

  const formatDate = (timestamp) =>
    new Date(timestamp).toISOString().slice(0, 10);

  const employeeName = (employee) =>
    [employee?.first_name, employee?.middle_name, employee?.last_name]
      .filter(Boolean)
      .join(" ");

  /*
   * 1. Check existing salary register.
   */
  const existing = await EmployeeSalaryRegister.findOne({
    where: {
      employee_id,
      month,
      year,
      is_deleted: false,
    },
  });

  if (existing) {
    const employee = await Employee.findOne({
      where: {
        id: employee_id,
        is_deleted: false,
      },
      attributes: ["first_name", "middle_name", "last_name"],
    });

    const snapshots = await EmployeeSalaryRegisterSnapshot.findAll({
      where: {
        employee_salary_register_id: existing.id,
        is_deleted: false,
      },
      order: [["id", "ASC"]],
    });

    const employeeAddons = await EmployeeSalaryAddon.findAll({
      where: {
        employee_id,
        is_deleted: false,
        is_active: true,
        effective_from: { [Op.lte]: requestedDate },
        [Op.or]: [
          { effective_to: { [Op.gte]: requestedDate } },
          { effective_to: null },
        ],
      },
      include: [
        {
          model: SalaryAddonMaster,
          as: "salaryAddonMaster",
        },
      ],
    });

    return {
      register_id: existing.id,
      is_existing: true,
      employee_id: existing.employee_id,
      employee_name: employeeName(employee),
      month: existing.month,
      year: existing.year,

      gross_earnings: Number(existing.gross_earnings || 0),
      total_deductions: Number(existing.total_deductions || 0),
      net_salary: Number(existing.net_salary || 0),
      leave_deduction: Number(existing.leave_deduction || 0),

      status: existing.status,
      transaction_number: existing.transaction_number,
      salaryslip_generated: existing.mon_salaryslip_generated || false,
      salaryslip_filename: existing.mon_salaryslip_filename || null,

      components: snapshots.map((item) => ({
        component_id: item.salary_component_id,
        name: item.component_name,
        type: item.component_type,
        amount: Number(item.final_amount || 0),
      })),

      addons: employeeAddons.map((addon) => ({
        addon_id: addon.id,
        salary_addon_master_id: addon.salaryAddonMaster?.id,
        name: addon.salaryAddonMaster?.name,
        code: addon.salaryAddonMaster?.code,
        type: addon.salaryAddonMaster?.addon_type,
        amount: Number(addon.amount || 0),
        recurrence_type: addon.recurrence_type,
      })),
    };
  }

  /*
   * 2. Fetch and validate employee.
   */
  const employee = await Employee.findOne({
    where: {
      id: employee_id,
      is_deleted: false,
    },
    attributes: ["id", "first_name", "middle_name", "last_name"],
  });

  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  const employee_name = employeeName(employee);

  /*
   * 3. Fetch all deployments that started on or before month-end.
   *
   * IMPORTANT:
   * relieving_date is deliberately NOT used.
   * A deployment ends the day before the next deployment starts.
   */
  const deployments = await EmployeeWorkOrderDeployment.findAll({
    where: {
      employee_id,
      is_deleted: false,
      [Op.or]: [
        {
          relieving_date: {
            [Op.gte]: new Date(monthStart),
          },
        },
        {
          relieving_date: null,
        },
      ],
    },
    order: [["joining_date", "ASC"]],
  });

  if (!deployments.length) {
    throw new AppError(
      "Employee work order deployment not found for salary month",
      404,
    );
  }

  const deploymentMappingIds = [
    ...new Set(
      deployments
        .map((deployment) => deployment.wo_desgn_id)
        .filter((id) => id != null),
    ),
  ];

  const deploymentMappings = await WoDesgnMapping.findAll({
    where: {
      id: { [Op.in]: deploymentMappingIds },
    },
    attributes: ["id", "work_order_id"],
  });

  const workOrderByDeploymentMappingId = new Map(
    deploymentMappings.map((mapping) => [
      String(mapping.id),
      mapping.work_order_id,
    ]),
  );

  /*
   * Build deployment periods for the selected month.
   *
   * Example:
   * WO-1: 01-Oct to 12-Oct
   * WO-2: 13-Oct to 31-Oct
   */
  const deploymentPeriods = [];

  for (let i = 0; i < deployments.length; i++) {
    const deployment = deployments[i];

    const joiningTimestamp = toTimestamp(deployment.joining_date);

    const relievingTimestamp = deployment.relieving_date
      ? toTimestamp(deployment.relieving_date)
      : null;

    const nextDeployment = deployments[i + 1];

    const nextJoiningTimestamp = nextDeployment
      ? toTimestamp(nextDeployment.joining_date)
      : null;

    let deploymentEnd;

    if (relievingTimestamp !== null) {
      deploymentEnd = relievingTimestamp;
    } else if (nextJoiningTimestamp !== null) {
      deploymentEnd = nextJoiningTimestamp - DAY_MS;
    } else {
      deploymentEnd = monthEnd;
    }

    const periodStart = Math.max(joiningTimestamp, monthStart);
    const periodEnd = Math.min(deploymentEnd, monthEnd);

    // Ignore deployments that do not overlap the selected month.
    if (periodStart > periodEnd) continue;

    const workOrderId = workOrderByDeploymentMappingId.get(
      String(deployment.wo_desgn_id),
    );

    if (workOrderId == null) {
      throw new AppError(
        `Work order mapping not found for deployment ${deployment.id}`,
        404,
      );
    }

    deploymentPeriods.push({
      deployment_id: deployment.id,
      work_order_id: workOrderId,
      deployment,
      start: periodStart,
      end: periodEnd,
      payable_days: Math.floor((periodEnd - periodStart) / DAY_MS) + 1,
    });
  }

  if (!deploymentPeriods.length) {
    throw new AppError(
      "Employee work order deployment not found for salary month",
      404,
    );
  }

  /*
   * 4. Fetch salary structures applicable to each deployment period.
   *
   * Salary structure effective dates determine which structure
   * applies during each part of the deployment.
   */
  const salaryPeriods = [];

  for (const deploymentPeriod of deploymentPeriods) {
    const structures = await EmpSalaryStructure.findAll({
      where: {
        employee_id,
        is_deleted: false,

        effective_from: {
          [Op.lte]: new Date(deploymentPeriod.end),
        },

        [Op.or]: [
          {
            effective_to: {
              [Op.gte]: new Date(deploymentPeriod.start),
            },
          },
          {
            effective_to: null,
          },
        ],
      },
      order: [
        ["effective_from", "ASC"],
        ["id", "ASC"],
      ],
    });

    if (!structures.length) {
      throw new AppError(
        `Employee salary structure not found for deployment period ${formatDate(
          deploymentPeriod.start,
        )} to ${formatDate(deploymentPeriod.end)}`,
        404,
      );
    }

    /*
     * Split deployment period wherever the salary structure changes.
     */
    let cursor = deploymentPeriod.start;

    for (const structure of structures) {
      const structureStart = toTimestamp(structure.effective_from);

      const structureEnd = structure.effective_to
        ? toTimestamp(structure.effective_to)
        : monthEnd;

      const periodStart = Math.max(deploymentPeriod.start, structureStart);

      const periodEnd = Math.min(deploymentPeriod.end, structureEnd);

      if (periodStart > periodEnd) continue;

      // Prevent salary from being calculated twice for overlapping
      // salary structures.
      if (periodStart < cursor) {
        throw new AppError(
          `Overlapping salary structures found for employee ${employee_id}`,
          400,
        );
      }

      // Do not silently leave a period without an applicable structure.
      if (periodStart > cursor) {
        throw new AppError(
          `No salary structure covers ${formatDate(cursor)} to ${formatDate(
            periodStart - DAY_MS,
          )}`,
          400,
        );
      }

      salaryPeriods.push({
        deployment_id: deploymentPeriod.deployment_id,
        work_order_id: deploymentPeriod.work_order_id,
        salary_structure_id: structure.salary_structure_id,
        ctc: Number(structure.ctc),
        start: periodStart,
        end: periodEnd,
        payable_days: Math.floor((periodEnd - periodStart) / DAY_MS) + 1,
      });

      cursor = periodEnd + DAY_MS;

      if (cursor > deploymentPeriod.end) break;
    }

    if (cursor <= deploymentPeriod.end) {
      throw new AppError(
        `No salary structure covers ${formatDate(cursor)} to ${formatDate(
          deploymentPeriod.end,
        )}`,
        400,
      );
    }
  }

  /*
   * 5. Initialize aggregate totals.
   *
   * Component totals are grouped by component ID across all periods.
   */
  let gross = 0;
  let deduction = 0;
  let addonEarning = 0;
  let addonDeduction = 0;

  const componentTotals = new Map();
  const addonsBreakdown = [];
  const periodBreakdown = [];

  /*
   * 6. Calculate salary independently for each salary sub-period.
   */
  for (const period of salaryPeriods) {
    const yearlyCTC = Number(period.ctc);

    if (!yearlyCTC || !Number.isFinite(yearlyCTC)) {
      throw new AppError(
        `Invalid CTC for salary structure ${period.salary_structure_id}`,
        400,
      );
    }

    const monthlyCTC = yearlyCTC / 12;

    const prorationFactor = period.payable_days / totalDays;

    const components = await SalaryStructureComponent.findAll({
      where: {
        salary_structure_id: period.salary_structure_id,
        is_deleted: false,
      },
      include: [
        {
          model: SalaryComponent,
          as: "salaryComponent",
        },
      ],
      order: [
        ["calculation_priority", "ASC"],
        [
          { model: SalaryComponent, as: "salaryComponent" },
          "calculation_priority",
          "ASC",
        ],
      ],
    });

    if (!components.length) {
      throw new AppError(
        `No components found for salary structure ${period.salary_structure_id}`,
        404,
      );
    }

    let periodGross = 0;
    let periodDeduction = 0;

    const componentValues = {};
    const employerPfDeductions = {};
    const periodComponents = [];

    for (const item of components) {
      const comp = item.salaryComponent;

      if (!comp) continue;

      const valueType = item.value_type || comp.value_type;

      let baseAmount = 0;

      if (valueType === "FIXED") {
        baseAmount = Number(item.amount ?? comp.amount ?? 0);
      } else if (valueType === "PERCENTAGE") {
        const percentage = Number(item.percentage ?? comp.percentage ?? 0);

        if (comp.base_type === "CTC") {
          baseAmount = (percentage / 100) * monthlyCTC;
        } else if (comp.base_type === "COMPONENT") {
          const baseValue = componentValues[comp.base_component_id];

          if (baseValue === undefined) {
            throw new AppError(
              `Base component not calculated for ${comp.name}`,
              400,
            );
          }

          baseAmount = (percentage / 100) * baseValue;
        }
      }

      let amount;

      if (valueType === "FIXED") {
        amount = baseAmount;
      } else if (comp.is_pf === true) {
        const pfUpperLimit =
          comp.pf_upper_limit != null ? Number(comp.pf_upper_limit) : null;

        if (pfUpperLimit != null && baseAmount >= pfUpperLimit) {
          amount = pfUpperLimit;
        } else {
          amount = baseAmount * prorationFactor;
        }
      } else {
        amount = baseAmount * prorationFactor;
      }

      componentValues[comp.id] = baseAmount;

      if (comp.is_pf === true && comp.employer_pf_deduction_component_id) {
        const targetId = comp.employer_pf_deduction_component_id;

        employerPfDeductions[targetId] =
          (employerPfDeductions[targetId] || 0) + amount;
      }

      if (comp.type === "EARNING") {
        periodGross += amount;
      } else {
        periodDeduction += amount;
      }

      periodComponents.push({
        component_id: comp.id,
        name: comp.name,
        code: comp.code,
        type: comp.type,
        amount,
      });
    }

    console.log("Calculated period salary:", {
      work_order_id: period.work_order_id,
      salary_structure_id: period.salary_structure_id,
      ctc: yearlyCTC,
      monthly_ctc: monthlyCTC,
      payable_days: period.payable_days,
      prorationFactor,
      components: periodComponents,
      gross: periodGross,
      deductions: periodDeduction,
    });

    /*
     * Apply employer PF deductions to the configured target component
     * within this sub-period, preserving the existing calculation rule.
     */
    for (const [componentId, employerPfAmount] of Object.entries(
      employerPfDeductions,
    )) {
      const targetComponent = periodComponents.find(
        (item) => String(item.component_id) === String(componentId),
      );

      if (!targetComponent) continue;

      targetComponent.amount -= employerPfAmount;

      if (targetComponent.type === "EARNING") {
        periodGross -= employerPfAmount;
      }
    }

    /*
     * Aggregate components across salary sub-periods.
     */
    for (const component of periodComponents) {
      const key = String(component.component_id);

      if (!componentTotals.has(key)) {
        componentTotals.set(key, {
          component_id: component.component_id,
          name: component.name,
          code: component.code,
          type: component.type,
          amount: 0,
        });
      }

      componentTotals.get(key).amount += component.amount;
    }

    gross += periodGross;
    deduction += periodDeduction;

    periodBreakdown.push({
      deployment_id: period.deployment_id,
      work_order_id: period.work_order_id,
      salary_structure_id: period.salary_structure_id,
      ctc: yearlyCTC,
      monthly_ctc: monthlyCTC,
      start_date: formatDate(period.start),
      end_date: formatDate(period.end),
      payable_days: period.payable_days,
      components: periodComponents,
      gross_earnings: periodGross,
      total_deductions: periodDeduction,
    });
  }

  /*
   * 7. Fetch applicable addons for the selected month.
   *
   * Addons are processed once for the month, not once per sub-period,
   * to avoid duplicating a monthly addon when multiple structures exist.
   */
  const employeeAddons = await EmployeeSalaryAddon.findAll({
    where: {
      employee_id,
      is_deleted: false,
      is_active: true,

      effective_from: {
        [Op.lte]: new Date(monthEnd),
      },

      [Op.or]: [
        {
          effective_to: {
            [Op.gte]: new Date(monthStart),
          },
        },
        {
          effective_to: null,
        },
      ],
    },
    include: [
      {
        model: SalaryAddonMaster,
        as: "salaryAddonMaster",
        where: {
          is_deleted: false,
          is_active: true,
        },
      },
    ],
  });

  for (const addon of employeeAddons) {
    const master = addon.salaryAddonMaster;

    if (!master) continue;

    const amount = Number(addon.amount || 0);

    if (master.addon_type === "DEDUCTION") {
      addonDeduction += amount;
    } else if (master.addon_type === "EARNING") {
      addonEarning += amount;
    }

    addonsBreakdown.push({
      addon_id: addon.id,
      salary_addon_master_id: master.id,
      name: master.name,
      code: master.code,
      type: master.addon_type,
      amount,
      recurrence_type: addon.recurrence_type,
    });
  }

  /*
   * 8. Calculate leave deductions separately for each work order.
   *
   * Normal leave:
   *   Work-order gross / calendar days in month * leave granted.
   *
   * Full deployment-period leave:
   *   Deduct the entire gross attributable to that work order.
   */

  const workOrderSalaryTotals = new Map();

  // Aggregate gross salary by work order.
  for (const period of periodBreakdown) {
    const key = String(period.work_order_id);

    if (!workOrderSalaryTotals.has(key)) {
      workOrderSalaryTotals.set(key, {
        work_order_id: period.work_order_id,
        gross: 0,
        workOrderDays: 0,
      });
    }

    workOrderSalaryTotals.get(key).gross += Number(period.gross_earnings || 0);
  }

  // Count deployment days within the selected month for each work order.
  for (const period of deploymentPeriods) {
    const key = String(period.work_order_id);

    if (!workOrderSalaryTotals.has(key)) {
      workOrderSalaryTotals.set(key, {
        work_order_id: period.work_order_id,
        gross: 0,
        workOrderDays: 0,
      });
    }

    workOrderSalaryTotals.get(key).workOrderDays += period.payable_days;
  }

  let leaveTaken = 0;
  let leaveDeduction = 0;

  const leaveBreakdown = [];

  for (const workOrderTotal of workOrderSalaryTotals.values()) {
    const leaveData = await EmployeeWorkOrderLeave.findOne({
      where: {
        employee_id,
        wo_id: workOrderTotal.work_order_id,
        month,
        year: String(year),
      },
    });

    const workOrderLeaveTaken = Number(leaveData?.leave_taken || 0);

    const storedLeaveGranted = Number(leaveData?.leave_granted || 0);

    /*
     * Preserve the existing leave-granted rule:
     * - No leave taken: zero leave deduction.
     * - Otherwise: use the stored leave_granted value,
     *   except full-period leave is handled separately below.
     */
    const workOrderLeaveGranted =
      workOrderLeaveTaken === 0 ? 0 : storedLeaveGranted;

    let workOrderLeaveDeduction = 0;

    if (
      workOrderTotal.workOrderDays > 0 &&
      workOrderLeaveTaken === workOrderTotal.workOrderDays
    ) {
      // All deployment days in this work order were taken as leave.
      // The salary attributable to this work order becomes zero.
      workOrderLeaveDeduction = workOrderTotal.gross;
    } else {
      // Normal leave deduction uses calendar days in the month.
      const perDaySalary = workOrderTotal.gross / totalDays;

      workOrderLeaveDeduction = perDaySalary * Math.abs(workOrderLeaveGranted);
    }

    leaveTaken += workOrderLeaveTaken;
    leaveDeduction += workOrderLeaveDeduction;

    leaveBreakdown.push({
      work_order_id: workOrderTotal.work_order_id,
      work_order_days: workOrderTotal.workOrderDays,
      work_order_gross: workOrderTotal.gross,
      leaveTaken,
      lop: leaveDeduction,
      leave_by_work_order: leaveBreakdown,
    });
  }

  // Add the combined leave deductions to the existing deductions.
  deduction += leaveDeduction;

  /*
   * 9. Calculate final salary.
   */
  const net = gross - deduction + addonEarning - addonDeduction;

  const breakdown = Array.from(componentTotals.values());

  return {
    is_existing: false,
    employee_id,
    employee_name,
    month,
    year,

    // Multiple salary structures may have different CTCs.
    yearly_ctc: null,
    monthly_ctc: null,

    total_days: totalDays,

    deployment_periods: deploymentPeriods.map((period) => ({
      deployment_id: period.deployment_id,
      start_date: formatDate(period.start),
      end_date: formatDate(period.end),
      payable_days: period.payable_days,
    })),

    salary_periods: periodBreakdown,

    gross_earnings: gross,
    total_deductions: deduction,
    addon_earnings: addonEarning,
    addon_deductions: addonDeduction,
    net_salary: net,

    leaveTaken,
    lop: leaveDeduction,

    components: breakdown,
    addons: addonsBreakdown,
  };
};

exports.dispatchSalary = async (data, transaction) => {
  // req.body should be array of employees

  if (!Array.isArray(data) || !data.length) {
    throw new AppError("Request body must be a non-empty array", 400);
  }

  const createdRegisters = [];

  for (const item of data) {
    const {
      transaction_number,
      transaction_date,
      employee_id,
      month,
      year,
      gross_earnings,
      total_deductions,
      leave_deduction,
      net_salary,
      components,
      addons = [],
    } = item;
    // 1️⃣ Duplicate check
    const existing = await EmployeeSalaryRegister.findOne({
      where: {
        employee_id,
        month,
        year,
        is_deleted: false,
      },
      transaction,
    });

    if (existing) {
      throw new AppError(
        `Salary already dispatched for employee ${employee_id}`,
        409,
      );
    }

    // 2️⃣ Insert main register
    const register = await EmployeeSalaryRegister.create(
      {
        employee_id,
        year,
        month,
        gross_earnings,
        total_deductions,
        net_salary,
        status: "DISPATCHED",
        dispatched_at: new Date(),
        transaction_number,
        transaction_date,
        leave_deduction,
      },
      { transaction },
    );

    // 3️⃣ Insert snapshots
    const componentSnapshots = (components || []).map((comp) => ({
      employee_salary_register_id: register.id,

      salary_component_id: comp.component_id,

      component_name: comp.name,

      component_type: comp.type,

      final_amount: comp.amount,

      source_type: "STRUCTURE",

      addon_id: null,
    }));

    const addonSnapshots = (addons || []).map((addon) => ({
      employee_salary_register_id: register.id,

      salary_component_id: null,

      component_name: addon.name,

      component_type: addon.type,

      final_amount: addon.amount,

      source_type: "ADDON",

      addon_id: addon.addon_id,
    }));

    const snapshotData = [...componentSnapshots, ...addonSnapshots];

    if (snapshotData.length) {
      await EmployeeSalaryRegisterSnapshot.bulkCreate(snapshotData, {
        transaction,
      });
    }

    createdRegisters.push({
      employee_id,
      register_id: register.id,
    });
  }

  return {
    message: "Multiple employee salaries dispatched successfully",
    total_dispatched: createdRegisters.length,
    registers: createdRegisters,
  };
};

exports.generateSalarySlip = async (register_id, transaction) => {
  // register
  const register = await EmployeeSalaryRegister.findByPk(register_id, {
    transaction,
  });

  if (!register) {
    throw new AppError("Salary register not found", 404);
  }

  // already generated
  if (register.mon_salaryslip_generated) {
    return {
      already_generated: true,
      filename: register.mon_salaryslip_filename,
      filepath: register.mon_salaryslip_filepath,
    };
  }

  // employee
  const employee = await Employee.findByPk(register.employee_id);

  const leaveData = await EmployeeWorkOrderLeave.findOne({
    where: {
      employee_id: register.employee_id,
      month: register.month,
      year: String(register.year),
    },
  });
  // snapshots
  const snapshots = await EmployeeSalaryRegisterSnapshot.findAll({
    where: {
      employee_salary_register_id: register.id,
      is_deleted: false,
    },
    transaction,
  });

  const addons = snapshots
    .filter((item) => item.source_type === "ADDON")
    .map((item) => ({
      addon_id: item.addon_id,

      name: item.component_name,

      type: item.component_type,

      amount: Number(item.final_amount),
    }));

  // prepare data
  const pdfData = {
    employee_id: register.employee_id,

    employee_name: [
      employee.first_name,
      employee.middle_name,
      employee.last_name,
    ]
      .filter(Boolean)
      .join(" "),

    month: register.month,
    year: register.year,

    gross_earnings: Number(register.gross_earnings),

    total_deductions: Number(register.total_deductions),

    net_salary: Number(register.net_salary),

    leave_taken: Number(leaveData?.leave_taken || 0),

    leave_deduction: Number(register?.leave_deduction || 0),

    components: snapshots
      .filter((item) => item.source_type === "STRUCTURE")
      .map((item) => ({
        name: item.component_name,
        type: item.component_type,
        amount: Number(item.final_amount),
      })),
    addons,
  };

  //  generate pdf
  const pdf = await SalarySlipPdf.generate(pdfData);

  //  update DB
  await register.update(
    {
      mon_salaryslip_generated: true,
      mon_salaryslip_filename: pdf.filename,
      mon_salaryslip_filepath: pdf.filepath,
    },
    { transaction },
  );

  return {
    message: "Salary slip generated successfully",
    filename: pdf.filename,
    filepath: pdf.filepath,
  };
};

exports.downloadSalarySlip = async (register_id) => {
  return await EmployeeSalaryRegister.findByPk(register_id, {
    attributes: [
      "id",
      "mon_salaryslip_generated",
      "mon_salaryslip_filename",
      "mon_salaryslip_filepath",
    ],
  });
};

exports.getGeneratedSalarySlips = async (year, employee_id) => {
  const registers = await EmployeeSalaryRegister.findAll({
    where: {
      year,
      employee_id,
      mon_salaryslip_generated: true,
      is_deleted: false,
    },
    include: [
      {
        model: Employee,
        as: "employee",
        attributes: ["id", "first_name", "middle_name", "last_name"],
      },
    ],
    order: [["id", "ASC"]],
  });

  if (!registers.length) {
    throw new AppError(
      `No generated salary slips found for this employee in year ${year}`,
      404,
    );
  }
  return registers.map((register) => {
    const employee = register.employee;

    const employee_name = [
      employee?.first_name,
      employee?.middle_name,
      employee?.last_name,
    ]
      .filter(Boolean)
      .join(" ");

    return {
      register_id: register.id,
      employee_id: register.employee_id,
      employee_name,
      month: register.month,
      year: register.year,
      gross_earnings: Number(register.gross_earnings || 0),
      total_deductions: Number(register.total_deductions || 0),
      net_salary: Number(register.net_salary || 0),
      status: register.status,
      mon_salaryslip_generated: register.mon_salaryslip_generated,
      mon_salaryslip_filename: register.mon_salaryslip_filename,
      mon_salaryslip_filepath: register.mon_salaryslip_filepath,
      transaction_number: register.transaction_number,
      transaction_date: register.transaction_date,
    };
  });
};
