import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/dashboard.css';

const Settings = () => {
    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    const [activeTab, setActiveTab] = useState('profile');

    return (
        <div className="dashboard-layout">
            <aside className="sidebar open" id="sidebar">
                <div className="sidebar-header">
                    <div className="logo"><div className="logo-icon"></div><span>Lumina</span></div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item"><span className="icon">⊞</span> Dashboard</Link>
                    <Link to="/bids" className="nav-item"><span className="icon">📈</span> Bids</Link>
                    <Link to="/saved" className="nav-item"><span className="icon">♡</span> Saved</Link>
                    <Link to="/creators" className="nav-item"><span className="icon">👥</span> Creators</Link>
                    <Link to="/wallet" className="nav-item"><span className="icon">👛</span> Wallet</Link>
                </nav>
            </aside>
            
            <div className="main-wrapper">
                <Header title="Settings" breadcrumbs="Settings" />
                <main className="dashboard-content">
                    
                    <div style={{ background: 'white', borderRadius: '16px', padding: '30px', border: '1px solid #F0F0F0', minHeight: '500px' }}>
                        {/* Tabs */}
                        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #E5E5E5', marginBottom: '30px' }}>
                            <button 
                                onClick={() => setActiveTab('profile')} 
                                style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1.05rem', fontWeight: '600', color: activeTab === 'profile' ? '#FF6B6B' : '#999', borderBottom: activeTab === 'profile' ? '3px solid #FF6B6B' : '3px solid transparent', cursor: 'pointer' }}
                            >
                                Profile Details
                            </button>
                            <button 
                                onClick={() => setActiveTab('notifications')} 
                                style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1.05rem', fontWeight: '600', color: activeTab === 'notifications' ? '#FF6B6B' : '#999', borderBottom: activeTab === 'notifications' ? '3px solid #FF6B6B' : '3px solid transparent', cursor: 'pointer' }}
                            >
                                Notifications
                            </button>
                            <button 
                                onClick={() => setActiveTab('security')} 
                                style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1.05rem', fontWeight: '600', color: activeTab === 'security' ? '#FF6B6B' : '#999', borderBottom: activeTab === 'security' ? '3px solid #FF6B6B' : '3px solid transparent', cursor: 'pointer' }}
                            >
                                Security
                            </button>
                        </div>

                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="form-grid">
                                <div className="form-group title-group">
                                    <label>Display Name</label>
                                    <input type="text" defaultValue="Nella Vita" />
                                </div>
                                <div className="form-group price-group">
                                    <label>Username</label>
                                    <input type="text" defaultValue="@nellavita" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Email Address</label>
                                    <input type="email" defaultValue="hello@nellavita.com" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Bio</label>
                                    <textarea rows="4" defaultValue="Digital artist and 3D designer exploring the intersection of abstract forms and neon cyberpunk aesthetics."></textarea>
                                </div>
                                <div className="form-group title-group">
                                    <label>Twitter/X Profile</label>
                                    <input type="text" defaultValue="https://twitter.com/nellavita" />
                                </div>
                                <div className="form-group price-group">
                                    <label>Instagram Profile</label>
                                    <input type="text" defaultValue="https://instagram.com/nellavita" />
                                </div>
                                
                                <div className="bottom-actions" style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
                                    <button className="btn-create">Save Profile Changes</button>
                                </div>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div style={{ maxWidth: '600px' }}>
                                <h3 style={{ marginBottom: '20px', color: '#333' }}>Email Notifications</h3>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1A1A1A' }}>Item Sold</div>
                                        <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>When someone purchases your item</div>
                                    </div>
                                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#FF6B6B', cursor: 'pointer' }} />
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1A1A1A' }}>Bid Activity</div>
                                        <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>When someone places a bid on your item</div>
                                    </div>
                                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#FF6B6B', cursor: 'pointer' }} />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1A1A1A' }}>New Followers</div>
                                        <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>When someone follows your profile</div>
                                    </div>
                                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#FF6B6B', cursor: 'pointer' }} />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1A1A1A' }}>Marketing & Updates</div>
                                        <div style={{ color: '#666', fontSize: '0.85rem', marginTop: '4px' }}>Platform news, feature updates, and promotions</div>
                                    </div>
                                    <input type="checkbox" style={{ width: '20px', height: '20px', accentColor: '#FF6B6B', cursor: 'pointer' }} />
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="form-grid">
                                <div className="form-group full-width">
                                    <label>Current Password</label>
                                    <input type="password" placeholder="Enter your current password" />
                                </div>
                                <div className="form-group full-width">
                                    <label>New Password</label>
                                    <input type="password" placeholder="Create a new password" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Confirm New Password</label>
                                    <input type="password" placeholder="Confirm your new password" />
                                </div>
                                <div className="bottom-actions" style={{ gridColumn: '1 / -1', marginTop: '20px', display: 'flex', gap: '15px' }}>
                                    <button className="btn-create" style={{ background: '#FF4D4F' }}>Update Password</button>
                                    <button className="btn-outline">Enable 2FA</button>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Settings;

