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
  const { employee_id, month, year, salary_structure_id } = data;

  const requestedDate = new Date(year, month - 1, 1);
  // 1️⃣ Check existing
  const existing = await EmployeeSalaryRegister.findOne({
    where: { employee_id, month, year, is_deleted: false },
    include: [
      {
        model: Employee,
        as: "employee",
      },
    ],
  });

  if (existing) {
    const employee = await Employee.findOne({
      where: {
        id: employee_id,
        is_deleted: false,
      },
      attributes: ["first_name", "middle_name", "last_name"],
    });

    const employee_name = [
      employee?.first_name,
      employee?.middle_name,
      employee?.last_name,
    ]
      .filter(Boolean)
      .join(" ");

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

        effective_from: {
          [Op.lte]: requestedDate,
        },

        [Op.or]: [
          {
            effective_to: {
              [Op.gte]: requestedDate,
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
        },
      ],
    });

    return {
      register_id: existing.id,
      is_existing: true,
      employee_id: existing.employee_id,
      employee_name,
      month: existing.month,
      year: existing.year,

      gross_earnings: Number(existing.gross_earnings || 0),
      total_deductions: Number(existing.total_deductions || 0),
      net_salary: Number(existing.net_salary || 0),

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

  // full name
  const employee_name = [
    employee.first_name,
    employee.middle_name,
    employee.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  // 2️⃣ Get employee salary structure (CTC)
  const empSalary = await EmpSalaryStructure.findOne({
    where: {
      employee_id,
      is_deleted: false,
    },
    order: [["id", "DESC"]],
  });



  if (!empSalary) {
    throw new AppError("Employee salary structure not found", 404);
  }

  const yearlyCTC = Number(empSalary.ctc);

  if (!yearlyCTC) {
    throw new AppError("CTC not found", 404);
  }

  const monthlyCTC = yearlyCTC / 12;

  const totalDays = getDaysInMonth(month, year);

  const monthStart = new Date(Date.UTC(year, month - 1, 1));

  const monthEnd = new Date(Date.UTC(year, month, 0));

  const deployment = await EmployeeWorkOrderDeployment.findOne({
    where: {
      employee_id,
      is_deleted: false,

      joining_date: {
        [Op.lte]: monthEnd,
      },

      [Op.or]: [
        {
          relieving_date: {
            [Op.gte]: monthStart,
          },
        },
        {
          relieving_date: null,
        },
      ],
    },

    order: [["joining_date", "DESC"]],
  });

  if (!deployment) {
    throw new AppError(
      "Employee work order deployment not found for salary month",
      404,
    );
  }

  const joiningDate = getDateOnlyUTC(deployment.joining_date);

  const relievingDate = deployment.relieving_date
    ? getDateOnlyUTC(deployment.relieving_date)
    : null;

  const effectiveStartDate = Math.max(joiningDate, monthStart.getTime());

  const effectiveEndDate =
    relievingDate !== null
      ? Math.min(relievingDate, monthEnd.getTime())
      : monthEnd.getTime();

  let payableDays = 0;

  if (effectiveStartDate <= effectiveEndDate) {
    payableDays =
      Math.floor(
        (effectiveEndDate - effectiveStartDate) / (1000 * 60 * 60 * 24),
      ) + 1;
  }

  // Get structure components
  const components = await SalaryStructureComponent.findAll({
    where: {
      salary_structure_id,
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

  const employeeAddons = await EmployeeSalaryAddon.findAll({
    where: {
      employee_id,
      is_deleted: false,
      is_active: true,

      effective_from: {
        [Op.lte]: requestedDate,
      },

      [Op.or]: [
        {
          effective_to: {
            [Op.gte]: requestedDate,
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
  if (!components.length) {
    throw new AppError("No components found for structure", 404);
  }

  let gross = 0;
  let deduction = 0;
  let addonEarning = 0;
  let addonDeduction = 0;
  const breakdown = [];
  const addonsBreakdown = [];
  const componentValues = {};

  const prorationFactor = payableDays / totalDays;

  for (const item of components) {
    const comp = item.salaryComponent;

    if (!comp) continue;

    const value_type = item.value_type || comp.value_type;

    let baseAmount = 0;

    // FIXED
    if (value_type === "FIXED") {
      baseAmount = Number(item.amount ?? comp.amount ?? 0);
    }

    // PERCENTAGE
    if (value_type === "PERCENTAGE") {
      const percentage = Number(item.percentage ?? comp.percentage ?? 0);

      // Percentage of monthly CTC
      if (comp.base_type === "CTC") {
        baseAmount = (percentage / 100) * monthlyCTC;
      }

      // Percentage of another component
      if (comp.base_type === "COMPONENT") {
        const baseVal = componentValues[comp.base_component_id];

        if (baseVal === undefined) {
          throw new AppError(
            `Base component not calculated for component ${comp.name}`,
            400,
          );
        }

        baseAmount = (percentage / 100) * baseVal;
      }
    }

    // Prorate ONLY ONCE
    const amount = baseAmount * prorationFactor;

    // IMPORTANT:
    // Store FULL monthly value for component dependency
    componentValues[comp.id] = baseAmount;

    if (comp.type === "EARNING") {
      gross += amount;
    } else {
      deduction += amount;
    }

    breakdown.push({
      component_id: comp.id,
      name: comp.name,
      code: comp.code,
      type: comp.type,
      amount,
    });
  }

  //const net = gross - deduction;
  for (const addon of employeeAddons) {
    const master = addon.salaryAddonMaster;

    if (!master) continue;

    const addonAmount = Number(addon.amount || 0);

    if (master.addon_type === "DEDUCTION") {
      addonDeduction += addonAmount;
    }
    if (master.addon_type === "EARNING") {
      addonEarning += addonAmount;
    }

    addonsBreakdown.push({
      addon_id: addon.id,
      salary_addon_master_id: master.id,
      name: master.name,
      code: master.code,
      type: master.addon_type,
      amount: addonAmount,
      recurrence_type: addon.recurrence_type,
    });
  }
  // Leave data fetch
  const leaveData = await EmployeeWorkOrderLeave.findOne({
    where: {
      employee_id,
      month,
      year: String(year),
    },
  });

  const leaveTaken = Number(leaveData?.leave_taken || 0);

  const leaveGranted =
    leaveTaken === 0 ? 0 : Number(leaveData?.leave_granted || 0);

  // Per day salary
  const perDaySalary = gross / totalDays;

  // Leave deduction
  const leaveDeduction = perDaySalary * leaveGranted;

  // Total deduction me add karo
  deduction += leaveDeduction;

  // Final net salary
  const net = gross - deduction + addonEarning - addonDeduction;
  // 5️⃣ Final response
  return {
    is_existing: false,
    employee_id,
    employee_name,
    month,
    year,
    ctc: yearlyCTC,
    yearly_ctc: yearlyCTC,
    monthly_ctc: monthlyCTC,
    joining_date: deployment.joining_date,
    relieving_date: deployment.relieving_date,
    total_days: totalDays,
    payable_days: payableDays,
    gross_earnings: gross,
    total_deductions: deduction,
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

    leave_deduction:
      Number(leaveData?.leave_taken || 0) *
      (Number(register.gross_earnings) /
        getDaysInMonth(register.month, register.year)),

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
