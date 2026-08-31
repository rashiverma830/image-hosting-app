import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
  Home, 
  Image as ImageIcon, 
  BookImage, 
  Link as LinkIcon, 
  Heart, 
  Trash2, 
  BarChart2, 
  Wand2, 
  Code,
  Crown
} from 'lucide-react';
import '../styles/dashboard.css';

const Albums = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const [albums, setAlbums] = useState([
        { id: 1, title: 'Nature', count: '124 images', img: 'https://picsum.photos/seed/nature/500/300' },
        { id: 2, title: 'Architecture', count: '45 images', img: 'https://picsum.photos/seed/architecture/500/300' },
        { id: 3, title: 'Products', count: '89 images', img: 'https://picsum.photos/seed/products/500/300' },
        { id: 4, title: 'Portraits', count: '12 images', img: 'https://picsum.photos/seed/portraits/500/300' },
        { id: 5, title: 'Interiors', count: '23 images', img: 'https://picsum.photos/seed/interiors/500/300' },
        { id: 6, title: 'Cars', count: '34 images', img: 'https://picsum.photos/seed/cars/500/300' },
        { id: 7, title: 'Minimal', count: '18 images', img: 'https://picsum.photos/seed/minimal/500/300' },
    ]);

    const handleAddAlbum = () => {
        const title = window.prompt("Enter new album name:");
        if (title) {
            const newAlbum = {
                id: Date.now(),
                title: title,
                count: '0 images',
                img: `https://picsum.photos/seed/${title.toLowerCase().replace(/\s+/g, '')}/500/300`
            };
            setAlbums([...albums, newAlbum]);
        }
    };

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => document.body.classList.remove('dashboard-body');
    }, []);

    return (
        <div className="dashboard-layout">
            <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} id="sidebar">
                <div className="sidebar-header">
                    <div className="logo" style={{ padding: '0', display: 'flex', alignItems: 'center' }}>
                        <img src="/logo.png" alt="Lumina Logo" style={{ height: '32px', objectFit: 'contain' }} />
                    </div>
                </div>
                
                <div style={{ padding: '0 20px', marginBottom: '15px' }}>
                    <div className="sidebar-search" style={{ background: 'white', borderRadius: '10px', padding: '10px 15px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)', border: '1px solid #E5E5E5' }}>
                        <span style={{ display: 'flex', alignItems: 'center', color: '#666' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </span>
                        <input type="text" placeholder="Search..." style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.9rem', color: '#333' }} />
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Home className="icon" size={20} /> Dashboard</NavLink>
                    <NavLink to="/saved" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Heart className="icon" size={20} /> Favorites</NavLink>
                    <NavLink to="/my-images" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><ImageIcon className="icon" size={20} /> My Images</NavLink>
                    <NavLink to="/image/1" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><ImageIcon className="icon" size={20} /> Image Details</NavLink>
                    <NavLink to="/albums" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><BookImage className="icon" size={20} /> Albums</NavLink>
                    <NavLink to="/shared-links" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><LinkIcon className="icon" size={20} /> Shared Links</NavLink>
                    <NavLink to="/trash" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Trash2 className="icon" size={20} /> Trash</NavLink>
                    
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', marginTop: '20px', marginBottom: '10px', paddingLeft: '20px', letterSpacing: '0.05em' }}>TOOLS</h3>
                    <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><BarChart2 className="icon" size={20} /> Analytics</NavLink>
                    <NavLink to="/image-tools" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Wand2 className="icon" size={20} /> Image Tools</NavLink>
                    <NavLink to="/api-access" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Code className="icon" size={20} /> API Access</NavLink>
                </nav>
                
                <div className="storage-card" style={{ margin: '20px', background: 'white', borderRadius: '16px', padding: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#666' }}>Storage Used</h4>
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111' }}>23.4 GB</span>
                        <span style={{ fontSize: '0.85rem', color: '#999' }}> / 100 GB</span>
                    </div>
                    <div style={{ height: '6px', background: '#f0f0f0', borderRadius: '10px', marginBottom: '15px', overflow: 'hidden' }}>
                        <div style={{ width: '23.4%', height: '100%', background: '#6366f1', borderRadius: '10px' }}></div>
                    </div>
                    <button onClick={() => navigate('/pricing')} style={{ width: '100%', padding: '10px', background: '#EEF2FF', color: '#6366f1', border: 'none', borderRadius: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
                        <Crown size={16} /> Upgrade Plan
                    </button>
                </div>
            </aside>
            <div className="main-wrapper">
                <Header title="Albums" breadcrumbs="Albums" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="dashboard-content">
                    
                    <div className="bids-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '30px', marginTop: '20px' }}>
                        {albums.map(album => (
                            <div key={album.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ height: '160px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                                    <img src={album.img} alt={album.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
                                onClick={handleAddAlbum}
                                style={{ 
                                height: '160px', 
                                borderRadius: '12px', 
                                border: '1px solid #E5E5E5',
                                background: '#FAFAFA',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #999', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                </div>
                                <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#333' }}>Add New Album</span>
                            </div>
                        </div>
                    </div>
                    
                </main>
            </div>
        </div>
    );
};

export default Albums;
