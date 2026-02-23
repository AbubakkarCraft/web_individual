const { Wishlist, Book } = require('../models');

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.userId;
        const wishlist = await Wishlist.findAll({
            where: { userId },
            include: [
                {
                    model: Book,
                    as: 'book',
                    attributes: ['id', 'title', 'author', 'coverImage', 'category']
                }
            ]
        });
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
    }
};

const toggleWishlist = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.userId;

        const existingItem = await Wishlist.findOne({
            where: { userId, bookId }
        });

        if (existingItem) {
            await existingItem.destroy();
            return res.status(200).json({ message: 'Removed from wishlist', saved: false });
        }

        const newItem = await Wishlist.create({ userId, bookId });
        res.status(201).json({ message: 'Added to wishlist', newItem, saved: true });
    } catch (error) {
        res.status(500).json({ message: 'Error toggling wishlist', error: error.message });
    }
};

module.exports = { getWishlist, toggleWishlist };
