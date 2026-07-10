const router = require("express").Router({ mergeParams: true });

const {
    assignExam,
    getEmployeeExams,
    updateEmployeeExam
} = require("./employeeExamination.controller");

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
        //checkPermission("EMPLOYEE_EXAM_VIEW"),
        injectOrgScope(),
        checkEmployeeOrgScope,
        getEmployeeExams
    )
    .post(
        restrictTo(...ROLES),
        //checkPermission("EMPLOYEE_EXAM_CREATE"),
        injectOrgScope(),
        checkEmployeeOrgScope,
        assignExam
    );

router
    .route("/:id")
    .put(
        restrictTo(...ROLES),
        //checkPermission("EMPLOYEE_EXAM_UPDATE"),
        injectOrgScope(),
        checkEmployeeOrgScope,
        updateEmployeeExam
    );

module.exports = router;