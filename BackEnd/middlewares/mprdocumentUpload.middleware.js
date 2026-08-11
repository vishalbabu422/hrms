const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const { id } = req.params;

        if (!id) {
            return cb(new Error("Work Order ID is required in params"), null);
        }

        const uploadPath = path.join("uploads", "mpr", String(id));

        // Ensure directory exists
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },

    filename: function (req, file, cb) {
        const { id } = req.params;

        const ext = path.extname(file.originalname);

        const fileName = 'MPR_WO_' + Date.now() + ext;

        cb(null, fileName);
    }
});

// File filter
const fileFilter = (req, file, cb) => {

    const allowedTypes = [
        "application/pdf"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

module.exports = upload;