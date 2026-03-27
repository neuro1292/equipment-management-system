const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    equipmentId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Diagnostic', 'Surgical', 'ICU', 'OT', 'Imaging', 'Patient Care', 'Lab', 'Others']
    },
    model: {
        type: String,
        required: true
    },
    serialNumber: {
        type: String,
        required: true,
        unique: true
    },
    manufacturer: {
        type: String,
        required: true
    },
    supplier: {
        type: String,
        required: true
    },
    purchaseDate: {
        type: Date,
        required: true
    },
    warrantyStart: {
        type: Date,
        required: true
    },
    warrantyEnd: {
        type: Date,
        required: true
    },
    invoiceNumber: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Under Maintenance', 'Exchange', 'Scrapped'],
        default: 'Active'
    },
    exchangeHistory: [{
        exchangeDate: { type: Date, default: Date.now },
        oldEquipmentId: String,
        newEquipmentId: String,
        reason: String,
        cost: Number,
        vendor: String
    }],
    partsReplacement: [{
        partName: String,
        partNumber: String,
        replacementDate: { type: Date, default: Date.now },
        reason: String,
        cost: Number,
        replacedBy: String
    }],
    gatePass: [{
        gatePassNumber: String,
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['Incoming', 'Outgoing'] },
        itemName: String,
        quantity: Number,
        purpose: String,
        issuedTo: String,
        approvedBy: String
    }],
    maintenanceLog: [{
        date: { type: Date, default: Date.now },
        type: String,
        description: String,
        cost: Number,
        performedBy: String
    }]
}, {
    timestamps: true
});

// Indexes for better query performance
equipmentSchema.index({ equipmentId: 1 });
equipmentSchema.index({ serialNumber: 1 });
equipmentSchema.index({ status: 1 });
equipmentSchema.index({ warrantyEnd: 1 });

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;