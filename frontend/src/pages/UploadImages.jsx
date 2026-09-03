import React, { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
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

const UploadImages = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const [files, setFiles] = useState([
        { id: 1, name: 'mountain-lake.jpg', size: '2.4 MB', progress: 100, img: 'https://picsum.photos/seed/mountain/300/300' },
        { id: 2, name: 'architecture.avif', size: '2.9 MB', progress: 100, img: 'https://picsum.photos/seed/archi/300/300' },
        { id: 3, name: 'interior-design.jpg', size: '1.7 MB', progress: 100, img: 'https://picsum.photos/seed/interior2/300/300' }
    ]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => document.body.classList.remove('dashboard-body');
    }, []);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        // Normally handle files here
    };

    const clearAll = () => {
        setFiles([]);
    };

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
                <Header title="Upload Images" breadcrumbs="Upload" onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
                <main className="dashboard-content" style={{ maxWidth: '800px' }}>
                    
                    {/* Drag and Drop Zone */}
                    <div 
                        style={{ 
                            border: `2px dashed ${isDragOver ? '#6366f1' : '#E5E5E5'}`, 
                            borderRadius: '16px', 
                            padding: '40px 20px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            background: isDragOver ? '#EEF2FF' : 'white',
                            transition: 'all 0.3s',
                            marginBottom: '40px'
                        }}
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div style={{ color: '#6366f1', marginBottom: '15px' }}>
                            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                                <path d="M12 12v9"></path>
                                <path d="m16 16-4-4-4 4"></path>
                            </svg>
                        </div>
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#333' }}>Drag & drop images or folders here</h3>
                        <p style={{ margin: '0 0 15px 0', color: '#999', fontSize: '0.9rem' }}>or</p>
                        
                        <button onClick={() => fileInputRef.current?.click()} style={{ background: '#6366f1', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', marginBottom: '30px' }}>
                            Browse Files
                        </button>
                        <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple />
                        
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FAFAFA', padding: '8px 15px', borderRadius: '30px', border: '1px solid #F0F0F0', fontSize: '0.75rem', color: '#666' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                Up to 50 MB per file
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FAFAFA', padding: '8px 15px', borderRadius: '30px', border: '1px solid #F0F0F0', fontSize: '0.75rem', color: '#666' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                                JPG, PNG, WEBP, GIF
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FAFAFA', padding: '8px 15px', borderRadius: '30px', border: '1px solid #F0F0F0', fontSize: '0.75rem', color: '#666' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                Private & Encrypted
                            </div>
                        </div>
                    </div>

                    {/* File List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                        {files.map(file => (
                            <div key={file.id} style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={file.img} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                        <div>
                                            <div style={{ fontSize: '0.95rem', fontWeight: '500', color: '#333' }}>{file.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#999' }}>{file.size}</div>
                                        </div>
                                        <div style={{ fontSize: '0.85rem', color: '#333', fontWeight: '600' }}>{file.progress}%</div>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: '#EEF2FF', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: `${file.progress}%`, height: '100%', background: '#6366f1', borderRadius: '2px' }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button onClick={clearAll} style={{ padding: '12px 30px', background: 'white', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '600', color: '#333', cursor: 'pointer' }}>
                            Clear all
                        </button>
                        <button style={{ padding: '12px 30px', background: '#6366f1', border: 'none', borderRadius: '8px', fontWeight: '600', color: 'white', cursor: 'pointer' }}>
                            Upload all
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
};

export default UploadImages;
