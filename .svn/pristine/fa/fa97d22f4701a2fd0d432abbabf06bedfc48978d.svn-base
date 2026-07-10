const catchAsync = require("../../../utils/catchAsync");
const ExperienceService = require("./experience.service");
const sequelize = require("../../../utils/database");

// Get Experience By Employee ID
const getExperienceById = catchAsync(async (req, res, next) => {
  const whereCondition = {
    employee_id: req.params.employeeId,
    is_deleted: false,
  };

  const result = await ExperienceService.getExperienceById({
    where: whereCondition,
  });

  if (!result || result.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No Experience found for this employee",
    });
  }

  res.status(200).json({
    status: "success",
    data: result,
  });
});

// Assign Experience
const assignExperience = catchAsync(async (req, res, next) => {
  const { employeeId } = req.params;

  const result = await sequelize.transaction(async (t) => {
    return await ExperienceService.assignExperience(employeeId, req.body, t);
  });

  res.status(201).json({
    status: "success",
    message: "Experience added successfully",
    data: result,
  });
});

// Update Experience
const updateExperience = catchAsync(async (req, res, next) => {
  const { employeeId, experienceId } = req.params;

  const result = await sequelize.transaction(async (t) => {
    return await ExperienceService.updateExperience(
      employeeId,
      experienceId,
      req.body,
      t,
    );
  });

  res.status(200).json({
    status: "success",
    message: "Experience updated successfully",
    data: result,
  });
});

// Delete Experience
const deleteExperience = catchAsync(async (req, res, next) => {
  const { employeeId, experienceId } = req.params;

  await sequelize.transaction(async (t) => {
    await ExperienceService.deleteExperience(employeeId, experienceId, t);
  });

  res.status(200).json({
    status: "success",
    message: "Experience deleted successfully",
  });
});
module.exports = {
  getExperienceById,
  assignExperience,
  updateExperience,
  deleteExperience,
};
