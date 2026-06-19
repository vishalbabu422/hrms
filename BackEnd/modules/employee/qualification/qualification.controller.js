const catchAsync = require("../../../utils/catchAsync");
const QualificationService = require("./qualification.service");
const sequelize = require("../../../utils/database");

// Get Qualification By ID
const getQualificationById = catchAsync(async (req, res, next) => {
  const whereCondition = {
    employee_id: req.params.employeeId,
    is_deleted: false,
  };

  const result = await QualificationService.getById({ where: whereCondition });
  if (!result || result.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No Qualification details found for this employee",
    });
  }

  res.status(200).json({
    status: "success",
    data: result,
  });
});

const assignQualification = catchAsync(async (req, res, next) => {
  const { employeeId } = req.params;

  await sequelize.transaction(async (t) => {
    await QualificationService.assignQualification(employeeId, req.body, t);
  });

  res.status(201).json({
    status: "success",
    message: "Qualification assigned successfully",
  });
});

const updateQualification = catchAsync(async (req, res, next) => {
  const { employeeId, qualificationId } = req.params;

  const result = await sequelize.transaction(async (t) => {
    return await QualificationService.updateQualification(
      employeeId,
      qualificationId,
      req.body,
      t,
    );
  });

  res.status(200).json({
    status: "success",
    data: result,
  });
});

// Delete Qualification
const deleteQualification = catchAsync(async (req, res, next) => {
  const { employeeId, qualificationId } = req.params;

  await sequelize.transaction(async (t) => {
    await QualificationService.deleteQualification(
      employeeId,
      qualificationId,
      t,
    );
  });

  res.status(200).json({
    status: "success",
    message: "Qualification deleted successfully",
  });
});
module.exports = {
  getQualificationById,
  assignQualification,
  updateQualification,
  deleteQualification,
};
