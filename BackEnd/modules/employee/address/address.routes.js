const router = require('express').Router({ mergeParams: true });

const AddressController = require('./address.controller');

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
        AddressController.getAddressById
    )
    .post(
        restrictTo(...ROLES),
        //checkPermission("DESIGNATION_CREATE"),
        //injectOrgScope(),
        AddressController.assignAddress

    );

router
    .route("/:addressId")
    .patch(
        restrictTo(...ROLES),
        AddressController.updateAddress
    )
    .delete(
        restrictTo(...ROLES),
        AddressController.deleteAddress
    );

module.exports = router;

