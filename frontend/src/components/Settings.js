import React, { useState } from 'react';
import './Settings.css';

function Settings() {
    const [settings, setSettings] = useState({
        hospitalName: 'Nepalgunj Neuro Hospital',
        email: 'info@nepalgunjneuro.com',
        phone: '+977-974-9979999',
        address: 'Jail Road-10, Nepalgunj, Banke',
        warrantyAlertDays: 30,
        autoBackup: true
    });

    const handleChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleCheckbox = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.checked });
    };

    const handleSave = () => {
        localStorage.setItem('hospitalSettings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    };

    return (
        <div className="settings">
            <h1>⚙️ System Settings</h1>
            
            <div className="settings-form">
                <div className="setting-group">
                    <label>Hospital Name</label>
                    <input type="text" name="hospitalName" value={settings.hospitalName} onChange={handleChange} />
                </div>
                
                <div className="setting-group">
                    <label>Email Address</label>
                    <input type="email" name="email" value={settings.email} onChange={handleChange} />
                </div>
                
                <div className="setting-group">
                    <label>Phone Number</label>
                    <input type="text" name="phone" value={settings.phone} onChange={handleChange} />
                </div>
                
                <div className="setting-group">
                    <label>Address</label>
                    <textarea name="address" value={settings.address} onChange={handleChange} rows="2"></textarea>
                </div>
                
                <div className="setting-group">
                    <label>Warranty Alert (Days before expiry)</label>
                    <input type="number" name="warrantyAlertDays" value={settings.warrantyAlertDays} onChange={handleChange} />
                </div>
                
                <div className="setting-group checkbox">
                    <label>
                        <input type="checkbox" name="autoBackup" checked={settings.autoBackup} onChange={handleCheckbox} />
                        Enable Auto Backup
                    </label>
                </div>
                
                <button className="save-btn" onClick={handleSave}>💾 Save Settings</button>
            </div>
        </div>
    );
}

export default Settings;