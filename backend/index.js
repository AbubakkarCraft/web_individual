const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { User, Book, Comment } = require('./models/index');
const { connectDB, sequelize } = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const commentRoutes = require('./routes/commentRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes');
const progressRoutes = require('./routes/progressRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Connect and Sync DB
connectDB();
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced (with alter: true)');
}).catch(err => {
    console.error('Failed to sync database:', err);
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.send('BookHive API is running...');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
