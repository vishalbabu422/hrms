const { StateMaster } = require("../../models");

exports.index = async (queryOptions) => {
  return await StateMaster.findAndCountAll({
    ...queryOptions,
  });
};
