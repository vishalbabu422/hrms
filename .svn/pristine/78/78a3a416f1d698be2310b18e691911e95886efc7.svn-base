const catchAsync = require("../../../utils/catchAsync");
const SalaryComponentService = require("./salaryComponent.service");
const sequelize = require("../../../utils/database");
const AppError = require("../../../utils/appError");


// GET ALL
const getSalaryComponents = catchAsync(async (req, res, next) => {
  const result = await SalaryComponentService.getSalaryComponents(req.query);

  res.status(200).json({
    status: "success",
    ...result,
  });
});

// GET BY ID
const getSalaryComponentById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await SalaryComponentService.getSalaryComponentById(id);

  res.status(200).json({
    status: "success",
    data: result,
  });
});

// CREATE
const createSalaryComponent = catchAsync(async (req, res, next) => {

   if (req.isSuperAdmin) {
        if (!req.body.organization_id) {
            throw new AppError("organization_id is required", 400);
        }
    } else {
        req.body.org_id = req.user.organization_id;
    }
  const result = await sequelize.transaction(async (t) => {
    return await SalaryComponentService.createSalaryComponent(req.body, t);
  });

  res.status(201).json({
    status: "success",
    message: "Salary Component created successfully",
    data: result,
  });
});

// UPDATE
const updateSalaryComponent = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const result = await sequelize.transaction(async (t) => {
    return await SalaryComponentService.updateSalaryComponent(
      id,
      req.body,
      t
    );
  });

  res.status(200).json({
    status: "success",
    message: "Salary Component updated successfully",
    data: result,
  });
});

// DELETE (SOFT)
const deleteSalaryComponent = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  await sequelize.transaction(async (t) => {
    await SalaryComponentService.deleteSalaryComponent(id, t);
  });

  res.status(200).json({
    status: "success",
    message: "Salary Component deleted successfully",
  });
});

module.exports = {
  getSalaryComponents,
  getSalaryComponentById,
  createSalaryComponent,
  updateSalaryComponent,
  deleteSalaryComponent,
};