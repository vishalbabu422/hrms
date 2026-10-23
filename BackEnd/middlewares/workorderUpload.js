const createUpload = require("./createUpload");

module.exports = createUpload({
    folder: "workorder",
    fieldName: "doc_path",
    filePrefix: "WORKORDER",
    allowedTypes: [
        "application/pdf"
    ],
    fileTypeMessage: "Invalid file type!, Only PDF files are allowed"
});