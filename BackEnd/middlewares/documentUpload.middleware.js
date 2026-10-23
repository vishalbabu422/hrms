const createUpload = require("./createUpload");

module.exports = createUpload({
    folder: "documents",
    fieldName: "file",
    paramName: "employeeId",
    filePrefix: "DOCUMENT",
    allowedTypes: [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg"
    ],
    fileTypeMessage: "Invalid file type! Only PDF, JPG, JPEG and PNG files are allowed"
});