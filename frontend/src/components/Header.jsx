import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ title, breadcrumbs, onToggleSidebar }) => {
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
        <header className="top-header">
            <div className="header-left">
                {title === 'Create Item' && <button className="menu-toggle" id="menuToggle" onClick={onToggleSidebar}>☰</button>}
                <h1>{title}</h1>
                <div className="breadcrumbs">
                    <span className="text-purple">Dashboard</span> / <span>{breadcrumbs}</span>
                </div>
            </div>
            <div className="header-right">
                <div className="search-bar">
                    <span className="search-icon" style={{ fontSize: '1.2rem', marginLeft: '5px' }}>🔍</span>
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
                    />
                </div>
                <div className="user-actions">
                    <Link to="/settings">
                        <button className="icon-btn" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                        </button>
                    </Link>
                    
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
        </header>
    );
};

export default Header;
