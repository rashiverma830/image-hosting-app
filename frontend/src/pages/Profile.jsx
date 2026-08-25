import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/dashboard.css';

const Profile = () => {
    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    const [activeTab, setActiveTab] = useState('created');
    
    // Load from localStorage or use default
    const defaultCover = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop';
    const defaultAvatar = 'https://ui-avatars.com/api/?name=Nella+Vita&background=0D8ABC&color=fff&size=120';
    
    const [coverImage, setCoverImage] = useState(localStorage.getItem('savedCoverImage') || defaultCover);
    const [avatarImage, setAvatarImage] = useState(localStorage.getItem('savedAvatarImage') || defaultAvatar);
    
    // Create refs for hidden file inputs
    const coverInputRef = React.useRef(null);
    const avatarInputRef = React.useRef(null);

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target.result;
                setCoverImage(result);
                localStorage.setItem('savedCoverImage', result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target.result;
                setAvatarImage(result);
                localStorage.setItem('savedAvatarImage', result);
                // Dispatch event so Header can update instantly
                window.dispatchEvent(new Event('profileImageUpdated'));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerCoverUpload = () => {
        coverInputRef.current.click();
    };

    const triggerAvatarUpload = () => {
        avatarInputRef.current.click();
    };

    const defaultItems = [
        { id: 1, title: 'Abstract 3D Design', price: '2.55 ETH', status: 'On Auction', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop' },
        { id: 2, title: 'Neon Dreamscape', price: '1.80 ETH', status: 'Fixed Price', img: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=300&auto=format&fit=crop' },
    ];
    
    const [myItems, setMyItems] = useState([]);

    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('userItems') || '[]');
        setMyItems([...saved, ...defaultItems]);
    }, []);

    return (
        <div className="dashboard-layout">
            <aside className="sidebar open" id="sidebar">
                <div className="sidebar-header">
                    <div className="logo"><div className="logo-icon"></div><span>Lumina</span></div>
                </div>
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item"><span className="icon">⊞</span> Dashboard</Link>
                    <Link to="/saved" className="nav-item"><span className="icon">♡</span> Saved</Link>
                </nav>
            </aside>
            <div className="main-wrapper">
                <Header title="My Profile" breadcrumbs="Profile" />
                <main className="dashboard-content">
                    {/* Profile Banner */}
                    <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #F0F0F0', marginBottom: '30px' }}>
                        <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                            <img src={coverImage} alt="Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <input 
                                type="file" 
                                accept="image/*" 
                                ref={coverInputRef} 
                                onChange={handleCoverChange} 
                                style={{ display: 'none' }} 
                            />
                            <button 
                                onClick={triggerCoverUpload}
                                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.9)', border: 'none', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: '600' }}
                            >
                                Edit Cover
                            </button>
                        </div>
                        <div style={{ padding: '0 30px 30px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-50px', marginBottom: '20px' }}>
                                <div style={{ position: 'relative' }}>
                                    <img src={avatarImage} alt="Avatar" style={{ width: '120px', height: '120px', borderRadius: '50%', border: '5px solid white', backgroundColor: 'white', objectFit: 'cover' }} />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        ref={avatarInputRef} 
                                        onChange={handleAvatarChange} 
                                        style={{ display: 'none' }} 
                                    />
                                    <button 
                                        onClick={triggerAvatarUpload}
                                        style={{ position: 'absolute', bottom: '5px', right: '5px', width: '35px', height: '35px', borderRadius: '50%', background: '#FF6B6B', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                                    >
                                        ✎
                                    </button>
                                </div>
                                <button className="btn-outline" style={{ padding: '10px 25px' }}>Edit Profile</button>
                            </div>
                            
                            <h2 style={{ margin: '0 0 5px 0', color: '#1A1A1A' }}>Nella Vita</h2>
                            <div style={{ color: '#FF6B6B', fontWeight: '500', marginBottom: '15px' }}>@nellavita</div>
                            <p style={{ color: '#666', lineHeight: '1.6', maxWidth: '600px', marginBottom: '20px' }}>
                                Digital artist and 3D designer exploring the intersection of abstract forms and neon cyberpunk aesthetics. Welcome to my creative universe! ✨
                            </p>
                            
                            <div style={{ display: 'flex', gap: '30px', borderTop: '1px solid #F0F0F0', paddingTop: '20px' }}>
                                <div><strong style={{ fontSize: '1.2rem', color: '#1A1A1A' }}>24</strong> <span style={{ color: '#999', fontSize: '0.9rem' }}>Items</span></div>
                                <div><strong style={{ fontSize: '1.2rem', color: '#1A1A1A' }}>1.2K</strong> <span style={{ color: '#999', fontSize: '0.9rem' }}>Followers</span></div>
                                <div><strong style={{ fontSize: '1.2rem', color: '#1A1A1A' }}>345</strong> <span style={{ color: '#999', fontSize: '0.9rem' }}>Following</span></div>
                                <div><strong style={{ fontSize: '1.2rem', color: '#1A1A1A' }}>45 ETH</strong> <span style={{ color: '#999', fontSize: '0.9rem' }}>Total Sales</span></div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #E5E5E5', marginBottom: '30px' }}>
                        <button onClick={() => setActiveTab('created')} style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1.05rem', fontWeight: '600', color: activeTab === 'created' ? '#FF6B6B' : '#999', borderBottom: activeTab === 'created' ? '3px solid #FF6B6B' : '3px solid transparent', cursor: 'pointer' }}>Created ({myItems.length})</button>
                        <button onClick={() => setActiveTab('collected')} style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1.05rem', fontWeight: '600', color: activeTab === 'collected' ? '#FF6B6B' : '#999', borderBottom: activeTab === 'collected' ? '3px solid #FF6B6B' : '3px solid transparent', cursor: 'pointer' }}>Collected (0)</button>
                        <button onClick={() => setActiveTab('activity')} style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1.05rem', fontWeight: '600', color: activeTab === 'activity' ? '#FF6B6B' : '#999', borderBottom: activeTab === 'activity' ? '3px solid #FF6B6B' : '3px solid transparent', cursor: 'pointer' }}>Activity</button>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'created' && (
                        <div className="bids-grid">
                            {myItems.map(item => (
                                <div key={item.id} className="bid-card" style={{ padding: '15px' }}>
                                    <div className="bid-img" style={{ height: '200px', borderRadius: '12px', overflow: 'hidden', marginBottom: '15px' }}>
                                        <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>{item.title}</h4>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                        <div style={{ color: '#999', fontSize: '0.85rem' }}>Price</div>
                                        <strong style={{ color: '#FF6B6B' }}>{item.price}</strong>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn-outline" style={{ flex: 1 }}>{item.status}</button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Create New Card */}
                            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                <div style={{ border: '2px dashed #D9D9D9', borderRadius: '16px', height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#FF6B6B'} onMouseOut={e=>e.currentTarget.style.borderColor='#D9D9D9'}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#EEF2FF', color: '#FF6B6B', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>+</div>
                                    <div style={{ fontWeight: '600', color: '#333' }}>Create New Item</div>
                                </div>
                            </Link>
                        </div>
                    )}
                    
                    {activeTab !== 'created' && (
                        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '16px', border: '1px solid #F0F0F0', color: '#999' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>👻</div>
                            <h3>Nothing to see here</h3>
                            <p>You don't have any {activeTab} items yet.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Profile;

