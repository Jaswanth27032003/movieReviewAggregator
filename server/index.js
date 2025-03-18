const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const user = require('./models/User');

// Load environment variables
dotenv.config();

// Clear Mongoose model cache to prevent redefinition during hot-reloading
mongoose.models = {};
mongoose.modelSchemas = {};

// Initialize Express app
const app = express();

// Middleware
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000', // Existing local dev origin
            'http://localhost:5000', // New local dev origin
            'https://movie-review-aggregator.vercel.app/', // Deployed frontend
            process.env.FRONTEND_URL || '', // Environment variable for flexibility
        ].filter(Boolean);

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin);
            callback(new Error(`Origin ${origin} not allowed by CORS`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
};
app.options('*', cors(corsOptions)); // Handle preflight requests for all routes
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');
const reviewRoutes = require('./routes/reviews');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Movie Review Aggregator API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect to MongoDB
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

// Set port
const PORT = process.env.PORT || 8000;

// Start server only after DB connection
const startServer = async () => {
    try {
        await connectDB();
        const server = app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Closing server...');
            server.close(async () => {
                console.log('Server closed. Disconnecting from MongoDB...');
                await mongoose.connection.close();
                console.log('MongoDB connection closed.');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            console.log('SIGINT received. Closing server...');
            server.close(async () => {
                console.log('Server closed. Disconnecting from MongoDB...');
                await mongoose.connection.close();
                console.log('MongoDB connection closed.');
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

// Start the server
startServer();
