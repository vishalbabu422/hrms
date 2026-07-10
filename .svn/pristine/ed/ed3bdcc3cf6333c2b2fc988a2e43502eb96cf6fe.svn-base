const express = require("express");
const router = express.Router();

const modulesController = require("./module.controller");

const { protect, restrictTo } = require("../../middlewares/authMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

// Protect all routes
router.use(protect);

// GET ALL MODULES
router.get(
    "/",
    restrictTo(...ROLES),
    modulesController.getAllModules
);



module.exports = router;