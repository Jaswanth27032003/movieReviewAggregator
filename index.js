const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

dotenv.config();

mongoose.models = {};
mongoose.modelSchemas = {};

const app = express();

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'https://movie-review-aggregator.vercel.app/',
            process.env.FRONTEND_URL || '', // Fallback to empty string if undefined
        ].filter(Boolean);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Explicitly include OPTIONS
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies or Authorization headers
    optionsSuccessStatus: 200, // Some legacy browsers (IE) require 200 for OPTIONS
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight requests for all routes

app.use(express.json());

const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');
const watchlistRoutes = require('./routes/watchlist');

app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/watchlist', watchlistRoutes);

// Middleware to log requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});

app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error('Login error:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ username, email: email.toLowerCase(), password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error('Registration error:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

app.get('/api/auth/validate', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        res.status(200).json({
            user: {
                id: user._id.toString(),
                email: user.email,
                username: user.username,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error('Token validation error:', {
            message: error.message,
            stack: error.stack,
        });
        res.status(401).json({ message: 'Invalid or expired token', error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Movie Review Aggregator API is running');
});

app.use((err, req, res, next) => {
    console.error('Server error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', {
            message: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
};

const PORT = process.env.PORT || 8000;

const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        process.on('SIGTERM', () => {
            server.close(async () => {
                await mongoose.connection.close();
                console.log('Server and MongoDB connection closed');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            server.close(async () => {
                await mongoose.connection.close();
                console.log('Server and MongoDB connection closed');
                process.exit(0);
            });
        });
    } catch (error) {
        console.error('Failed to start server:', {
            message: error.message,
            stack: error.stack,
        });
        process.exit(1);
    }
};

startServer();