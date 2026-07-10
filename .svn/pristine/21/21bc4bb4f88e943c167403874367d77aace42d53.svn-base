const catchAsync = require("../../utils/catchAsync");
const DistrictMasterService = require("./districtMaster.service");

const getAll = catchAsync(async (req, res, next) => {
  const { state_id } = req.query;

  if (!state_id) {
    return res.status(400).json({
      status: "fail",
      message: "state_id is required",
    });
  }

  const districtList = await DistrictMasterService.getAll(state_id);

  res.status(200).json({
    status: "success",
    message: "District list fetched successfully",
    results: districtList.length,
    data: {
      districtList,
    },
  });
});

module.exports = {
  getAll,
};