const router = require("express").Router();
const { postComment, getComments } = require("../controllers/CommentController");
const { authenticateToken } = require("../middleware/authMiddleware");

router.post("/reviews/:reviewId/comments", authenticateToken, postComment);
router.get("/reviews/:reviewId/comments", getComments);

module.exports = router;