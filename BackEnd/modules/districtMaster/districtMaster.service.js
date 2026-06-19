const { DistrictMaster } = require("../../models");

exports.getAll = async (state_id) => {
  return await DistrictMaster.findAll({
    where: {
      state_id,
      is_active: true,
    },
    order: [["district_name", "ASC"]],
  });
};