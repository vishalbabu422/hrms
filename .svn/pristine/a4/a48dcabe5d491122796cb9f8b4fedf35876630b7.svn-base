const router = require("express").Router();

const {
    createExamination,
    getAllExaminations,
    getExamination,
    updateExamination,
    deleteExamination
} = require("./examination.controller");

const {
    protect,
    restrictTo,
    checkPermission,
    injectOrgScope
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

router
    .route("/")
    .get(
        checkPermission("EMPLOYEE_EXA.READ"),
        injectOrgScope(),
        getAllExaminations
    )
    .post(
        checkPermission("EMPLOYEE_EXA.CREATE"),
        createExamination
    );

router
    .route("/:id")
    .get(
        checkPermission("EMPLOYEE_EXA.READ"),
        getExamination
    )
    .put(
        restrictTo(...ROLES),
        checkPermission("EMPLOYEE_EXA.UPDATE"),
        updateExamination
    )
    .delete(
        restrictTo(...ROLES),
        checkPermission("EMPLOYEE_EXA.DELETE"),
        deleteExamination
    );

module.exports = router;