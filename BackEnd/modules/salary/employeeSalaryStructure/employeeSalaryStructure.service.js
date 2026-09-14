const {
  WorkOrder,
  WoDesgnMapping,
  EmployeeWorkOrderDeployment,
  Employee,
  EmpSalaryStructure,
  SalaryStructureComponent,
  SalaryComponent,
} = require("../../../models");
const AppError = require("../../../utils/appError");

// GET ALL
exports.getEmployeeSalaryStructures = async (queryOptions) => {
  const { rows, count } =
    await EmpSalaryStructure.findAndCountAll(queryOptions);

  const page = queryOptions.page * 1 || 1;
  const limit = queryOptions.limit * 1 || 10;

  return {
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    results: rows.length,
    data: rows,
  };
};

// GET BY ID
exports.getEmployeeSalaryStructureById = async (queryOptions) => {
  const data = await EmpSalaryStructure.findOne(queryOptions);

  if (!data) {
    throw new AppError("Employee Salary Structure not found", 404);
  }

  return data;
};

// CREATE
exports.bulkCreateEmployeeSalaryStructure = async (dataArray, transaction) => {
  return await EmpSalaryStructure.bulkCreate(dataArray, {
    updateOnDuplicate: ["ctc", "updated_by", "updated_at"],
    transaction,
  });
};

// UPDATE
exports.updateEmployeeSalaryStructure = async (id, data, transaction) => {
  const record = await EmpSalaryStructure.findByPk(id, {
    transaction,
  });

  if (!record) {
    throw new AppError("Employee Salary Structure not found", 404);
  }

  await record.update(data, { transaction });

  return record;
};

// DELETE (soft delete)
exports.deleteEmployeeSalaryStructure = async (id, transaction) => {
  const record = await EmpSalaryStructure.findByPk(id, {
    transaction,
  });

  if (!record) {
    throw new AppError("Employee Salary Structure not found", 404);
  }

  return await record.update({ is_deleted: true }, { transaction });
};

exports.getEmployeeSalaryStructureByWorkOrder = async (
  workOrderId,
  salaryStrId,
) => {
  const data = await WorkOrder.findOne({
    where: {
      id: workOrderId,
      is_active: true,
    },
    include: [
      {
        model: WoDesgnMapping,
        required: false,
        include: [
          {
            model: EmployeeWorkOrderDeployment,
            required: false,
            where: {
              is_deleted: false,
              relieving_date: null,
            },
            include: [
              {
                model: Employee,
                required: false,
                include: [
                  {
                    model: EmpSalaryStructure,
                    as: "empSalaryStructure",
                    required: false,
                    where: {
                      is_active: true,
                      salary_structure_id: salaryStrId,
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });

  if (!data) {
    throw new AppError("Work Order not found", 404);
  }

  // NORMALIZATION

  const employeeMap = {};

  data.WoDesgnMappings?.forEach((mapping) => {
    mapping.EmployeeWorkOrderDeployments?.forEach((deployment) => {
      const emp = deployment.Employee;
      if (!emp) return;

      const empId = emp.id;

      // avoid duplicates
      if (employeeMap[empId]) return;

      const salaryList = emp.empSalaryStructure || [];

      // pick latest OR filter by structure if needed
      let latest = null;

      if (salaryList.length > 0) {
        latest = salaryList.reduce((a, b) =>
          new Date(a.effective_from) > new Date(b.effective_from) ? a : b,
        );
      }

      const name = `${emp.first_name || " "}${emp.middle_name || " "}${
        emp.last_name || ""
      }`.trim();

      employeeMap[empId] = {
        employee_id: empId,
        name,
        ctc: latest?.ctc || null,
        effective_from: latest?.effective_from || null,
      };
    });
  });

  return Object.values(employeeMap);
};

const getDaysInMonth = (month, year) => {
  return new Date(year, month, 0).getDate();
};

exports.getEmployeeSalaryBreakdownByEmployee = async (
  salary_structure_id,
  employee_id,
) => {
  // Employee fetch
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

  // Employee salary structure fetch
  const empSalary = await EmpSalaryStructure.findOne({
    where: {
      employee_id,
      salary_structure_id,
      is_deleted: false,
    },
  });

  if (!empSalary) {
    throw new AppError("Employee salary structure not found", 404);
  }

  const yearly_ctc = Number(empSalary.ctc || 0);
  const monthly_ctc = yearly_ctc / 12;

  // Salary structure components
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

  if (!components.length) {
    throw new AppError("No components found for structure", 404);
  }

  let gross = 0;
  let deduction = 0;

  const componentValues = {};
  const breakdown = [];
  const employerPfDeductions = {};

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

      if (comp.base_type === "CTC") {
        baseAmount = (percentage / 100) * monthly_ctc;
      }

      if (comp.base_type === "COMPONENT") {
        const baseVal = componentValues[comp.base_component_id];

        if (baseVal === undefined) {
          throw new AppError(
            `Base component not calculated for ${comp.name}`,
            400,
          );
        }

        baseAmount = (percentage / 100) * baseVal;
      }

      // PF upper limit
      if (comp.is_pf === true && comp.pf_upper_limit != null) {
        baseAmount = Math.min(baseAmount, Number(comp.pf_upper_limit));
      }
    }

    // Employer PF deduction
    if (comp.is_pf === true && comp.employer_pf_deduction_component_id) {
      employerPfDeductions[comp.employer_pf_deduction_component_id] =
        (employerPfDeductions[comp.employer_pf_deduction_component_id] || 0) +
        baseAmount;
    }

    // No proration in generic salary breakdown
    const amount = baseAmount;

    // IMPORTANT:
    // Dependencies use the full monthly/base amount,
    // not the prorated amount.
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
      monthly_amount: amount,
      yearly_amount: amount * 12,
    });
  }

  for (const [componentId, employerPfDeduction] of Object.entries(
    employerPfDeductions,
  )) {
    const component = breakdown.find(
      (item) => String(item.component_id) === String(componentId),
    );

    if (!component) continue;

    component.monthly_amount -= employerPfDeduction;
    component.yearly_amount = component.monthly_amount * 12;

    if (component.type === "EARNING") {
      gross -= employerPfDeduction;
    }
  }

  const net_salary = gross - deduction;

  const employee_name = [
    employee.first_name,
    employee.middle_name,
    employee.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  return {
    employee_id,
    employee_name,
    salary_structure_id,

    yearly_ctc,
    monthly_ctc,

    gross_earnings_monthly: gross,
    gross_earnings_yearly: gross * 12,

    total_deductions_monthly: deduction,
    total_deductions_yearly: deduction * 12,

    net_salary_monthly: net_salary,
    net_salary_yearly: net_salary * 12,

    components: breakdown,
  };
};
