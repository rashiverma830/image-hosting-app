import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/dashboard.css';

const Saved = () => {
    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    const [savedItems, setSavedItems] = useState([]);
    
    useEffect(() => {
        const loadedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
        setSavedItems(loadedItems);
    }, []);

    const handleRemove = (id) => {
        const updated = savedItems.filter(item => item.id !== id);
        setSavedItems(updated);
        localStorage.setItem('savedItems', JSON.stringify(updated));
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar open" id="sidebar">
                <div className="sidebar-header">
                    <div className="logo"><div className="logo-icon"></div><span>Lumina</span></div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item"><span className="icon">⊞</span> Dashboard</Link>
                    <Link to="/saved" className="nav-item active"><span className="icon">♡</span> Saved</Link>
                </nav>
            </aside>
            <div className="main-wrapper">
                <Header title="Saved Items" breadcrumbs="Saved" />
                <main className="dashboard-content">
                    <div className="saved-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="section-title" style={{ margin: 0 }}>Your Collection ({savedItems.length})</h3>
                        <div className="filter-options">
                            <select style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #E5E5E5', outline: 'none' }}>
                                <option>Recently Added</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {savedItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '16px', color: '#999' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>💔</div>
                            <h3>No saved items yet</h3>
                            <p>Go explore the marketplace and save your favorites!</p>
                        </div>
                    ) : (
                        <div className="bids-grid">
                            {savedItems.map(item => (
                                <div key={item.id} className="bid-card relative">
                                    <div className="bid-img">
                                        <img src={item.img} alt={item.title} />
                                        <button 
                                            onClick={() => handleRemove(item.id)}
                                            style={{
                                                position: 'absolute', top: '10px', right: '10px', background: 'white', 
                                                border: 'none', borderRadius: '50%', width: '35px', height: '35px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', color: '#FF4D4F', fontSize: '1.2rem'
                                            }}
                                            title="Remove from saved"
                                        >
                                            ♥
                                        </button>
                                    </div>
                                    <div className="bid-info-box">
                                        <h4 style={{ marginBottom: '5px' }}>{item.title}</h4>
                                        <div style={{ fontSize: '0.8rem', color: '#999', marginBottom: '15px' }}>by {item.creator}</div>
                                        
                                        <div className="bid-stats">
                                            <div className="stat">
                                                <span>Price</span>
                                                <strong>{item.price}</strong>
                                            </div>
                                        </div>
                                        <button className="btn-purple full-btn">Place a Bid</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Saved;

