const CommentModel = require('../models/CommentModel');

const postComment = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const userId = req.user.id;
        const { content } = req.body;
        const newComment = await CommentModel.insertComment(userId, reviewId, content);
        res.status(201).json(newComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while posting the comment." });
    }
};

const getComments = async (req, res) => {
    try {
        const reviewId = req.params.reviewId;
        const comments = await CommentModel.getComments(reviewId);
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred while fetching comments." });
    }
};

module.exports = { postComment, getComments };