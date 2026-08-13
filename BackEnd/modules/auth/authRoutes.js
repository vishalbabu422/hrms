const router = require("express").Router();
const auth = require("./authController");
const { protect } = require("../../middlewares/authMiddleware");
const { checkSSOSession } = require("../../middlewares/ssoMiddleware");

router.post("/login", auth.login);
router.post("/ssoLogin", auth.ssoLogin);
router.post("/refresh", auth.refreshToken);
router.get("/config", auth.config);
router.post("/ssoLogout", protect, checkSSOSession, auth.ssoLogout);
router.post("/logout", protect, auth.logout);
router.get("/me", protect, checkSSOSession, auth.getMe);

module.exports = router;
