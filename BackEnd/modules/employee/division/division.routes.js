const router = require('express').Router();
const DivisionController = require('./division.controller');

const {
    protect,
    restrictTo,
    checkPermission,
} = require("../../../middlewares/authMiddleware");
const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);
router
    .route("/")
    .get(
        checkPermission("EMPLOYEE_DIV.READ"),
        DivisionController.findAll
    )
    .post(
        checkPermission("EMPLOYEE_DIV.CREATE"),
        DivisionController.create
    );

router
    .route("/:id")
    .get(
        checkPermission("EMPLOYEE_DIV.READ"),
        DivisionController.findById
    )
    .patch(
        checkPermission("EMPLOYEE_DIV.UPDATE"),
        DivisionController.update
    )
    .delete(
        checkPermission("EMPLOYEE_DIV.DELETE"),
        DivisionController.delete
    );

module.exports = router;
