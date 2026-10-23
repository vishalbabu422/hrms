const createUpload = require("./createUpload");

module.exports = createUpload({
    folder: "empanelment",
    fieldName: "doc_path",
    filePrefix: "EMPANELMENT",
    allowedTypes: [
        "application/pdf"
    ],
    fileTypeMessage: "Invalid file type!, Only PDF files are allowed"
});