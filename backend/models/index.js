const User = require('./User');
const Book = require('./Book');
const Comment = require('./Comment');
const Wishlist = require('./Wishlist');
const Note = require('./Note');
const ReadingProgress = require('./ReadingProgress');
const Rating = require('./Rating');

const { sequelize } = require('../database/db');

// User <-> Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ... (skipping for brevety in my head, but I'll make sure the target content matches)

// Book <-> Comment
Book.hasMany(Comment, { foreignKey: 'bookId', as: 'comments' });
Comment.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// User <-> Wishlist
User.hasMany(Wishlist, { foreignKey: 'userId', as: 'wishlist' });
Wishlist.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Book <-> Wishlist
Book.hasMany(Wishlist, { foreignKey: 'bookId', as: 'wishlist' });
Wishlist.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// User <-> Note
User.hasMany(Note, { foreignKey: 'userId', as: 'notes' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Book <-> Note
Book.hasMany(Note, { foreignKey: 'bookId', as: 'notes' });
Note.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// User <-> ReadingProgress
User.hasMany(ReadingProgress, { foreignKey: 'userId', as: 'readingProgress' });
ReadingProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Book <-> ReadingProgress
Book.hasMany(ReadingProgress, { foreignKey: 'bookId', as: 'readingProgress' });
ReadingProgress.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

// User <-> Rating
User.hasMany(Rating, { foreignKey: 'userId', as: 'ratings' });
Rating.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Book <-> Rating
Book.hasMany(Rating, { foreignKey: 'bookId', as: 'ratings' });
Rating.belongsTo(Book, { foreignKey: 'bookId', as: 'book' });

module.exports = { User, Book, Comment, Wishlist, Note, ReadingProgress, Rating, sequelize };
