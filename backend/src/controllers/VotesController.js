const VotesModel = require("../models/VotesModel");

const postVote = async (req, res) => {
    try {
        const { isLike, isUndo } = req.body;
        const userId = req.user.id;
        const reviewId = req.params.reviewId;
        if (isUndo) {
            await VotesModel.deleteVote(userId, reviewId);
            return res.status(200).json({ message: "Vote removed" });
        }
        else {
            await VotesModel.insertVote(userId, reviewId, isLike);
        }
        res.status(201).json({ message: "Vote posted successfully" });
    } catch (err) {
        console.error("Error posting vote:", err);
        res.status(500).json({ error: "An error occurred while posting the vote." });
    }
        
};

const getUserVote = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    try {
        const vote = await VotesModel.getUserVote(reviewId, userId);
        if (!vote) {
            return res.json({ isLike: null });
        }
        res.json({ isLike: vote.is_like });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { postVote, getUserVote };