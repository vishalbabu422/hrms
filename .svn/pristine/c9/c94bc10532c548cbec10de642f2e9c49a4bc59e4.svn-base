const crypto = require("crypto");
const fs = require("fs");

exports.generateFileHash = (filePath) => {

    const fileBuffer = fs.readFileSync(filePath);

    const hash = crypto.createHash("sha256");

    hash.update(fileBuffer);

    return hash.digest("hex");
};