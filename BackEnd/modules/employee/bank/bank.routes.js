const router = require('express').Router({ mergeParams: true });

const BankController = require('./bank.controller');

const {
    protect,
    restrictTo
} = require("../../../middlewares/authMiddleware");
const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];
router.use(protect);
router
    .route("/")
    .get(
        protect,
        restrictTo(...ROLES),
        //checkPermission("EMPLOYEE_VIEW"),
        // injectOrgScope(),
        BankController.getBankById
    )
    .post(
         restrictTo(...ROLES),
         //checkPermission("DESIGNATION_CREATE"),
         //injectOrgScope(),
         BankController.assignBank
    )
    .patch(
           restrictTo(...ROLES),
           BankController.updateBank
            );
     module.exports = router;   