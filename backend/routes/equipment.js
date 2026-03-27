const express = require('express');
const router = express.Router();
const Equipment = require('../models/equipment');

// @route   GET /api/equipment
// @desc    Get all equipment
router.get('/', async (req, res) => {
    try {
        const equipment = await Equipment.find().sort({ createdAt: -1 });
        res.json({ success: true, data: equipment });
    } catch (error) {
        console.error('Error fetching equipment:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/equipment/:id
// @desc    Get single equipment
router.get('/:id', async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        res.json({ success: true, data: equipment });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/equipment
// @desc    Add new equipment
router.post('/', async (req, res) => {
    try {
        const count = await Equipment.countDocuments();
        req.body.equipmentId = 'EQ' + String(count + 1).padStart(4, '0');
        
        const equipment = new Equipment(req.body);
        await equipment.save();
        
        res.status(201).json({ success: true, data: equipment });
    } catch (error) {
        console.error('Error saving equipment:', error);
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/equipment/:id
// @desc    Update equipment
router.put('/:id', async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        res.json({ success: true, data: equipment });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/equipment/:id
// @desc    Delete equipment
router.delete('/:id', async (req, res) => {
    try {
        const equipment = await Equipment.findByIdAndDelete(req.params.id);
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        res.json({ success: true, message: 'Equipment deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/equipment/report/summary
// @desc    Get equipment summary report
router.get('/report/summary', async (req, res) => {
    try {
        const equipment = await Equipment.find();
        const today = new Date();
        
        const summary = {
            total: equipment.length,
            active: equipment.filter(e => e.status === 'Active').length,
            underMaintenance: equipment.filter(e => e.status === 'Under Maintenance').length,
            exchanged: equipment.filter(e => e.status === 'Exchange').length,
            scrapped: equipment.filter(e => e.status === 'Scrapped').length,
            warrantyActive: equipment.filter(e => new Date(e.warrantyEnd) > today).length,
            warrantyExpiring: equipment.filter(e => {
                const end = new Date(e.warrantyEnd);
                const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
                return diffDays > 0 && diffDays <= 30;
            }).length,
            warrantyExpired: equipment.filter(e => new Date(e.warrantyEnd) <= today).length,
            totalValue: equipment.reduce((sum, e) => sum + e.amount, 0),
            byCategory: equipment.reduce((acc, e) => {
                acc[e.category] = (acc[e.category] || 0) + 1;
                return acc;
            }, {})
        };
        
        res.json({ success: true, data: summary });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/equipment/:id/exchange
// @desc    Add exchange history
router.post('/:id/exchange', async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        equipment.exchangeHistory.push(req.body);
        equipment.status = 'Exchange';
        await equipment.save();
        res.json({ success: true, data: equipment });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   POST /api/equipment/:id/parts
// @desc    Add parts replacement
router.post('/:id/parts', async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        equipment.partsReplacement.push(req.body);
        await equipment.save();
        res.json({ success: true, data: equipment });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

// @route   POST /api/equipment/:id/gatepass
// @desc    Add gate pass
router.post('/:id/gatepass', async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        const gatePassNumber = 'GP' + Date.now();
        equipment.gatePass.push({ ...req.body, gatePassNumber });
        await equipment.save();
        res.json({ success: true, data: equipment });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
});

module.exports = router;