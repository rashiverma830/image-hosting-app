import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
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

const Dashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState('/image/full-screen-size.png');
    const [currentImageBlob, setCurrentImageBlob] = useState(null);
    const [uploadedUrl, setUploadedUrl] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [copyStatus, setCopyStatus] = useState('Copy Image');
    const [copyLinkStatus, setCopyLinkStatus] = useState('Copy Link');
    const fileInputRef = useRef(null);

    const [bidItems, setBidItems] = useState([]);

    // Fetch images from database on load
    useEffect(() => {
        fetch('http://localhost:5000/api/images')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setBidItems(data);
                } else {
                    console.error("Backend did not return an array:", data);
                }
            })
            .catch(err => console.error("Failed to load images from DB:", err));
    }, []);

    // Sidebar Toggle
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
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
        const files = e.dataTransfer.files;
        handleFiles(files);
    };

    const handleFileInputChange = (e) => {
        handleFiles(e.target.files);
    };

    const handleFiles = async (files) => {
        let imageFile = null;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.startsWith('image/')) {
                imageFile = files[i];
                break;
            }
        }
        
        if (imageFile) {
            setCurrentImageBlob(imageFile);
            setUploadedUrl(null); // Reset URL until uploaded
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewSrc(e.target.result);
            };
            reader.readAsDataURL(imageFile);
            
            // Upload to backend to get real URL
            try {
                const formData = new FormData();
                formData.append('image', imageFile);
                const response = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();
                if (data.url) {
                    setUploadedUrl(data.url);
                    
                    // Add the new image to the bottom cards from MongoDB
                    if (data.image) {
                        setBidItems(prev => [data.image, ...prev]);
                    }
                }
            } catch (err) {
                console.error("Failed to upload image to backend:", err);
            }
        } else {
            alert("Koi valid image file nahi mili. Kripya image upload karein.");
        }
    };

    const handleCopyImage = async () => {
        if (!currentImageBlob) {
            alert("Copy karne ke liye pehle ek nayi image upload karein!");
            return;
        }
        
        try {
            // Copy actual image to clipboard
            await navigator.clipboard.write([
                new ClipboardItem({
                    [currentImageBlob.type]: currentImageBlob
                })
            ]);
            
            setCopyStatus("Image Copied ✓");
            setTimeout(() => setCopyStatus("Copy Image"), 2000);
        } catch (err) {
            console.error("Failed to copy image: ", err);
            alert("Image copy fail ho gaya. Shayad browser permission required hai.");
        }
    };

    const handleCopyLink = async () => {
        if (!uploadedUrl) {
            alert("Link copy karne ke liye pehle image upload hone ka wait karein!");
            return;
        }

        try {
            await navigator.clipboard.writeText(uploadedUrl);
            setCopyLinkStatus('Link Copied ✓');
            setTimeout(() => setCopyLinkStatus('Copy Link'), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
            alert("Link copy fail ho gaya.");
        }
    };

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
                <Header title="Dashboard" breadcrumbs="Dashboard" onToggleSidebar={toggleSidebar} />
                <main className="dashboard-content">
                    <div className="top-section">
                        <div className="upload-section">
                            <h3>Upload File</h3>
                            <div 
                                className="upload-box" 
                                id="dropZone" 
                                style={{ 
                                    transition: 'border-color 0.3s', 
                                    cursor: 'pointer',
                                    borderColor: isDragOver ? '#2F54EB' : '#D9D9D9',
                                    backgroundColor: isDragOver ? '#EEF2FF' : '#FAFAFA'
                                }} 
                                onClick={() => fileInputRef.current.click()}
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <div className="upload-icon">↑</div>
                                <p>Drag & drop files/folders here or click to browse</p>
                                <input 
                                    type="file" 
                                    id="fileInput" 
                                    multiple 
                                    accept="image/*" 
                                    style={{ display: 'none' }} 
                                    ref={fileInputRef}
                                    onChange={handleFileInputChange}
                                />
                                <button className="btn-dark" onClick={(e) => { e.stopPropagation(); fileInputRef.current.click(); }}>Browse File</button>
                            </div>
                        </div>
                        
                        <div className="preview-section">
                            <h3>Review Image</h3>
                            <div className="preview-card">
                                <div className="preview-img-container">
                                    <img src={previewSrc} id="previewImg" alt="Preview" />
                                    <div className="preview-overlay">
                                        <div className="bid-info">
                                            <span>Current Bid</span>
                                            <strong>2.55 ETH</strong>
                                        </div>
                                        <div className="auction-info">
                                            <span>Auction Time</span>
                                            <strong>20h 45m 15s</strong>
                                        </div>
                                    </div>
                                </div>
                                <div className="preview-details">
                                    <h4>Abstract 3D Design</h4>
                                    <div className="creator">
                                        <img src="https://ui-avatars.com/api/?name=Nella+Vita" alt="Creator" />
                                        <span>Nella Vita</span>
                                    </div>
                                    <div className="preview-actions">
                                        <button className="btn-outline" id="btnCopyImage" onClick={handleCopyImage}>{copyStatus}</button>
                                        <button className="btn-purple" onClick={handleCopyLink}>{copyLinkStatus}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: '40px', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1A1A1A', marginBottom: '20px' }}>Your Library</h2>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #E5E5E5', width: 'fit-content' }}>
                                <button onClick={() => navigate('/my-images')} style={{ background: 'none', border: 'none', borderBottom: '2px solid #6366f1', color: '#6366f1', padding: '10px 5px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer' }}>All Images</button>
                                <button style={{ background: 'none', border: 'none', color: '#666', padding: '10px 5px', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer' }}>Recent</button>
                                <button onClick={() => navigate('/saved')} style={{ background: 'none', border: 'none', color: '#666', padding: '10px 5px', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer' }}>Favorites</button>
                                <button onClick={() => navigate('/albums')} style={{ background: 'none', border: 'none', color: '#666', padding: '10px 5px', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer' }}>Albums</button>
                                <button onClick={() => navigate('/image/1')} style={{ background: 'none', border: 'none', color: '#666', padding: '10px 5px', fontWeight: '500', fontSize: '0.95rem', cursor: 'pointer' }}>Image Details</button>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button className="icon-btn" style={{ width: '38px', height: '38px', borderRadius: '8px' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                                </button>
                                <button className="icon-btn" style={{ width: '38px', height: '38px', borderRadius: '8px' }}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                                </button>
                                <select style={{ padding: '8px 15px', borderRadius: '8px', border: '1px solid #E5E5E5', outline: 'none', background: 'white', color: '#333', fontWeight: '500', cursor: 'pointer', height: '38px' }}>
                                    <option>Latest</option>
                                    <option>Oldest</option>
                                    <option>Size: L to S</option>
                                    <option>Size: S to L</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bids-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                        {bidItems.map(item => {
                            const savedList = JSON.parse(localStorage.getItem('savedItems') || '[]');
                            const isSaved = savedList.some(s => s.id === item.id);
                            
                            const fileName = item.title ? item.title.toLowerCase().replace(/\s+/g, '-') + '.jpg' : `image-${item.id}.jpg`;
                            const fileSize = (Math.random() * (5.0 - 0.5) + 0.5).toFixed(1) + ' MB';
                            
                            return (
                            <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div className="bid-img" onClick={() => navigate(`/image/${item.id}`)} style={{ height: '180px', position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}>
                                    <img src={item.img} alt="Uploaded Item" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.7)', borderRadius: '4px', cursor: 'pointer' }}></div>
                                    
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
                                            if (saved.some(s => s.id === item.id)) {
                                                localStorage.setItem('savedItems', JSON.stringify(saved.filter(s => s.id !== item.id)));
                                                e.target.style.color = 'rgba(255,255,255,0.7)';
                                            } else {
                                                localStorage.setItem('savedItems', JSON.stringify([...saved, item]));
                                                e.target.style.color = '#FF4D4F';
                                            }
                                        }}
                                        style={{
                                            position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', 
                                            border: 'none', borderRadius: '50%', width: '30px', height: '30px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', color: isSaved ? '#FF4D4F' : 'rgba(255,255,255,0.7)', fontSize: '1rem', transition: 'color 0.2s'
                                        }}
                                        title="Save Item"
                                    >
                                        ♥
                                    </button>
                                </div>
                                
                                <div>
                                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '2px' }}>{fileSize}</div>
                                </div>
                            </div>
                        )})}
                    </div>    
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

