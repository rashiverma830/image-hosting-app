import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Header from '../components/Header';
import Logo from '../components/Logo';
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

const MyImages = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [images, setImages] = useState([]);

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => document.body.classList.remove('dashboard-body');
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/images')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setImages(data);
                }
            })
            .catch(err => console.error("Failed to load images:", err));
    }, []);

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
                <Header title="My Images" breadcrumbs="My Images" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="dashboard-content">
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '30px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #E5E5E5', width: 'fit-content' }}>
                            <button style={{ background: 'none', border: 'none', borderBottom: '2px solid #6366f1', color: '#6366f1', padding: '10px 5px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}>All ({images.length || 345})</button>
                            <button style={{ background: 'none', border: 'none', color: '#666', padding: '10px 5px', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer' }}>Images (300)</button>
                            <button style={{ background: 'none', border: 'none', color: '#666', padding: '10px 5px', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer' }}>Videos (45)</button>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div style={{ position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </span>
                                <input type="text" placeholder="Search images..." style={{ padding: '8px 15px 8px 30px', borderRadius: '8px', border: '1px solid #E5E5E5', outline: 'none', fontSize: '0.85rem', width: '180px' }} />
                            </div>
                            <select style={{ padding: '8px', borderRadius: '8px', border: '1px solid #E5E5E5', outline: 'none', background: 'white', color: '#666', fontSize: '0.85rem' }}>
                                <option>Type</option>
                            </select>
                            <select style={{ padding: '8px', borderRadius: '8px', border: '1px solid #E5E5E5', outline: 'none', background: 'white', color: '#666', fontSize: '0.85rem' }}>
                                <option>Size</option>
                            </select>
                            <select style={{ padding: '8px', borderRadius: '8px', border: '1px solid #E5E5E5', outline: 'none', background: 'white', color: '#666', fontSize: '0.85rem' }}>
                                <option>Date</option>
                            </select>
                            
                            <div style={{ display: 'flex', background: '#EEF2FF', borderRadius: '6px', padding: '2px', marginLeft: '5px' }}>
                                <button style={{ background: 'white', border: 'none', borderRadius: '4px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                                </button>
                                <button style={{ background: 'transparent', border: 'none', borderRadius: '4px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bids-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {images.length > 0 ? images.map(item => {
                            const fileName = item.title ? item.title.toLowerCase().replace(/\s+/g, '-') + '.jpg' : `image-${item.id}.jpg`;
                            const fileSize = (Math.random() * (5.0 - 0.5) + 0.5).toFixed(1) + ' MB';
                            return (
                            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className="bid-img" onClick={() => navigate(`/image/${item.id}`)} style={{ height: '180px', position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
                                    <img src={item.img} alt="Image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.7)', borderRadius: '4px', cursor: 'pointer' }}></div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '2px' }}>{fileSize}</div>
                                </div>
                            </div>
                        )}) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', color: '#999' }}>No images found. Upload some images to see them here.</div>
                        )}
                    </div>
                    
                    {/* Hidden file input for Upload Images button */}
                    <input type="file" id="fileInput" style={{ display: 'none' }} />
                </main>
            </div>
        </div>
    );
};

export default MyImages;
