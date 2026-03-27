import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reports.css';

function Reports() {
    const [summary, setSummary] = useState(null);
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5001/api/equipment';

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [summaryRes, equipmentRes] = await Promise.all([
                axios.get(`${API_URL}/report/summary`),
                axios.get(API_URL)
            ]);
            if (summaryRes.data.success) setSummary(summaryRes.data.data);
            if (equipmentRes.data.success) setEquipment(equipmentRes.data.data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportCSV = () => {
        const headers = ['Equipment ID', 'Name', 'Category', 'Model', 'Serial No', 'Status', 'Warranty End', 'Amount'];
        const rows = equipment.map(e => [
            e.equipmentId, e.name, e.category, e.model, e.serialNumber, e.status,
            new Date(e.warrantyEnd).toLocaleDateString(), e.amount
        ]);
        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `equipment_report_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    if (loading) return <div className="loading">Loading Reports...</div>;

    return (
        <div className="reports">
            <div className="reports-header">
                <h1>📊 Reports & Analytics</h1>
                <button className="export-btn" onClick={exportCSV}>📥 Export CSV</button>
            </div>

            {summary && (
                <div className="report-cards">
                    <div className="report-card"><h3>Total Equipment</h3><p className="big-number">{summary.total}</p></div>
                    <div className="report-card"><h3>Total Value</h3><p className="big-number">रु. {summary.totalValue?.toLocaleString()}</p></div>
                    <div className="report-card"><h3>Active Warranty</h3><p className="big-number">{summary.warrantyActive}</p></div>
                    <div className="report-card"><h3>Expiring Soon</h3><p className="big-number warning">{summary.warrantyExpiring || 0}</p></div>
                </div>
            )}

            <div className="category-breakdown">
                <h2>Equipment by Category</h2>
                <div className="category-grid">
                    {summary?.byCategory && Object.entries(summary.byCategory).map(([cat, count]) => (
                        <div key={cat} className="category-item">
                            <span className="category-name">{cat}</span>
                            <div className="category-bar">
                                <div className="category-fill" style={{ width: `${(count / summary.total) * 100}%` }}></div>
                            </div>
                            <span className="category-count">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Reports;