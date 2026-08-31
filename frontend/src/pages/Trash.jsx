import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
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

const Trash = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    const [trashItems, setTrashItems] = useState([
        { id: 1, name: 'old-project.png', date: 'May 26, 2024', size: '1.2 MB', img: 'https://picsum.photos/seed/old/150/100' },
        { id: 2, name: 'sunset-photo.jpg', date: 'May 25, 2024', size: '2.3 MB', img: 'https://picsum.photos/seed/sunset/150/100' },
        { id: 3, name: 'temp-image.webp', date: 'May 24, 2024', size: '1.1 MB', img: 'https://picsum.photos/seed/temp/150/100' },
    ]);

    const deleteItem = (id) => {
        setTrashItems(trashItems.filter(item => item.id !== id));
    };

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        
        const handleEmpty = () => {
            if(window.confirm("Are you sure you want to permanently delete all items in the trash?")) {
                setTrashItems([]);
            }
        };
        const handleRestore = () => {
            alert("All items have been restored to your library!");
            setTrashItems([]);
        };

        window.addEventListener('empty-trash', handleEmpty);
        window.addEventListener('restore-trash', handleRestore);

        return () => {
            document.body.classList.remove('dashboard-body');
            window.removeEventListener('empty-trash', handleEmpty);
            window.removeEventListener('restore-trash', handleRestore);
        }
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
                <Header title="Trash" breadcrumbs="Trash" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="dashboard-content">
                    
                    {/* Alert Banner */}
                    <div style={{ background: '#EEF2FF', borderRadius: '8px', padding: '15px 20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#6366f1', fontSize: '0.95rem', fontWeight: '500', marginTop: '10px' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Items in trash will be permanently deleted after 30 days.
                    </div>

                    {/* Table */}
                    <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.02)', border: '1px solid #F0F0F0', marginTop: '25px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #F0F0F0', color: '#666', fontSize: '0.85rem' }}>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>Preview</th>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>
                                        Name <svg style={{ marginLeft: '4px', verticalAlign: 'middle' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                                    </th>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>Deleted On</th>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>Size</th>
                                    <th style={{ padding: '20px', fontWeight: '600' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trashItems.map(item => (
                                    <tr key={item.id} style={{ borderBottom: '1px solid #F0F0F0', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#FAFAFA'} onMouseOut={e => e.currentTarget.style.background = 'white'}>
                                        <td style={{ padding: '15px 20px' }}>
                                            <img src={item.img} alt={item.name} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                        </td>
                                        <td style={{ padding: '15px 20px', fontSize: '0.9rem', color: '#1A1A1A', fontWeight: '500' }}>{item.name}</td>
                                        <td style={{ padding: '15px 20px', fontSize: '0.85rem', color: '#666' }}>{item.date}</td>
                                        <td style={{ padding: '15px 20px', fontSize: '0.9rem', color: '#333' }}>{item.size}</td>
                                        <td style={{ padding: '15px 20px' }}>
                                            <button 
                                                onClick={() => deleteItem(item.id)}
                                                style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', padding: '5px 0' }}
                                                onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                                                onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                                            >
                                                Delete Permanently
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {trashItems.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#999' }}>Trash is empty</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                </main>
            </div>
        </div>
    );
};

export default Trash;
