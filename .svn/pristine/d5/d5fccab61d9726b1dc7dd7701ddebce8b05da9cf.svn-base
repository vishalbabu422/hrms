const router = require('express').Router();
const auth = require('./authController');
const { protect } = require("../../middlewares/authMiddleware");

router.post('/login', auth.login);
router.post('/refresh', auth.refreshToken);
router.post("/logout", protect, auth.logout);
router.get("/me", protect, auth.getMe);

module.exports = router;

