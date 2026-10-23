const createUpload = require("./createUpload");

module.exports = createUpload({
    folder: "mpr",
    fieldName: "file",
    paramName: "id",
    filePrefix: "MPR_WO",
    allowedTypes: [
        "application/pdf"
    ],
    fileTypeMessage: "Invalid file type!, Only PDF files are allowed"
});