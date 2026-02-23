const { User, Wishlist, Note, Comment } = require('../models');

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Fetch stats
        const wishlistCount = await Wishlist.count({ where: { userId } });
        const notesCount = await Note.count({ where: { userId } });
        const commentsCount = await Comment.count({ where: { userId } });

        res.status(200).json({
            user,
            stats: {
                wishlistCount,
                notesCount,
                commentsCount
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { bio, avatarUrl, username } = req.body;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.update({
            bio: bio !== undefined ? bio : user.bio,
            avatarUrl: avatarUrl !== undefined ? avatarUrl : user.avatarUrl,
            username: username !== undefined ? username : user.username
        });

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};

module.exports = { getProfile, updateProfile };
