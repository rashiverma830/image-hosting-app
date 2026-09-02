import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import '../styles/dashboard.css';

const Profile = () => {
    const navigate = useNavigate();

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

    const [activeTab, setActiveTab] = useState('created');
    
    // Load profile info from localStorage or use defaults
    const defaultCover = 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop';
    const defaultAvatar = 'https://ui-avatars.com/api/?name=Nella+Vita&background=0D8ABC&color=fff&size=120';
    
    const [coverImage, setCoverImage] = useState(localStorage.getItem('savedCoverImage') || defaultCover);
    const [avatarImage, setAvatarImage] = useState(localStorage.getItem('savedAvatarImage') || defaultAvatar);

    const [name, setName] = useState(localStorage.getItem('savedProfileName') || 'Nella Vita');
    const [username, setUsername] = useState(localStorage.getItem('savedProfileUsername') || '@nellavita');
    const [bio, setBio] = useState(localStorage.getItem('savedProfileBio') || 'Digital artist and 3D designer exploring the intersection of abstract forms and neon cyberpunk aesthetics. Welcome to my creative universe! ✨');

    // Edit Modal State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editUsername, setEditUsername] = useState('');
    const [editBio, setEditBio] = useState('');

    const handleOpenEdit = () => {
        setEditName(name);
        setEditUsername(username);
        setEditBio(bio);
        setIsEditing(true);
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        setName(editName);
        setUsername(editUsername);
        setBio(editBio);

        localStorage.setItem('savedProfileName', editName);
        localStorage.setItem('savedProfileUsername', editUsername);
        localStorage.setItem('savedProfileBio', editBio);

        // Notify Header to update instantly
        window.dispatchEvent(new Event('profileImageUpdated'));
        setIsEditing(false);
    };

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
        <>
            <div className="main-wrapper" style={{ marginLeft: 0 }}>
                <Header title="My Profile" breadcrumbs="Profile" />
                <main className="dashboard-content">
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            padding: '6px 14px', 
                            background: '#F1F5F9', 
                            border: '1px solid #E2E8F0', 
                            borderRadius: '20px', 
                            cursor: 'pointer', 
                            fontWeight: '600', 
                            fontSize: '0.82rem', 
                            color: '#475569',
                            marginBottom: '16px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#475569'; }}
                    >
                        <ArrowLeft size={14} /> Back
                    </button>
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
                                        style={{ position: 'absolute', bottom: '5px', right: '5px', width: '35px', height: '35px', borderRadius: '50%', background: '#6366f1', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
                                    >
                                        ✎
                                    </button>
                                </div>
                                <button 
                                    onClick={handleOpenEdit} 
                                    className="btn-outline" 
                                    style={{ padding: '10px 25px', cursor: 'pointer', fontWeight: '600', borderRadius: '10px' }}
                                >
                                    Edit Profile
                                </button>
                            </div>
                            
                            <h2 style={{ margin: '0 0 5px 0', color: '#1A1A1A' }}>{name}</h2>
                            <div style={{ color: '#6366f1', fontWeight: '500', marginBottom: '15px' }}>{username}</div>
                            <p style={{ color: '#666', lineHeight: '1.6', maxWidth: '600px', marginBottom: '20px' }}>
                                {bio}
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
                        <button onClick={() => setActiveTab('created')} style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1.05rem', fontWeight: '600', color: activeTab === 'created' ? '#6366f1' : '#999', borderBottom: activeTab === 'created' ? '3px solid #6366f1' : '3px solid transparent', cursor: 'pointer' }}>Created ({myItems.length})</button>
                        <button onClick={() => setActiveTab('collected')} style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1.05rem', fontWeight: '600', color: activeTab === 'collected' ? '#6366f1' : '#999', borderBottom: activeTab === 'collected' ? '3px solid #6366f1' : '3px solid transparent', cursor: 'pointer' }}>Collected (0)</button>
                        <button onClick={() => setActiveTab('activity')} style={{ background: 'none', border: 'none', padding: '10px 0', fontSize: '1.05rem', fontWeight: '600', color: activeTab === 'activity' ? '#6366f1' : '#999', borderBottom: activeTab === 'activity' ? '3px solid #6366f1' : '3px solid transparent', cursor: 'pointer' }}>Activity</button>
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
                                        <strong style={{ color: '#6366f1' }}>{item.price}</strong>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button className="btn-outline" style={{ flex: 1 }}>{item.status}</button>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Create New Card */}
                            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                                <div style={{ border: '2px dashed #D9D9D9', borderRadius: '16px', height: '100%', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.borderColor='#6366f1'} onMouseOut={e=>e.currentTarget.style.borderColor='#D9D9D9'}>
                                    <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#EEF2FF', color: '#6366f1', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>+</div>
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

            {/* Edit Profile Modal */}
            {isEditing && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '16px', padding: '30px',
                        width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}>
                        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.4rem', color: '#1A1A1A' }}>Edit Profile</h2>
                        
                        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#666', marginBottom: '6px' }}>Display Name</label>
                                <input 
                                    type="text" 
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                                        border: '1px solid #E5E5E5', outline: 'none', fontSize: '0.95rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#666', marginBottom: '6px' }}>Username</label>
                                <input 
                                    type="text" 
                                    value={editUsername}
                                    onChange={(e) => setEditUsername(e.target.value)}
                                    required
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                                        border: '1px solid #E5E5E5', outline: 'none', fontSize: '0.95rem'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#666', marginBottom: '6px' }}>Bio</label>
                                <textarea 
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                    rows={4}
                                    style={{
                                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                                        border: '1px solid #E5E5E5', outline: 'none', fontSize: '0.95rem',
                                        fontFamily: 'inherit', resize: 'vertical'
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditing(false)}
                                    style={{
                                        padding: '10px 20px', borderRadius: '8px', border: '1px solid #E5E5E5',
                                        background: 'white', color: '#333', fontWeight: '600', cursor: 'pointer'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    style={{
                                        padding: '10px 22px', borderRadius: '8px', border: 'none',
                                        background: '#6366f1', color: 'white', fontWeight: '600', cursor: 'pointer'
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;
