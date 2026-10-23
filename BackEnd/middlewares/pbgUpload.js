const createUpload = require("./createUpload");

module.exports = createUpload({
  folder: "pbg",
  paramName: "pbg_id",
  filePrefix: "PBG",
  allowedTypes: ["application/pdf"],
  maxSize: 5 * 1024 * 1024,
});