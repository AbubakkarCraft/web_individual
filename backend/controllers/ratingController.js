const { Rating, sequelize } = require('../models');

const submitRating = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bookId, score } = req.body;

        if (score < 1 || score > 5) {
            return res.status(400).json({ message: 'Score must be between 1 and 5' });
        }

        let rating = await Rating.findOne({
            where: { userId, bookId }
        });

        if (rating) {
            await rating.update({ score });
            res.status(200).json({ message: 'Rating updated', rating });
        } else {
            rating = await Rating.create({
                userId,
                bookId,
                score
            });
            res.status(201).json({ message: 'Rating submitted', rating });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error submitting rating', error: error.message });
    }
};

const getBookRatings = async (req, res) => {
    try {
        const { bookId } = req.params;

        const result = await Rating.findAll({
            where: { bookId },
            attributes: [
                [sequelize.fn('AVG', sequelize.col('score')), 'averageRating'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'ratingCount']
            ],
            raw: true
        });

        const stats = result[0];
        res.status(200).json({
            averageRating: parseFloat(stats.averageRating) || 0,
            ratingCount: parseInt(stats.ratingCount) || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ratings', error: error.message });
    }
};

const getUserRating = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bookId } = req.params;

        const rating = await Rating.findOne({
            where: { userId, bookId }
        });

        res.status(200).json(rating || { score: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user rating', error: error.message });
    }
};

module.exports = { submitRating, getBookRatings, getUserRating };
