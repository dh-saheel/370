const router = require("express").Router();
const { authenticateToken } = require("../middleware/authMiddleware");
const { getProfile, getMyReviews } = require("../controllers/UserController");

router.get("/me", authenticateToken, getProfile);
router.get("/me/reviews", authenticateToken, getMyReviews);

module.exports = router;
