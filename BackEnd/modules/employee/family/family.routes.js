const router = require('express').Router({ mergeParams: true });

const FamilyController = require('./family.controller');

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
        FamilyController.getFamilyById
    )
    .post(
            restrictTo(...ROLES),
            //checkPermission("DESIGNATION_CREATE"),
            //injectOrgScope(),
            FamilyController.assignFamilyMember
    
        );

    router
        .route("/:familyMemberId")
        .patch(
            restrictTo(...ROLES),
            FamilyController.updateFamilyMember
        )
        .delete(
            restrictTo(...ROLES),
            FamilyController.deleteFamilyMember
        );    
    module.exports = router;