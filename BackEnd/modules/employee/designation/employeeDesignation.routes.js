const router = require("express").Router({ mergeParams: true });

const {
    assignDesignation,
    updateEmployeeDesignation,
    getEmployeeDesignations
} = require("./employeeDesignation.controller");

const {
    protect,
    restrictTo,
    checkPermission,
    checkEmployeeOrgScope,
    injectOrgScope
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];
router.use(protect);
router
    .route("/")
    .get(
        restrictTo(...ROLES),
        //checkPermission("DESIGNATION_VIEW"),
        injectOrgScope(),
        checkEmployeeOrgScope,
        getEmployeeDesignations
    )
    .post(
        restrictTo(...ROLES),
        //checkPermission("DESIGNATION_CREATE"),
        injectOrgScope(),
        checkEmployeeOrgScope,
        assignDesignation
    );
router
    .route("/:id")
    .put(
        restrictTo(...ROLES),
        //checkPermission("DESIGNATION_UPDATE"),
        injectOrgScope(),
        checkEmployeeOrgScope,
        updateEmployeeDesignation
    );

module.exports = router;