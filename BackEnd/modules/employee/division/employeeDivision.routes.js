const router = require("express").Router({ mergeParams: true });

const {
    assignDivision,
    updateEmployeeDivision,
    getEmployeeDivisions
} = require("./employeeDivision.controller");

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
        //checkPermission("EMPLOYEE_DIVISION_VIEW"),
        injectOrgScope(),
        checkEmployeeOrgScope,
        getEmployeeDivisions
    )
    .post(
        restrictTo(...ROLES),
        //checkPermission("EMPLOYEE_DIVISION_CREATE"),
        injectOrgScope(),
        checkEmployeeOrgScope,
        assignDivision
    );

router
    .route("/:id")
    .put(
        restrictTo(...ROLES),
        //checkPermission("EMPLOYEE_DIVISION_UPDATE"),
        injectOrgScope(),
        checkEmployeeOrgScope,
        updateEmployeeDivision
    );

module.exports = router;