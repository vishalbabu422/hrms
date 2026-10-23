const createUpload = require("./createUpload");

module.exports = createUpload({
  folder: "salary-statement",
  paramName: "empId",
  filePrefix: "SALARY_STATEMENT",
  allowedTypes: ["application/pdf"],
  maxSize: 5 * 1024 * 1024,
});