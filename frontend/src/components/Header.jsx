import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ title, breadcrumbs, onToggleSidebar }) => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const defaultAvatar = 'https://ui-avatars.com/api/?name=Nella+Vita&background=0D8ABC&color=fff';
    const [avatarImage, setAvatarImage] = useState(localStorage.getItem('savedAvatarImage') || defaultAvatar);

    // Listen for avatar changes from Profile page
    React.useEffect(() => {
        const handleProfileUpdate = () => {
            setAvatarImage(localStorage.getItem('savedAvatarImage') || defaultAvatar);
        };
        window.addEventListener('profileImageUpdated', handleProfileUpdate);
        return () => window.removeEventListener('profileImageUpdated', handleProfileUpdate);
    }, []);

    const [notifications, setNotifications] = useState([
        { id: 1, text: 'Your bid of 2.5 ETH was accepted!', time: '2m ago', read: false },
        { id: 2, text: 'Nella Vita followed you', time: '1h ago', read: false },
        { id: 3, text: 'New trending NFT collection drops tomorrow', time: '5h ago', read: false }
    ]);
    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationClick = () => {
        setShowNotifications(!showNotifications);
        setShowProfileMenu(false);
        if (!showNotifications) {
            setNotifications(notifications.map(n => ({...n, read: true})));
        }
    };

    const handleProfileClick = () => {
        setShowProfileMenu(!showProfileMenu);
        setShowNotifications(false);
    };

    return (
        <header className="top-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '20px', paddingTop: '40px', paddingRight: '40px', paddingBottom: '0px', paddingLeft: '40px' }}>
            {/* Top Row: Search and User Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                <div className="search-bar" style={{ flex: 1, maxWidth: '600px', background: 'white', borderRadius: '30px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                    <span className="search-icon" style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </span>
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                alert(`Searching for: ${searchQuery}`);
                            }
                        }}
                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '1rem', color: '#333' }}
                    />
                </div>
                
                <div className="user-actions" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginLeft: '20px' }}>
                    <button className="icon-btn" onClick={() => document.body.classList.toggle('dark-mode')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Toggle Dark Mode">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                    </button>

                    <div style={{ position: 'relative' }}>
                        <button className="icon-btn notif" onClick={handleNotificationClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.2rem' }}>🔔</span>
                            {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                        </button>
                        
                        {showNotifications && (
                            <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '10px', width: '300px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 1000, border: '1px solid #eee', textAlign: 'left' }}>
                                <div style={{ padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold' }}>Notifications</div>
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {notifications.length === 0 ? (
                                        <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No notifications</div>
                                    ) : (
                                        notifications.map(notif => (
                                            <div key={notif.id} style={{ padding: '15px', borderBottom: '1px solid #f9f9f9', display: 'flex', gap: '10px' }}>
                                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: notif.read ? 'transparent' : '#6366f1', marginTop: '6px' }}></div>
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', color: '#333' }}>{notif.text}</div>
                                                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '4px' }}>{notif.time}</div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div className="user-profile" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                            <div className="user-info">
                                <span className="name">Nella Vita</span>
                                <span className="role">User</span>
                            </div>
                            <img src={avatarImage} alt="User" className="avatar" style={{ objectFit: 'cover' }} />
                        </div>
                        
                        {showProfileMenu && (
                            <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '15px', width: '180px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 1000, border: '1px solid #eee', overflow: 'hidden', textAlign: 'left' }}>
                                <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setShowProfileMenu(false)}>
                                    <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#FAFAFA'} onMouseOut={e=>e.currentTarget.style.background='white'}>
                                        <span style={{ fontSize: '1.1rem' }}>👤</span> My Profile
                                    </div>
                                </Link>
                                <Link to="/settings" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setShowProfileMenu(false)}>
                                    <div style={{ padding: '12px 20px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#FAFAFA'} onMouseOut={e=>e.currentTarget.style.background='white'}>
                                        <span style={{ fontSize: '1.1rem' }}>⚙</span> Settings
                                    </div>
                                </Link>
                                <Link to="/" style={{ textDecoration: 'none', color: '#FF4D4F' }} onClick={() => setShowProfileMenu(false)}>
                                    <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', transition: 'background 0.2s' }} onMouseOver={e=>e.currentTarget.style.background='#FFF1F0'} onMouseOut={e=>e.currentTarget.style.background='white'}>
                                        <span style={{ fontSize: '1.1rem' }}>🚪</span> Sign out
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Row: Title and Breadcrumbs */}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '30px' }}>
                <div className="header-left" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    {title === 'Create Item' && <button className="menu-toggle" id="menuToggle" onClick={onToggleSidebar}>☰</button>}
                    
                    {title === 'Dashboard' ? (
                        <>
                            <h1 style={{ margin: 0, fontSize: '1.8rem' }} className="page-title">Good morning, Nella! 👋</h1>
                            <div className="breadcrumbs" style={{ marginTop: '5px', fontSize: '0.85rem', color: '#999' }}>
                                Upload, manage and share your images securely.
                            </div>
                        </>
                    ) : (
                        <>
                            <h1 style={{ margin: 0, fontSize: '1.8rem' }} className="page-title">{title}</h1>
                            <div className="breadcrumbs" style={{ marginTop: '5px', fontSize: '0.85rem', color: '#999' }}>
                                <span className="text-purple" style={{ color: '#6366f1' }}>Dashboard</span> / <span>{breadcrumbs}</span>
                            </div>
                        </>
                    )}
                </div>
                
                {title === 'Dashboard' && (
                    <button className="btn-purple" style={{ flex: 'none', width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '30px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate('/upload')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                        Upload Image
                    </button>
                )}
                
                {title === 'My Images' && (
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button style={{ background: 'white', border: '1px solid #E5E5E5', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', color: '#333', cursor: 'pointer' }}>
                            New Folder
                        </button>
                        <button className="btn-purple" style={{ flex: 'none', width: 'auto', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate('/upload')}>
                            Upload Images
                        </button>
                    </div>
                )}
                
                {title === 'Albums' && (
                    <button className="btn-purple" style={{ flex: 'none', width: 'auto', padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                        New Album
                    </button>
                )}
                
                {title === 'Shared Links' && (
                    <button className="btn-purple" style={{ flex: 'none', width: 'auto', padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#6366f1', color: 'white', cursor: 'pointer', fontWeight: '600' }}>
                        Create New Link
                    </button>
                )}
                
                {title === 'Analytics' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', border: '1px solid #E5E5E5', padding: '10px 15px', borderRadius: '8px', color: '#333', fontSize: '0.9rem', cursor: 'pointer' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        May 20, 2024 - May 26, 2024
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                )}
                
                {title === 'Trash' && (
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button onClick={() => window.dispatchEvent(new Event('restore-trash'))} style={{ background: 'white', border: '1px solid #E5E5E5', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', color: '#333', cursor: 'pointer' }}>
                            Restore All
                        </button>
                        <button onClick={() => window.dispatchEvent(new Event('empty-trash'))} style={{ background: 'white', border: '1px solid #E5E5E5', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', color: '#333', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                            Empty Trash
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
