import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/dashboard.css';

const Creators = () => {
    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    const [creators, setCreators] = useState([
        { id: 1, name: 'John Doe', username: '@johndoe', followers: '12.5K', sales: '840 ETH', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random', cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop', isFollowing: false },
        { id: 2, name: 'Anna Smith', username: '@annasmith_art', followers: '8.2K', sales: '420 ETH', avatar: 'https://ui-avatars.com/api/?name=Anna+Smith&background=random', cover: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=300&auto=format&fit=crop', isFollowing: true },
        { id: 3, name: 'CryptoKing', username: '@cryptoking', followers: '45.1K', sales: '3.2K ETH', avatar: 'https://ui-avatars.com/api/?name=Crypto+King&background=random', cover: 'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=300&auto=format&fit=crop', isFollowing: false },
        { id: 4, name: 'NeonDreams', username: '@neondreams', followers: '3.4K', sales: '150 ETH', avatar: 'https://ui-avatars.com/api/?name=Neon+Dreams&background=random', cover: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=300&auto=format&fit=crop', isFollowing: false },
        { id: 5, name: 'ArtMaster', username: '@artmaster99', followers: '19.8K', sales: '1.1K ETH', avatar: 'https://ui-avatars.com/api/?name=Art+Master&background=random', cover: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=300&auto=format&fit=crop', isFollowing: true },
        { id: 6, name: 'Nella Vita', username: '@nellavita', followers: '1.2K', sales: '45 ETH', avatar: 'https://ui-avatars.com/api/?name=Nella+Vita&background=0D8ABC&color=fff', cover: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=300&auto=format&fit=crop', isFollowing: false },
    ]);

    const toggleFollow = (id) => {
        setCreators(creators.map(creator => 
            creator.id === id ? { ...creator, isFollowing: !creator.isFollowing } : creator
        ));
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
                    <Link to="/saved" className="nav-item"><span className="icon">♡</span> Saved</Link>
                    <Link to="/creators" className="nav-item active"><span className="icon">👥</span> Creators</Link>
                    <Link to="/wallet" className="nav-item"><span className="icon">👛</span> Wallet</Link>
                </nav>
            </aside>
            <div className="main-wrapper">
                <Header title="Top Creators" breadcrumbs="Creators" />
                <main className="dashboard-content">
                    <div className="saved-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 className="section-title" style={{ margin: 0 }}>Discover Creators</h3>
                        <div className="filter-options">
                            <select style={{ padding: '8px 15px', borderRadius: '20px', border: '1px solid #E5E5E5', outline: 'none' }}>
                                <option>Popular</option>
                                <option>Trending</option>
                                <option>Newest</option>
                            </select>
                        </div>
                    </div>

                    <div className="bids-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {creators.map(creator => (
                            <div key={creator.id} className="bid-card" style={{ textAlign: 'center', paddingBottom: '20px' }}>
                                <div style={{ position: 'relative', height: '100px' }}>
                                    <img src={creator.cover} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <img 
                                        src={creator.avatar} 
                                        alt={creator.name} 
                                        style={{ 
                                            position: 'absolute', bottom: '-35px', left: '50%', transform: 'translateX(-50%)',
                                            width: '70px', height: '70px', borderRadius: '50%', border: '4px solid white', backgroundColor: 'white'
                                        }} 
                                    />
                                </div>
                                <div style={{ marginTop: '45px', padding: '0 20px' }}>
                                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#1A1A1A' }}>{creator.name}</h4>
                                    <div style={{ fontSize: '0.85rem', color: '#FF6B6B', marginBottom: '15px' }}>{creator.username}</div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-around', margin: '20px 0', padding: '15px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0' }}>
                                        <div>
                                            <strong style={{ display: 'block', color: '#1A1A1A', fontSize: '1.1rem' }}>{creator.followers}</strong>
                                            <span style={{ fontSize: '0.75rem', color: '#999' }}>Followers</span>
                                        </div>
                                        <div>
                                            <strong style={{ display: 'block', color: '#1A1A1A', fontSize: '1.1rem' }}>{creator.sales}</strong>
                                            <span style={{ fontSize: '0.75rem', color: '#999' }}>Total Sales</span>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => toggleFollow(creator.id)}
                                        className={creator.isFollowing ? "btn-outline full-btn" : "btn-purple full-btn"}
                                        style={{ transition: 'all 0.3s' }}
                                    >
                                        {creator.isFollowing ? 'Following' : 'Follow'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Creators;

