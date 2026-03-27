const router = require("express").Router();
const { postVote, getUserVote } = require("../controllers/VotesController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/reviews/:reviewId/vote", authenticateToken, postVote);
router.get("/reviews/:reviewId/my-vote", authenticateToken, getUserVote);

module.exports = router;