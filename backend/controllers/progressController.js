const { ReadingProgress, Book } = require('../models');

const updateProgress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bookId, currentPage } = req.body;

        let progress = await ReadingProgress.findOne({
            where: { userId, bookId }
        });

        if (progress) {
            await progress.update({ currentPage, lastRead: new Date() });
        } else {
            progress = await ReadingProgress.create({
                userId,
                bookId,
                currentPage,
                lastRead: new Date()
            });
        }

        res.status(200).json(progress);
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error: error.message });
    }
};

const getProgress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bookId } = req.params;

        const progress = await ReadingProgress.findOne({
            where: { userId, bookId }
        });

        res.status(200).json(progress || { currentPage: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching progress', error: error.message });
    }
};

const getAllProgress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const progressList = await ReadingProgress.findAll({
            where: { userId },
            include: [{
                model: Book,
                as: 'book',
                required: true // This ensures only records with an existing book are returned
            }],
            order: [['lastRead', 'DESC']]
        });
        res.status(200).json(progressList);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all progress', error: error.message });
    }
};

module.exports = { updateProgress, getProgress, getAllProgress };
