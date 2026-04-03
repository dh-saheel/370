const UserModel = require("../models/UserModel");

const getProfile = async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
};

const getMyReviews = async (req, res) => {
    const reviews = await UserModel.findReviewsByUser(req.user.id);
    res.status(200).json(reviews);
};

module.exports = { getProfile, getMyReviews };
