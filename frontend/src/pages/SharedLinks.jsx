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

const SharedLinks = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const [links, setLinks] = useState([
        { id: 1, name: 'Portfolio Images', link: 'pixora.co/abc123', date: 'May 26, 2024', clicks: 24, status: true, img: 'https://picsum.photos/seed/portfolio/150/100' },
        { id: 2, name: 'Product Photos', link: 'pixora.co/def456', date: 'May 25, 2024', clicks: 15, status: true, img: 'https://picsum.photos/seed/products/150/100' },
        { id: 3, name: 'Nature Collection', link: 'pixora.co/ghi789', date: 'May 24, 2024', clicks: 32, status: true, img: 'https://picsum.photos/seed/nature2/150/100' },
        { id: 4, name: 'Interior Shots', link: 'pixora.co/jkl012', date: 'May 23, 2024', clicks: 8, status: false, img: 'https://picsum.photos/seed/interior/150/100' },
    ]);

    const toggleStatus = (id) => {
        setLinks(links.map(link => link.id === id ? { ...link, status: !link.status } : link));
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
                <Header title="Shared Links" breadcrumbs="Shared Links" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="dashboard-content">
                    
                    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #F0F0F0', marginTop: '20px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #F0F0F0', color: '#666', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>Preview</th>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>
                                        Name <svg style={{ marginLeft: '4px', verticalAlign: 'middle' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                    </th>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>Link</th>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>
                                        Created <svg style={{ marginLeft: '4px', verticalAlign: 'middle' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                    </th>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>Clicks</th>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {links.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #F0F0F0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#FAFAFA'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                                        <td style={{ padding: '15px 20px' }}>
                                            <img src={item.img} alt={item.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        </td>
                                        <td style={{ padding: '15px 20px', fontSize: '0.9rem', color: '#1A1A1A', fontWeight: '500' }}>{item.name}</td>
                                        <td style={{ padding: '15px 20px', fontSize: '0.9rem', color: '#6366f1' }}>{item.link}</td>
                                        <td style={{ padding: '15px 20px', fontSize: '0.85rem', color: '#666' }}>{item.date}</td>
                                        <td style={{ padding: '15px 20px', fontSize: '0.9rem', color: '#333' }}>{item.clicks}</td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <div 
                                                onClick={() => toggleStatus(item.id)}
                                                style={{ 
                                                    width: '40px', height: '22px', 
                                                    background: item.status ? '#6366f1' : '#D1D5DB', 
                                                    borderRadius: '11px', 
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    transition: 'background 0.3s'
                                                }}
                                            >
                                                <div style={{ 
                                                    position: 'absolute', top: '2px', 
                                                    left: item.status ? '20px' : '2px', 
                                                    width: '18px', height: '18px', 
                                                    background: 'white', 
                                                    borderRadius: '50%', 
                                                    transition: 'left 0.3s',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                                }}></div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                </main>
            </div>
        </div>
    );
};

export default SharedLinks;
