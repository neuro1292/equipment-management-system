import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EquipmentManagement.css';

function EquipmentManagement() {
    const [equipment, setEquipment] = useState([]);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [showExchangeForm, setShowExchangeForm] = useState(false);
    const [showPartsForm, setShowPartsForm] = useState(false);
    const [showGatePassForm, setShowGatePassForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        model: '',
        serialNumber: '',
        manufacturer: '',
        supplier: '',
        purchaseDate: '',
        warrantyStart: '',
        warrantyEnd: '',
        invoiceNumber: '',
        amount: '',
        location: '',
        department: '',
        status: 'Active'
    });

    const [exchangeData, setExchangeData] = useState({
        oldEquipmentId: '',
        newEquipmentId: '',
        reason: '',
        cost: '',
        vendor: ''
    });

    const [partsData, setPartsData] = useState({
        partName: '',
        partNumber: '',
        reason: '',
        cost: '',
        replacedBy: ''
    });

    const [gatePassData, setGatePassData] = useState({
        type: 'Incoming',
        itemName: '',
        quantity: '',
        purpose: '',
        issuedTo: '',
        approvedBy: ''
    });

    const API_URL = 'http://localhost:5001/api/equipment';

    useEffect(() => {
        fetchEquipment();
        fetchSummary();
    }, []);

    const fetchEquipment = async () => {
        try {
            const response = await axios.get(API_URL);
            if (response.data.success) {
                setEquipment(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching equipment:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await axios.get(`${API_URL}/report/summary`);
            if (response.data.success) {
                setSummary(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching summary:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleExchangeChange = (e) => {
        setExchangeData({ ...exchangeData, [e.target.name]: e.target.value });
    };

    const handlePartsChange = (e) => {
        setPartsData({ ...partsData, [e.target.name]: e.target.value });
    };

    const handleGatePassChange = (e) => {
        setGatePassData({ ...gatePassData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_URL, formData);
            if (response.data.success) {
                fetchEquipment();
                fetchSummary();
                setShowForm(false);
                setFormData({
                    name: '', category: '', model: '', serialNumber: '', manufacturer: '',
                    supplier: '', purchaseDate: '', warrantyStart: '', warrantyEnd: '',
                    invoiceNumber: '', amount: '', location: '', department: '', status: 'Active'
                });
                alert('✅ Equipment added successfully!');
            }
        } catch (error) {
            console.error('Error saving equipment:', error);
            alert('❌ Error saving equipment');
        }
    };

    const addExchange = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/${id}/exchange`, exchangeData);
            if (response.data.success) {
                fetchEquipment();
                setShowExchangeForm(false);
                setExchangeData({
                    oldEquipmentId: '', newEquipmentId: '', reason: '', cost: '', vendor: ''
                });
                alert('✅ Exchange history added!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error adding exchange');
        }
    };

    const addParts = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/${id}/parts`, partsData);
            if (response.data.success) {
                fetchEquipment();
                setShowPartsForm(false);
                setPartsData({
                    partName: '', partNumber: '', reason: '', cost: '', replacedBy: ''
                });
                alert('✅ Parts replacement added!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error adding parts');
        }
    };

    const addGatePass = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/${id}/gatepass`, gatePassData);
            if (response.data.success) {
                fetchEquipment();
                setShowGatePassForm(false);
                setGatePassData({
                    type: 'Incoming', itemName: '', quantity: '', purpose: '', issuedTo: '', approvedBy: ''
                });
                alert('✅ Gate pass added!');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error adding gate pass');
        }
    };

    if (loading) return <div className="loading">📡 Loading Equipment Data...</div>;

    return (
        <div className="equipment-container">
            <div className="equipment-header">
                <h1>🏥 Equipment Management System</h1>
                <div className="header-actions">
                    <button className="btn-add" onClick={() => setShowForm(!showForm)}>
                        {showForm ? '✖ Close' : '+ Add Equipment'}
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            {summary && (
                <div className="stats-cards">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div><h3>Total Equipment</h3><p className="stat-number">{summary.total}</p></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div><h3>Active</h3><p className="stat-number">{summary.active}</p></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔧</div>
                        <div><h3>Maintenance</h3><p className="stat-number">{summary.underMaintenance}</p></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔄</div>
                        <div><h3>Exchanged</h3><p className="stat-number">{summary.exchanged}</p></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🛡️</div>
                        <div><h3>Warranty Active</h3><p className="stat-number">{summary.warrantyActive}</p></div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div><h3>Total Value</h3><p className="stat-number">रु. {summary.totalValue?.toLocaleString()}</p></div>
                    </div>
                </div>
            )}

            {/* Add Equipment Form */}
            {showForm && (
                <div className="equipment-form">
                    <h2>➕ Add New Equipment</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <div className="form-group"><label>Equipment Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Category *</label><select name="category" value={formData.category} onChange={handleChange} required><option value="">Select</option><option value="Diagnostic">Diagnostic</option><option value="Surgical">Surgical</option><option value="ICU">ICU</option><option value="OT">OT</option><option value="Imaging">Imaging</option><option value="Patient Care">Patient Care</option><option value="Lab">Lab</option></select></div>
                            <div className="form-group"><label>Model *</label><input type="text" name="model" value={formData.model} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Serial Number *</label><input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Manufacturer *</label><input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Supplier *</label><input type="text" name="supplier" value={formData.supplier} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Purchase Date *</label><input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Warranty Start *</label><input type="date" name="warrantyStart" value={formData.warrantyStart} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Warranty End *</label><input type="date" name="warrantyEnd" value={formData.warrantyEnd} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Invoice Number *</label><input type="text" name="invoiceNumber" value={formData.invoiceNumber} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Amount (NPR) *</label><input type="number" name="amount" value={formData.amount} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Location *</label><input type="text" name="location" value={formData.location} onChange={handleChange} required /></div>
                            <div className="form-group"><label>Department *</label><input type="text" name="department" value={formData.department} onChange={handleChange} required /></div>
                        </div>
                        <button type="submit" className="btn-submit">💾 Save Equipment</button>
                    </form>
                </div>
            )}

            {/* Equipment Table */}
            <div className="equipment-table-container">
                <table className="equipment-table">
                    <thead>
                        <tr>
                            <th>ID</th><th>Equipment Name</th><th>Category</th><th>Model</th><th>Serial No</th><th>Status</th><th>Warranty</th><th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipment.map(item => {
                            const isWarrantyExpiring = new Date(item.warrantyEnd) <= new Date(Date.now() + 30*24*60*60*1000);
                            const isWarrantyExpired = new Date(item.warrantyEnd) <= new Date();
                            return (
                                <tr key={item._id}>
                                    <td><strong>{item.equipmentId}</strong></td>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.model}</td>
                                    <td>{item.serialNumber}</td>
                                    <td><span className={`status-badge ${item.status.toLowerCase().replace(/\s/g, '-')}`}>{item.status}</span></td>
                                    <td>
                                        <span className={`warranty-badge ${isWarrantyExpired ? 'expired' : isWarrantyExpiring ? 'expiring' : 'active'}`}>
                                            {isWarrantyExpired ? 'Expired' : isWarrantyExpiring ? 'Expiring Soon' : 'Active'}
                                        </span>
                                        <small>{new Date(item.warrantyEnd).toLocaleDateString()}</small>
                                    </td>
                                    <td className="action-buttons">
                                        <button className="btn-view" title="View Details" onClick={() => setSelectedEquipment(item)}>👁️</button>
                                        <button className="btn-exchange" title="Exchange History" onClick={() => { setSelectedEquipment(item); setShowExchangeForm(true); }}>🔄</button>
                                        <button className="btn-parts" title="Parts Replacement" onClick={() => { setSelectedEquipment(item); setShowPartsForm(true); }}>🔧</button>
                                        <button className="btn-gatepass" title="Gate Pass" onClick={() => { setSelectedEquipment(item); setShowGatePassForm(true); }}>📦</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal for View Details */}
            {selectedEquipment && !showExchangeForm && !showPartsForm && !showGatePassForm && (
                <div className="modal" onClick={() => setSelectedEquipment(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📋 Equipment Details</h2>
                            <button className="modal-close" onClick={() => setSelectedEquipment(null)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-grid">
                                <div><strong>Equipment ID:</strong> {selectedEquipment.equipmentId}</div>
                                <div><strong>Name:</strong> {selectedEquipment.name}</div>
                                <div><strong>Category:</strong> {selectedEquipment.category}</div>
                                <div><strong>Model:</strong> {selectedEquipment.model}</div>
                                <div><strong>Serial No:</strong> {selectedEquipment.serialNumber}</div>
                                <div><strong>Manufacturer:</strong> {selectedEquipment.manufacturer}</div>
                                <div><strong>Supplier:</strong> {selectedEquipment.supplier}</div>
                                <div><strong>Purchase Date:</strong> {new Date(selectedEquipment.purchaseDate).toLocaleDateString()}</div>
                                <div><strong>Warranty:</strong> {new Date(selectedEquipment.warrantyStart).toLocaleDateString()} - {new Date(selectedEquipment.warrantyEnd).toLocaleDateString()}</div>
                                <div><strong>Amount:</strong> रु. {selectedEquipment.amount}</div>
                                <div><strong>Location:</strong> {selectedEquipment.location}</div>
                                <div><strong>Department:</strong> {selectedEquipment.department}</div>
                                <div><strong>Status:</strong> {selectedEquipment.status}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Exchange History Modal */}
            {showExchangeForm && selectedEquipment && (
                <div className="modal" onClick={() => setShowExchangeForm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🔄 Add Exchange History - {selectedEquipment.name}</h2>
                            <button className="modal-close" onClick={() => setShowExchangeForm(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group"><label>Old Equipment ID</label><input type="text" name="oldEquipmentId" value={exchangeData.oldEquipmentId} onChange={handleExchangeChange} /></div>
                            <div className="form-group"><label>New Equipment ID</label><input type="text" name="newEquipmentId" value={exchangeData.newEquipmentId} onChange={handleExchangeChange} /></div>
                            <div className="form-group"><label>Reason</label><textarea name="reason" value={exchangeData.reason} onChange={handleExchangeChange} rows="2"></textarea></div>
                            <div className="form-group"><label>Cost (NPR)</label><input type="number" name="cost" value={exchangeData.cost} onChange={handleExchangeChange} /></div>
                            <div className="form-group"><label>Vendor</label><input type="text" name="vendor" value={exchangeData.vendor} onChange={handleExchangeChange} /></div>
                            <button className="btn-submit" onClick={() => addExchange(selectedEquipment._id)}>Save Exchange</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Parts Replacement Modal */}
            {showPartsForm && selectedEquipment && (
                <div className="modal" onClick={() => setShowPartsForm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🔧 Parts Replacement - {selectedEquipment.name}</h2>
                            <button className="modal-close" onClick={() => setShowPartsForm(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group"><label>Part Name *</label><input type="text" name="partName" value={partsData.partName} onChange={handlePartsChange} required /></div>
                            <div className="form-group"><label>Part Number</label><input type="text" name="partNumber" value={partsData.partNumber} onChange={handlePartsChange} /></div>
                            <div className="form-group"><label>Reason</label><textarea name="reason" value={partsData.reason} onChange={handlePartsChange} rows="2"></textarea></div>
                            <div className="form-group"><label>Cost (NPR)</label><input type="number" name="cost" value={partsData.cost} onChange={handlePartsChange} /></div>
                            <div className="form-group"><label>Replaced By</label><input type="text" name="replacedBy" value={partsData.replacedBy} onChange={handlePartsChange} /></div>
                            <button className="btn-submit" onClick={() => addParts(selectedEquipment._id)}>Save Parts</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Gate Pass Modal */}
            {showGatePassForm && selectedEquipment && (
                <div className="modal" onClick={() => setShowGatePassForm(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📦 Gate Pass - {selectedEquipment.name}</h2>
                            <button className="modal-close" onClick={() => setShowGatePassForm(false)}>✕</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group"><label>Type *</label><select name="type" value={gatePassData.type} onChange={handleGatePassChange}><option value="Incoming">Incoming</option><option value="Outgoing">Outgoing</option></select></div>
                            <div className="form-group"><label>Item Name *</label><input type="text" name="itemName" value={gatePassData.itemName} onChange={handleGatePassChange} required /></div>
                            <div className="form-group"><label>Quantity *</label><input type="number" name="quantity" value={gatePassData.quantity} onChange={handleGatePassChange} required /></div>
                            <div className="form-group"><label>Purpose</label><textarea name="purpose" value={gatePassData.purpose} onChange={handleGatePassChange} rows="2"></textarea></div>
                            <div className="form-group"><label>Issued To</label><input type="text" name="issuedTo" value={gatePassData.issuedTo} onChange={handleGatePassChange} /></div>
                            <div className="form-group"><label>Approved By</label><input type="text" name="approvedBy" value={gatePassData.approvedBy} onChange={handleGatePassChange} /></div>
                            <button className="btn-submit" onClick={() => addGatePass(selectedEquipment._id)}>Save Gate Pass</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EquipmentManagement;