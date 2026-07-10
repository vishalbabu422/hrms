const router = require("express").Router({ mergeParams: true });
const controller = require("./document.controller");
const {
    protect,
    restrictTo,
    checkPermission
} = require("../../../middlewares/authMiddleware");
const upload = require("../../../middlewares/documentUpload.middleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
    .route("/")
    .get(
        //restrictTo(...ROLES),
        //checkPermission("DOCUMENT.VIEW"),
        controller.getEmployeeDocuments
    )
    .post(
        //restrictTo(...ROLES),
        //checkPermission("DOCUMENT.CREATE"),
        upload.single("file"),
        controller.createDocument
    );

router
    .route("/:id")
    .get(
        //restrictTo(...ROLES),
        //checkPermission("DOCUMENT.VIEW"),
        controller.getDocument
    )
    .put(
        //restrictTo(...ROLES),
        //checkPermission("DOCUMENT.UPDATE"),
        controller.updateDocument
    )
    .delete(
        //restrictTo(...ROLES),
        //checkPermission("DOCUMENT.DELETE"),
        controller.deleteDocument
    );

router.get(
    "/:id/download",
    //checkPermission("DOCUMENT.VIEW"),
    controller.downloadDocument
);

module.exports = router;