const router = require("express").Router();

const EmployeeSalaryAddonController = require(
  "./employeeSalaryAddon.controller"
);

const {
  protect,
  restrictTo,
} = require("../../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

router.use(protect);

// Get List
router
  .route("/index")
  .get(
    restrictTo(...ROLES),
    EmployeeSalaryAddonController.index
  );

// Create
router
  .route("/create")
  .post(
    restrictTo(...ROLES),
    EmployeeSalaryAddonController.create
  );

// Update
router
  .route("/edit/:id")
  .patch(
    restrictTo(...ROLES),
    EmployeeSalaryAddonController.edit
  );

// Delete
router
  .route("/delete/:id")
  .delete(
    restrictTo(...ROLES),
    EmployeeSalaryAddonController.deleteById
  );

// Get By ID
router
  .route("/:id")
  .get(
    restrictTo(...ROLES),
    EmployeeSalaryAddonController.dataById
  );

module.exports = router;