const multer = require("multer");
const path = require("path");
const fs = require("fs");

const MAX_FILE_SIZE_MB = Number(process.env.MAX_FILE_SIZE_MB || 5);
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

const createUpload = ({
    folder,
    fieldName = "file",
    paramName = null,
    allowedTypes = [],
    filePrefix = "FILE",
    fileTypeMessage = "Invalid file type"
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

                uploadPath = path.join(
                    uploadPath,
                    String(id)
                );
            }

            fs.mkdirSync(uploadPath, {
                recursive: true
            });

            cb(null, uploadPath);
        },

        filename: (req, file, cb) => {

            const ext = path.extname(file.originalname);

            let fileName =
                filePrefix + "_" + Date.now() + ext;

            if (paramName) {

                const id = req.params[paramName];

                fileName =filePrefix +"_" +id +"_" +Date.now() +ext;
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

        cb(
            new Error(fileTypeMessage),
            false
        );
    };


    const upload = multer({

        storage,
        fileFilter,
        limits: {
            fileSize: MAX_FILE_SIZE
        }
    });


    // Custom upload middleware
    return (req, res, next) => {

        upload.single(fieldName)(
            req,res,(err) => {

                // Multer errors
                if (err instanceof multer.MulterError) {

                    if (err.code === "LIMIT_FILE_SIZE") {

                        return res.status(400).json({
                            status: "fail",
                            message:
                                `File size must not exceed ${MAX_FILE_SIZE_MB} MB`
                        });
                    }

                    return res.status(400).json({
                        status: "fail",
                        message: err.message
                    });
                }


                // Other errors
                if (err) {

                    return res.status(400).json({
                        status: "fail",
                        message: err.message
                    });
                }


                // Upload successful
                next();
            }
        );
    };
};

module.exports = createUpload;