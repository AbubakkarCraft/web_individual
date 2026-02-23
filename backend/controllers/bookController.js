const { Book, Rating, sequelize } = require('../models');

const getBooks = async (req, res) => {
    try {
        const books = await Book.findAll({
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT AVG(score)
                            FROM "Ratings" AS "Rating"
                            WHERE
                                "Rating"."bookId" = "Book"."id"
                        )`),
                        'averageRating'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM "Ratings" AS "Rating"
                            WHERE
                                "Rating"."bookId" = "Book"."id"
                        )`),
                        'ratingCount'
                    ]
                ]
            }
        });
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error: error.message });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            attributes: {
                include: [
                    [
                        sequelize.literal(`(
                            SELECT AVG(score)
                            FROM "Ratings" AS "Rating"
                            WHERE
                                "Rating"."bookId" = "Book"."id"
                        )`),
                        'averageRating'
                    ],
                    [
                        sequelize.literal(`(
                            SELECT COUNT(*)
                            FROM "Ratings" AS "Rating"
                            WHERE
                                "Rating"."bookId" = "Book"."id"
                        )`),
                        'ratingCount'
                    ]
                ]
            }
        });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details', error: error.message });
    }
};

module.exports = { getBooks, getBookById };
