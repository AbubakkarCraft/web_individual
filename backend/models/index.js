const User = require('./User');
const Book = require('./Book');
const Comment = require('./Comment');
const Wishlist = require('./Wishlist');
const Note = require('./Note');

// User <-> Comment
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

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

module.exports = { User, Book, Comment, Wishlist, Note };
