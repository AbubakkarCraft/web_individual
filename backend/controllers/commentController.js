const { Comment, User } = require('../models');

const getCommentsByBookId = async (req, res) => {
    try {
        const { bookId } = req.params;
        const comments = await Comment.findAll({
            where: { bookId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username']
                }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { bookId, text } = req.body;
        const userId = req.user.userId;

        const comment = await Comment.create({
            text,
            userId,
            bookId
        });

        const commentWithUser = await Comment.findByPk(comment.id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username']
                }
            ]
        });

        res.status(201).json(commentWithUser);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

module.exports = { getCommentsByBookId, addComment };
