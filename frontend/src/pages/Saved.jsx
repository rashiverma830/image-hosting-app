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

    const [savedItems, setSavedItems] = useState([
        { id: 1, title: 'Mystic Mountain', price: '1.50 ETH', creator: 'John Doe', img: 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=300&auto=format&fit=crop' },
        { id: 2, title: 'Ethereal Forest', price: '0.90 ETH', creator: 'Anna Smith', img: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=300&auto=format&fit=crop' },
        { id: 3, title: 'Digital Avatar #45', price: '4.20 ETH', creator: 'CryptoKing', img: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=300&auto=format&fit=crop' },
        { id: 4, title: 'Retro Vibes', price: '0.45 ETH', creator: 'NeonDreams', img: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=300&auto=format&fit=crop' },
        { id: 5, title: 'Abstract Fluid', price: '2.10 ETH', creator: 'ArtMaster', img: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=300&auto=format&fit=crop' },
    ]);

    const handleRemove = (id) => {
        setSavedItems(savedItems.filter(item => item.id !== id));
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar open" id="sidebar">
                <div className="sidebar-header">
                    <div className="logo"><div className="logo-icon"></div><span>Lumina</span></div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item"><span className="icon">⊞</span> Dashboard</Link>
                    <Link to="/bids" className="nav-item"><span className="icon">📈</span> Bids</Link>
                    <Link to="/saved" className="nav-item active"><span className="icon">♡</span> Saved</Link>
                    <Link to="/creators" className="nav-item"><span className="icon">👥</span> Creators</Link>
                    <Link to="/wallet" className="nav-item"><span className="icon">👛</span> Wallet</Link>
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

