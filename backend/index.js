const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB, sequelize } = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

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

app.get('/', (req, res) => {
    res.send('BookHive API is running...');
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
