import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [recentEquipment, setRecentEquipment] = useState([]);
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
            if (equipmentRes.data.success) setRecentEquipment(equipmentRes.data.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading Dashboard...</div>;

    return (
        <div className="dashboard">
            <h1>Dashboard Overview</h1>
            
            {/* Stats Cards */}
            {summary && (
                <div className="dashboard-stats">
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
                        <div><h3>Under Maintenance</h3><p className="stat-number">{summary.underMaintenance}</p></div>
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

            {/* Recent Equipment */}
            <div className="recent-section">
                <h2>Recently Added Equipment</h2>
                <table className="recent-table">
                    <thead>
                        <tr><th>ID</th><th>Name</th><th>Category</th><th>Status</th><th>Warranty</th> </tr>
                    </thead>
                    <tbody>
                        {recentEquipment.map(item => (
                            <tr key={item._id}>
                                <td>{item.equipmentId}</td>
                                <td><strong>{item.name}</strong></td>
                                <td>{item.category}</td>
                                <td><span className={`status-badge ${item.status.toLowerCase().replace(/\s/g, '-')}`}>{item.status}</span></td>
                                <td>{new Date(item.warrantyEnd).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;