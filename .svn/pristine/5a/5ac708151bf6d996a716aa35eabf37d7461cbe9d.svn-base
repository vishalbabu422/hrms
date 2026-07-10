const router = require('express').Router();
const DesignationController = require('./designation.controller');

const {
    protect,
    restrictTo,
    checkPermission,
    checkOrgScope,
    injectOrgScope
} = require("../../../middlewares/authMiddleware");
const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);
router
    .route("/")
    .get(
        injectOrgScope(),
        checkPermission("EMPLOYEE_DES.READ"),
        DesignationController.findAll
    )
    .post(
        checkPermission("EMPLOYEE_DES.CREATE"),
        DesignationController.create
    );

router
    .route("/:id")
    .get(
        checkPermission("EMPLOYEE_DES.READ"),
        injectOrgScope(),
        DesignationController.findById
    )
    .patch(
        checkPermission("EMPLOYEE_DES.UPDATE"),
        DesignationController.update
    )
    .delete(
        checkPermission("EMPLOYEE_DES.DELETE"),
        DesignationController.delete
    );

module.exports = router;
