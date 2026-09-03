import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import Header from '../components/Header';
import Logo from '../components/Logo';
import { 
  Home, 
  Image as ImageIcon, 
  Trash2,
  ArrowLeft,
  Plus
} from 'lucide-react';
import '../styles/dashboard.css';

const DEFAULT_ALBUMS = [
    { id: 'Nature', title: 'Nature', seed: 'nature' },
    { id: 'Architecture', title: 'Architecture', seed: 'architecture' },
    { id: 'Products', title: 'Products', seed: 'products' },
    { id: 'Portraits', title: 'Portraits', seed: 'portraits' },
    { id: 'Interiors', title: 'Interiors', seed: 'interiors' },
    { id: 'Cars', title: 'Cars', seed: 'cars' },
    { id: 'Minimal', title: 'Minimal', seed: 'minimal' }
];

const Albums = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [albumData, setAlbumData] = useState({});
    const [activeAlbum, setActiveAlbum] = useState(null);
    const [dbImages, setDbImages] = useState([]);
    
    // Add Album Modal state
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');

    const loadAlbumData = () => {
        const stored = JSON.parse(localStorage.getItem('albumMappings') || '{}');
        setAlbumData(stored);
    };

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        loadAlbumData();
        fetch('http://localhost:5000/api/images')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setDbImages(data);
            })
            .catch(err => console.error("Error fetching images:", err));
        return () => document.body.classList.remove('dashboard-body');
    }, []);

    const resolveItemImage = (item) => {
        if (item && typeof item === 'object') {
            if (item.img && !item.img.includes('picsum.photos')) return item.img;
            if (item.url) return item.url;
            const found = dbImages.find(db => String(db.id) === String(item.id));
            if (found && found.img) return found.img;
        }
        const found = dbImages.find(db => String(db.id) === String(item));
        if (found && found.img) return found.img;
        return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=500&auto=format&fit=crop';
    };

    const resolveItemTitle = (item, idx) => {
        if (item && typeof item === 'object') {
            if (item.title) return item.title;
            if (item.name) return item.name;
            const found = dbImages.find(db => String(db.id) === String(item.id));
            if (found && found.title) return found.title;
        }
        const found = dbImages.find(db => String(db.id) === String(item));
        if (found && found.title) return found.title;
        return `Uploaded Image #${idx + 1}`;
    };

    const sanitizeItems = (items) => {
        if (!Array.isArray(items)) return [];
        return items.map((item, idx) => {
            const img = resolveItemImage(item);
            const title = resolveItemTitle(item, idx);
            const id = (item && item.id) ? item.id : (typeof item === 'string' || typeof item === 'number' ? item : idx);
            const url = (item && item.url) ? item.url : img;
            return { id, img, title, url };
        });
    };

    const handleCreateAlbum = (e) => {
        e.preventDefault();
        if (!newAlbumTitle.trim()) return;
        
        const title = newAlbumTitle.trim();
        const stored = JSON.parse(localStorage.getItem('albumMappings') || '{}');
        if (!stored[title]) {
            stored[title] = [];
            localStorage.setItem('albumMappings', JSON.stringify(stored));
        }
        setAlbumData(stored);
        setNewAlbumTitle('');
        setShowAddModal(false);
    };

    const handleRemoveFromAlbum = (albumName, itemId) => {
        const stored = JSON.parse(localStorage.getItem('albumMappings') || '{}');
        if (stored[albumName]) {
            stored[albumName] = stored[albumName].filter((item, idx) => {
                const id = (item && item.id) ? item.id : (typeof item === 'string' || typeof item === 'number' ? item : idx);
                return String(id) !== String(itemId);
            });
            localStorage.setItem('albumMappings', JSON.stringify(stored));
            setAlbumData(stored);
        }
    };

    const customKeys = Object.keys(albumData).filter(key => !DEFAULT_ALBUMS.some(a => a.title === key));
    
    const allAlbumList = [
        ...DEFAULT_ALBUMS.map(a => {
            const rawItems = albumData[a.title] || [];
            const items = sanitizeItems(rawItems);
            const cover = items.length > 0 ? items[0].img : `https://picsum.photos/seed/${a.seed}/500/300`;
            return {
                id: a.id,
                title: a.title,
                count: `${items.length} ${items.length === 1 ? 'image' : 'images'}`,
                rawCount: items.length,
                img: cover,
                items: items
            };
        }),
        ...customKeys.map((key, idx) => {
            const rawItems = albumData[key] || [];
            const items = sanitizeItems(rawItems);
            const cover = items.length > 0 ? items[0].img : `https://picsum.photos/seed/album-${idx}/500/300`;
            return {
                id: `custom-${key}`,
                title: key,
                count: `${items.length} ${items.length === 1 ? 'image' : 'images'}`,
                rawCount: items.length,
                img: cover,
                items: items
            };
        })
    ];

    const currentAlbumDetails = activeAlbum ? allAlbumList.find(a => a.title === activeAlbum) : null;

    return (
        <div className="dashboard-layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
                <div className="sidebar-header">
                    <Link to="/dashboard" className="logo" style={{ padding: '0', display: 'flex', alignItems: 'center', textDecoration: 'none', width: '100%' }}>
                        <Logo height={38} />
                    </Link>
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Home className="icon" size={20} /> Dashboard</NavLink>
                    <NavLink to="/my-images" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><ImageIcon className="icon" size={20} /> My Images</NavLink>
                    <NavLink to="/trash" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Trash2 className="icon" size={20} /> Trash</NavLink>
                </nav>
            </aside>

            <div className="main-wrapper">
                <Header 
                    title={activeAlbum ? `Album: ${activeAlbum}` : "Albums"} 
                    breadcrumbs={activeAlbum ? `Albums / ${activeAlbum}` : "Albums"} 
                    onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                />
                
                <main className="dashboard-content">
                    {activeAlbum ? (
                        /* Album Detailed View */
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                                <button 
                                    onClick={() => setActiveAlbum(null)}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '8px 18px', background: 'white', border: '1px solid #E5E5E5',
                                        borderRadius: '30px', fontWeight: '600', fontSize: '0.9rem',
                                        color: '#333', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background='#F5F5F5'}
                                    onMouseOut={e => e.currentTarget.style.background='white'}
                                >
                                    <ArrowLeft size={16} /> Back to Albums
                                </button>
                                <span style={{ fontSize: '1rem', fontWeight: '600', color: '#666' }}>
                                    {currentAlbumDetails?.count || '0 images'}
                                </span>
                            </div>

                            {(!currentAlbumDetails?.items || currentAlbumDetails.items.length === 0) ? (
                                <div style={{
                                    background: 'white', borderRadius: '16px', padding: '60px 20px',
                                    textAlign: 'center', border: '1px dashed #E5E5E5', marginTop: '20px'
                                }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📁</div>
                                    <h3 style={{ margin: '0 0 8px 0', color: '#1A1A1A' }}>Is album mein koi image nahi hai</h3>
                                    <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>
                                        Dashboard par images select karke <strong>"Move to Album"</strong> option se yahan add karein.
                                    </p>
                                    <button 
                                        onClick={() => navigate('/dashboard')}
                                        style={{
                                            padding: '10px 24px', background: '#6366f1', color: 'white',
                                            border: 'none', borderRadius: '8px', fontWeight: '600',
                                            fontSize: '0.9rem', cursor: 'pointer'
                                        }}
                                    >
                                        Go to Dashboard
                                    </button>
                                </div>
                            ) : (
                                <div className="bids-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' }}>
                                    {currentAlbumDetails.items.map((item, idx) => {
                                        const itemId = item.id || idx;
                                        const itemImg = item.img;
                                        const itemTitle = item.title;
                                        
                                        return (
                                            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'white', padding: '12px', borderRadius: '14px', border: '1px solid #E5E5E5' }}>
                                                <div style={{ height: '170px', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
                                                    <img src={itemImg} alt={itemTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    <button 
                                                        onClick={() => handleRemoveFromAlbum(activeAlbum, itemId)}
                                                        style={{
                                                            position: 'absolute', top: '8px', right: '8px',
                                                            background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                                                            border: 'none', borderRadius: '50%', width: '28px', height: '28px',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            cursor: 'pointer', fontSize: '0.85rem'
                                                        }}
                                                        title="Remove from album"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{itemTitle}</div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                    <button
                                                        onClick={() => navigate(`/image/${itemId}`)}
                                                        style={{
                                                            flex: 1, padding: '6px 10px', background: '#6366f1', color: 'white',
                                                            border: 'none', borderRadius: '6px', fontWeight: '600',
                                                            fontSize: '0.78rem', cursor: 'pointer'
                                                        }}
                                                    >
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            const btn = e.currentTarget;
                                                            navigator.clipboard.writeText(item.url || itemImg);
                                                            btn.textContent = '✓ Copied!';
                                                            btn.style.background = '#dcfce7';
                                                            btn.style.color = '#16a34a';
                                                            setTimeout(() => {
                                                                btn.textContent = 'Copy';
                                                                btn.style.background = 'white';
                                                                btn.style.color = '#333';
                                                            }, 2000);
                                                        }}
                                                        style={{
                                                            flex: 1, padding: '6px 10px', background: 'white', color: '#333',
                                                            border: '1px solid #E5E5E5', borderRadius: '6px', fontWeight: '600',
                                                            fontSize: '0.78rem', cursor: 'pointer'
                                                        }}
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : (
                        /* Album Grid Overview */
                        <div className="bids-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px', marginTop: '10px' }}>
                            {allAlbumList.map(album => (
                                <div 
                                    key={album.id} 
                                    onClick={() => setActiveAlbum(album.title)}
                                    style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}
                                >
                                    <div style={{ height: '160px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'relative' }}>
                                        <img src={album.img} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        {album.rawCount > 0 && (
                                            <span style={{
                                                position: 'absolute', top: '10px', right: '10px',
                                                background: '#6366f1', color: 'white', padding: '4px 10px',
                                                borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700'
                                            }}>
                                                {album.rawCount}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1A1A1A' }} className="page-title">{album.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#999', marginTop: '4px' }}>{album.count}</div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Add New Album Card */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div 
                                    onClick={() => setShowAddModal(true)}
                                    style={{ 
                                    height: '160px', 
                                    borderRadius: '12px', 
                                    border: '1px dashed #6366f1',
                                    background: '#EEF2FF',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        <Plus size={20} />
                                    </div>
                                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6366f1' }}>Add New Album</span>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Create New Album Modal */}
            {showAddModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white', borderRadius: '16px', padding: '30px',
                        width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#1A1A1A', fontWeight: '700' }}>
                            Create New Album
                        </h3>
                        <form onSubmit={handleCreateAlbum} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <input 
                                type="text"
                                placeholder="Album Title (e.g. Travel, Project)"
                                value={newAlbumTitle}
                                onChange={e => setNewAlbumTitle(e.target.value)}
                                required
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                                    border: '1px solid #E5E5E5', outline: 'none', fontSize: '0.95rem'
                                }}
                            />
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setShowAddModal(false)}
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
                                    Create Album
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Albums;
