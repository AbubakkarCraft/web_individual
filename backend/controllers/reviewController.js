const { Review, User, Book } = require('../models');

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: [
                { model: User, as: 'user', attributes: ['username'] },
                { model: Book, as: 'book', attributes: ['title', 'author'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

const getReviewsByBookId = async (req, res) => {
    try {
        const { bookId } = req.params;
        const reviews = await Review.findAll({
            where: { bookId },
            include: [{ model: User, as: 'user', attributes: ['username'] }],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews for book', error: error.message });
    }
};

const addReview = async (req, res) => {
    try {
        const { title, content, rating, recommend, bookId } = req.body;
        const userId = req.user.userId;

        const review = await Review.create({ title, content, rating, recommend, userId, bookId });

        const created = await Review.findByPk(review.id, {
            include: [{ model: User, as: 'user', attributes: ['username'] }, { model: Book, as: 'book', attributes: ['title'] }]
        });

        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: 'Error creating review', error: error.message });
    }
};

const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, rating, recommend } = req.body;
        const userId = req.user.userId;

        const review = await Review.findOne({ where: { id, userId } });
        if (!review) return res.status(404).json({ message: 'Review not found or unauthorized' });

        await review.update({ title, content, rating, recommend });

        const updated = await Review.findByPk(id, { include: [{ model: User, as: 'user', attributes: ['username'] }] });
        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const review = await Review.findOne({ where: { id, userId } });
        if (!review) return res.status(404).json({ message: 'Review not found or unauthorized' });

        await review.destroy();
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
};

module.exports = { getAllReviews, getReviewsByBookId, addReview, updateReview, deleteReview };
