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

const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user.userId;

        const comment = await Comment.findOne({ where: { id, userId } });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or unauthorized' });
        }

        await comment.update({ text });

        const updatedComment = await Comment.findByPk(id, {
            include: [{ model: User, as: 'user', attributes: ['username'] }]
        });

        res.status(200).json(updatedComment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment', error: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        const comment = await Comment.findOne({ where: { id, userId } });
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or unauthorized' });
        }

        await comment.destroy();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};

module.exports = { getCommentsByBookId, addComment, updateComment, deleteComment };
