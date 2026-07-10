const crypto = require("crypto");

exports.sha256 = (val) =>
    crypto.createHash("sha256").update(val).digest("hex");

exports.randomToken = () =>
    crypto.randomBytes(64).toString("hex");