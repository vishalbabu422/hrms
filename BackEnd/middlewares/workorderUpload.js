const createUpload = require("./createUpload");

module.exports = createUpload({
    folder: "workorder",
    filePrefix: "WORKORDER",
    allowedTypes: [
        "application/pdf"
    ]
});