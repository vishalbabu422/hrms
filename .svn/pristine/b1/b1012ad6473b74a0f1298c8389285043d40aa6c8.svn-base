const catchAsync = require("../../utils/catchAsync");
const APIFeatures = require("../../utils/apiFeature");
const StateService = require("./stateMaster.service");
const { Op } = require("sequelize");

// Get State List
const index = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(req.query)
    .filter()
    .sort()
    .limitFields()
    .join()
    .paginate();

  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 10;

  if (!features.query.where) features.query.where = {};

  features.query.where.is_active = true;

  if (req.query.search && req.query.search.trim().length >= 2) {
    const search = req.query.search.trim();

    features.query.where[Op.or] = [
      { state_name: { [Op.iLike]: `%${search}%` } },
      { state_code: { [Op.iLike]: `%${search}%` } },
      { state_type: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const { rows, count } = await StateService.index(features.query);

  res.status(200).json({
    status: "success",
    message: "State list fetched successfully",
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
    results: rows.length,
    data: { stateList: rows },
  });
});

module.exports = {
  index,
};