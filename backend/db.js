const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/equipment_db');
        console.log('✅ MongoDB Connected Successfully');
        console.log('📊 Database: equipment_db');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;