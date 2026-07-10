const catchAsync = require("../../utils/catchAsync");
const modulesService = require("./module.service");
const APIFeatures = require("../../utils/apiFeature");

exports.getAllModules = catchAsync(async (req, res) => {

  const features = new APIFeatures(req.query, [
    "module_name",
    "module_code",
  ])
    .filter()
    .search()
    .limitFields()
    .join();

  const data = await modulesService.getAllModules(features.query);

  // optional 404 (same tera pattern)
  if (!data || data.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "No modules found"
    });
  }

  res.status(200).json({
    status: "success",
    results: data.length,
    data: data
  });

});