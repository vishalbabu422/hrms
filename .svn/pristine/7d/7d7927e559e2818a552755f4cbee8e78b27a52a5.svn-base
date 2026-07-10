const multer = require("multer");
const path = require("path");
const fs = require("fs");

const createUpload = ({
    folder,
    paramName = null,
    allowedTypes = [],
    filePrefix = "FILE",
    maxSize = 5 * 1024 * 1024
}) => {

    const storage = multer.diskStorage({

        destination: (req, file, cb) => {

            let uploadPath = path.join("uploads", folder);

            if (paramName) {

                const id = req.params[paramName];

                if (!id) {
                    return cb(
                        new Error(`${paramName} is required in route params`),
                        null
                    );
                }

                uploadPath = path.join(uploadPath, String(id));
            }

            fs.mkdirSync(uploadPath, { recursive: true });

            cb(null, uploadPath);
        },

        filename: (req, file, cb) => {

            const ext = path.extname(file.originalname);

            let fileName = filePrefix + '_' + Date.now() + ext;

            if (paramName) {

                const id = req.params[paramName];

                fileName = filePrefix + "_" + id + Date.now() + ext;
            }

            cb(null, fileName);
        }

    });

    const fileFilter = (req, file, cb) => {

        if (
            allowedTypes.length === 0 ||
            allowedTypes.includes(file.mimetype)
        ) {
            return cb(null, true);
        }

        cb(new Error("Invalid file type"), false);
    };

    return multer({
        storage,
        fileFilter,
        limits: {
            fileSize: maxSize
        }
    });

};

module.exports = createUpload;