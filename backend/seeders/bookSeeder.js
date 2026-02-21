const Book = require('../models/Book');
const { sequelize } = require('../database/db');

const seedBooks = async () => {
    const books = [
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            description: "A story of ambition and obsession in the Jazz Age.",
            coverImage: "https://m.media-amazon.com/images/I/81QuEGw8VPL._AC_UF1000,1000_QL80_.jpg",
            category: "Classic"
        },
        {
            title: "1984",
            author: "George Orwell",
            description: "A dystopian social science fiction novel and cautionary tale.",
            coverImage: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
            category: "Dystopian"
        },
        {
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            description: "A fantasy novel for children and adults alike.",
            coverImage: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
            category: "Fantasy"
        },
        {
            title: "Pride and Prejudice",
            author: "Jane Austen",
            description: "A romantic novel of manners written by Jane Austen.",
            coverImage: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
            category: "Romance"
        }
    ];

    try {
        await sequelize.authenticate();
        await Book.sync({ force: true });
        await Book.bulkCreate(books);
        console.log('Books seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding books:', error);
        process.exit(1);
    }
};

seedBooks();
