const express = require("express");
const router = express.Router();

const modulesController = require("./module.controller");

const { protect, restrictTo } = require("../../middlewares/authMiddleware");
const { checkSSOSession } = require("../../middlewares/ssoMiddleware");

const ROLES = ["ORG_ADMIN", "SUPER_ADMIN"];

// Protect all routes
router.use(checkSSOSession);
router.use(protect);

// GET ALL MODULES
router.get("/", restrictTo(...ROLES), modulesController.getAllModules);

module.exports = router;
