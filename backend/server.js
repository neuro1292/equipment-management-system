const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

// Import routes
const equipmentRoutes = require('./routes/equipment');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/equipment', equipmentRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Equipment Management System API',
        version: '1.0.0',
        endpoints: {
            getAllEquipment: 'GET /api/equipment',
            addEquipment: 'POST /api/equipment',
            getSummary: 'GET /api/equipment/report/summary',
            getEquipment: 'GET /api/equipment/:id'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}/api/equipment`);
});