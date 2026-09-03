import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
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
  Crown,
  Save,
  Upload,
  Check,
  Eye
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
    const [uploadQueue, setUploadQueue] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [showMoveModal, setShowMoveModal] = useState(false);
    const [selectedAlbum, setSelectedAlbum] = useState('Nature');
    const [customAlbumName, setCustomAlbumName] = useState('');
    const [moveSuccessMsg, setMoveSuccessMsg] = useState('');

    const handleSelectAll = () => {
        if (selectedItems.length === bidItems.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(bidItems.map(item => item.id));
        }
    };

    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [previewModalImage, setPreviewModalImage] = useState(null);
    const [copySuccessToast, setCopySuccessToast] = useState(null);
    const [saveStatus, setSaveStatus] = useState('Save');
    const [toastMessage, setToastMessage] = useState(null);

    const handleSave = () => {
        const savedList = JSON.parse(localStorage.getItem('savedItems') || '[]');
        let itemsToSave = [];

        if (uploadQueue.length > 0) {
            itemsToSave = uploadQueue.map(item => ({
                id: item.imageId || item.id,
                title: item.name ? item.name.replace(/\.[^/.]+$/, "") : 'Uploaded Image',
                name: item.name || 'Uploaded Image',
                img: item.url || item.img,
                url: item.url || item.img,
                bid: '0.00 ETH',
                time: '24h 00m'
            }));
        } else if (uploadedUrl || previewSrc) {
            itemsToSave = [{
                id: Date.now().toString(),
                title: currentImageBlob ? currentImageBlob.name.replace(/\.[^/.]+$/, "") : 'Reviewed Image',
                name: currentImageBlob ? currentImageBlob.name : 'Reviewed Image',
                img: uploadedUrl || previewSrc,
                url: uploadedUrl || previewSrc,
                bid: '0.00 ETH',
                time: '24h 00m'
            }];
        }

        if (itemsToSave.length > 0) {
            const existingIds = new Set(savedList.map(s => s.id));
            const newItems = itemsToSave.filter(item => !existingIds.has(item.id));
            const updatedSaved = [...newItems, ...savedList];
            localStorage.setItem('savedItems', JSON.stringify(updatedSaved));

            // Also ensure in bidItems (Your Library)
            setBidItems(prev => {
                const currentIds = new Set(prev.map(p => p.id));
                const toAdd = itemsToSave.filter(item => !currentIds.has(item.id));
                return [...toAdd, ...prev];
            });
        }

        setSaveStatus('Saved ✓');
        setToastMessage({ title: 'Saved to Library!', detail: `${itemsToSave.length} image(s) saved successfully.` });
        setTimeout(() => {
            setSaveStatus('Save');
            setToastMessage(null);
        }, 2500);
    };

    const copyTextToClipboard = async (textToCopy, btnElement) => {
        let fullUrl = textToCopy;
        if (fullUrl && fullUrl.startsWith('/')) {
            fullUrl = `http://localhost:5000${fullUrl}`;
        }
        if (!fullUrl || fullUrl.startsWith('blob:')) {
            fullUrl = window.location.origin + '/dashboard';
        }

        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(fullUrl);
            } else {
                const ta = document.createElement('textarea');
                ta.value = fullUrl;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }

            if (btnElement) {
                btnElement.style.background = '#DCFCE7';
                btnElement.style.borderColor = '#86EFAC';
                btnElement.style.color = '#16A34A';
                setTimeout(() => {
                    btnElement.style.background = 'white';
                    btnElement.style.borderColor = '#E5E5E5';
                    btnElement.style.color = '#444';
                }, 2000);
            }

            setCopySuccessToast(fullUrl);
            setTimeout(() => setCopySuccessToast(null), 3000);
        } catch (err) {
            console.error("Copy failed:", err);
            alert("Copied link: " + fullUrl);
        }
    };

    const handleBulkDelete = () => {
        if (selectedItems.length === 0) {
            alert("Pehle delete karne ke liye images select karein!");
            return;
        }
        setShowDeleteConfirmModal(true);
    };

    const handleConfirmDeleteModal = async () => {
        const idsToDelete = [...selectedItems];
        const deletedObjects = bidItems.filter(item => idsToDelete.includes(item.id));
        
        // Save to trashedItems in localStorage for Trash page
        const existingTrash = JSON.parse(localStorage.getItem('trashedItems') || '[]');
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        const newTrashEntries = deletedObjects.map(item => ({
            id: item.id,
            name: item.title || item.name || 'image.jpg',
            date: today,
            size: item.size || '2.4 MB',
            img: item.img || item.url,
            url: item.url || item.img
        }));

        localStorage.setItem('trashedItems', JSON.stringify([...newTrashEntries, ...existingTrash]));

        setBidItems(prev => prev.filter(item => !idsToDelete.includes(item.id)));
        setSelectedItems([]);
        setShowDeleteConfirmModal(false);
    };

    const handleConfirmMove = (e) => {
        e.preventDefault();
        const albumName = selectedAlbum === 'NEW' ? customAlbumName : selectedAlbum;
        if (!albumName.trim()) return;

        const savedAlbumData = JSON.parse(localStorage.getItem('albumMappings') || '{}');
        const existing = savedAlbumData[albumName] || [];
        const selectedObjects = bidItems.filter(item => selectedItems.includes(item.id));
        const existingIds = new Set(existing.map(item => item.id || item));
        const newObjects = selectedObjects.filter(item => !existingIds.has(item.id));
        
        savedAlbumData[albumName] = [...existing, ...newObjects];
        localStorage.setItem('albumMappings', JSON.stringify(savedAlbumData));

        setMoveSuccessMsg(`✓ Successfully moved ${selectedItems.length} image(s) to album "${albumName}"!`);
        setTimeout(() => setMoveSuccessMsg(''), 4000);

        setSelectedItems([]);
        setShowMoveModal(false);
        setCustomAlbumName('');
    };

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
        document.body.classList.remove('dark-mode');
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
        if (!files || files.length === 0) return;

        const newQueueItems = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                const previewUrl = URL.createObjectURL(file);
                const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
                const queueId = Date.now() + '-' + i + '-' + Math.random().toString(36).substr(2, 4);

                const newItem = {
                    id: queueId,
                    name: file.name,
                    size: sizeMB,
                    progress: 100,
                    img: previewUrl,
                    url: null,
                    imageId: null
                };
                newQueueItems.push(newItem);

                if (i === 0) {
                    setCurrentImageBlob(file);
                    setPreviewSrc(previewUrl);
                }

                (async () => {
                    try {
                        const formData = new FormData();
                        formData.append('image', file);
                        const response = await fetch('http://localhost:5000/api/upload', {
                            method: 'POST',
                            body: formData
                        });
                        const data = await response.json();
                        if (data.url) {
                            if (i === 0) setUploadedUrl(data.url);
                            if (data.image) {
                                setBidItems(prev => [data.image, ...prev]);
                            }
                            setUploadQueue(prev => prev.map(item => item.id === queueId ? { ...item, url: data.url, imageId: data.image?.id || '1' } : item));
                        }
                    } catch (err) {
                        console.error("Upload error:", err);
                    }
                })();
            }
        }

        if (newQueueItems.length > 0) {
            setUploadQueue(prev => [...newQueueItems, ...prev]);
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
                <Header title="Dashboard" breadcrumbs="Dashboard" onToggleSidebar={toggleSidebar} />
                <main className="dashboard-content">
                    <div className="top-section" style={{ alignItems: 'stretch' }}>
                        <div className="upload-section" style={{ display: 'flex', flexDirection: 'column' }}>
                            <h3>Upload File</h3>
                            <div 
                                className="upload-box" 
                                id="dropZone" 
                                style={{ 
                                    flex: 1,
                                    minHeight: '400px',
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
                            {uploadQueue.length === 0 ? (
                                <>
                                    <h3>Review Image</h3>
                                    <div className="preview-card">
                                        <div className="preview-img-container">
                                            <img src={previewSrc} id="previewImg" alt="Preview" />
                                        </div>
                                        <div className="preview-details">
                                            <div className="preview-actions">
                                                <button className="btn-outline" id="btnCopyImage" onClick={handleCopyImage}>{copyStatus}</button>
                                                <button className="btn-purple" onClick={handleCopyLink}>{copyLinkStatus}</button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '28px',
                                    border: '1px solid #E5E5E5',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '24px'
                                }}>
                                    {/* Header Row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{
                                                width: '48px', height: '48px', borderRadius: '50%',
                                                background: '#EEF2FF', display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', color: '#6366f1', flexShrink: 0
                                            }}>
                                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/>
                                                    <polyline points="16 16 12 12 8 16"/>
                                                    <line x1="12" y1="12" x2="12" y2="21"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <h3 style={{ margin: 0, fontSize: '1.3rem', color: '#1A1A1A', fontWeight: '700' }}>Uploading Files</h3>
                                                    <span style={{
                                                        background: '#EEF2FF', color: '#6366f1', borderRadius: '20px',
                                                        padding: '2px 10px', fontSize: '0.85rem', fontWeight: '700'
                                                    }}>
                                                        {uploadQueue.length}
                                                    </span>
                                                </div>
                                                <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: '#888' }}>
                                                    Please wait while your files are being uploaded...
                                                </p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setUploadQueue([])}
                                            style={{
                                                background: 'none', border: 'none', color: '#999',
                                                fontSize: '1.2rem', cursor: 'pointer', padding: '4px',
                                                transition: 'color 0.2s'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.color='#333'}
                                            onMouseOut={e => e.currentTarget.style.color='#999'}
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    {/* Item Cards List with Scrollbar */}
                                    <div className="upload-queue-scroll-container">
                                        {uploadQueue.map((item) => {
                                            const ext = item.name.split('.').pop().toUpperCase();
                                            return (
                                                <div key={item.id} style={{
                                                    background: 'white', borderRadius: '16px', padding: '16px 18px',
                                                    border: '1px solid #EAEAEA', display: 'flex', alignItems: 'center',
                                                    gap: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
                                                }}>
                                                    {/* Thumbnail */}
                                                    <img 
                                                        src={item.img} 
                                                        alt={item.name} 
                                                        style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }} 
                                                    />

                                                    {/* Info & Progress */}
                                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div style={{ overflow: 'hidden' }}>
                                                                <div style={{
                                                                    fontSize: '0.88rem', fontWeight: '700', color: '#1E293B',
                                                                    maxWidth: '260px', overflow: 'hidden', textOverflow: 'ellipsis',
                                                                    whiteSpace: 'nowrap'
                                                                }} title={item.name}>
                                                                    {item.name}
                                                                </div>
                                                                <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>{item.size} • {ext}</div>
                                                            </div>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                                                                <span style={{ fontSize: '0.88rem', fontWeight: '700', color: '#16A34A' }}>{item.progress}%</span>
                                                                <span style={{ color: '#16A34A', fontSize: '0.9rem', fontWeight: 'bold' }}>✓</span>
                                                            </div>
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div style={{ width: '100%', height: '3px', background: '#EEF2FF', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${item.progress}%`, height: '100%', background: '#6366f1', borderRadius: '3px', transition: 'width 0.3s' }}></div>
                                                        </div>

                                                        {/* Status Tag & Right Action Icons */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                                                            <span style={{
                                                                background: '#DCFCE7', color: '#16A34A', padding: '3px 12px',
                                                                borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600'
                                                            }}>
                                                                Completed
                                                            </span>
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <button
                                                                    onClick={() => setPreviewModalImage({
                                                                        id: item.imageId || item.id || '1',
                                                                        title: item.name || 'Uploaded Image',
                                                                        img: item.img || item.url,
                                                                        url: item.url || item.img
                                                                    })}
                                                                    style={{
                                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                                        border: '1px solid #E2E8F0', background: 'white',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        cursor: 'pointer', color: '#475569', transition: 'all 0.2s'
                                                                    }}
                                                                    title="View Image"
                                                                    onMouseOver={e => e.currentTarget.style.background='#F1F5F9'}
                                                                    onMouseOut={e => e.currentTarget.style.background='white'}
                                                                >
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                                                        <circle cx="12" cy="12" r="3"></circle>
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={(e) => copyTextToClipboard(item.url || item.img, e.currentTarget)}
                                                                    style={{
                                                                        width: '32px', height: '32px', borderRadius: '8px',
                                                                        border: '1px solid #E2E8F0', background: 'white',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        cursor: 'pointer', color: '#475569', transition: 'all 0.2s'
                                                                    }}
                                                                    title="Copy Link"
                                                                    onMouseOver={e => { if (e.currentTarget.style.background !== 'rgb(220, 252, 231)') e.currentTarget.style.background='#F1F5F9'; }}
                                                                    onMouseOut={e => { if (e.currentTarget.style.background !== 'rgb(220, 252, 231)') e.currentTarget.style.background='white'; }}
                                                                >
                                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                                                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Footer Row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #F0F0F0', gap: '15px' }}>
                                        <span style={{ fontSize: '0.9rem', color: '#888', fontWeight: '500', whiteSpace: 'nowrap' }}>
                                            {uploadQueue.length} of {uploadQueue.length} files uploaded
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                                            <button
                                                onClick={() => setUploadQueue([])}
                                                style={{
                                                    background: 'none', border: 'none', color: '#666',
                                                    fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
                                                    whiteSpace: 'nowrap', padding: '8px 10px'
                                                }}
                                                onMouseOver={e => e.currentTarget.style.color='#1A1A1A'}
                                                onMouseOut={e => e.currentTarget.style.color='#666'}
                                            >
                                                Clear all
                                            </button>
                                            <button
                                                onClick={() => fileInputRef.current.click()}
                                                style={{
                                                    padding: '10px 22px', background: '#6366f1', color: 'white',
                                                    border: 'none', borderRadius: '12px', fontWeight: '600',
                                                    fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex',
                                                    alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                    whiteSpace: 'nowrap', flexShrink: 0,
                                                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={e => e.currentTarget.style.background='#4f46e5'}
                                                onMouseOut={e => e.currentTarget.style.background='#6366f1'}
                                            >
                                                <Upload size={18} />
                                                <span style={{ whiteSpace: 'nowrap' }}>Upload</span>
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                style={{
                                                    padding: '10px 22px', 
                                                    background: saveStatus === 'Saved ✓' ? '#16A34A' : '#10B981', 
                                                    color: 'white',
                                                    border: 'none', borderRadius: '12px', fontWeight: '600',
                                                    fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex',
                                                    alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                    whiteSpace: 'nowrap', flexShrink: 0,
                                                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseOver={e => { if (saveStatus !== 'Saved ✓') e.currentTarget.style.background='#059669'; }}
                                                onMouseOut={e => { if (saveStatus !== 'Saved ✓') e.currentTarget.style.background='#10B981'; }}
                                            >
                                                {saveStatus === 'Saved ✓' ? <Check size={18} /> : <Save size={18} />}
                                                <span style={{ whiteSpace: 'nowrap' }}>{saveStatus}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
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

                                <select
                                    value=""
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === 'select-all') {
                                            setSelectedItems(bidItems.map(item => item.id));
                                        } else if (val === 'deselect-all') {
                                            setSelectedItems([]);
                                        } else if (val === 'move-album') {
                                            if (selectedItems.length === 0) {
                                                alert("Pehle album mein move karne ke liye images select karein!");
                                            } else {
                                                setShowMoveModal(true);
                                            }
                                        } else if (val === 'delete-selected') {
                                            handleBulkDelete();
                                        }
                                    }}
                                    style={{ 
                                        padding: '8px 15px', 
                                        borderRadius: '8px', 
                                        border: '1px solid #E5E5E5', 
                                        outline: 'none', 
                                        background: selectedItems.length > 0 ? '#EEF2FF' : 'white', 
                                        color: selectedItems.length > 0 ? '#6366f1' : '#333', 
                                        fontWeight: '600', 
                                        fontSize: '0.85rem', 
                                        cursor: 'pointer', 
                                        height: '38px' 
                                    }}
                                >
                                    <option value="" disabled hidden>
                                        {selectedItems.length > 0 ? `Selected (${selectedItems.length}) ▾` : 'Select ▾'}
                                    </option>
                                    <option value="select-all">✓ Select All</option>
                                    <option value="deselect-all">✕ Deselect All</option>
                                    <option value="move-album" disabled={selectedItems.length === 0}>
                                        📁 Move to Album {selectedItems.length > 0 ? `(${selectedItems.length})` : ''}
                                    </option>
                                    {selectedItems.length > 0 && (
                                        <option value="delete-selected">🗑 Delete Selected ({selectedItems.length})</option>
                                    )}
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
                                <div 
                                    className="card-img-container" 
                                    onClick={() => setPreviewModalImage({
                                        id: item.id,
                                        title: item.title || item.name || 'Uploaded Image',
                                        img: item.img || item.url,
                                        url: item.url || item.img
                                    })}
                                >
                                    <img src={item.img} alt={item.title || "Uploaded Item"} />

                                    {/* Top-Right Selection Checkbox */}
                                    <div 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (selectedItems.includes(item.id)) {
                                                setSelectedItems(selectedItems.filter(id => id !== item.id));
                                            } else {
                                                setSelectedItems([...selectedItems, item.id]);
                                            }
                                        }}
                                        style={{ 
                                            position: 'absolute', top: '10px', right: '10px', 
                                            width: '22px', height: '22px', 
                                            border: selectedItems.includes(item.id) ? 'none' : '2px solid rgba(255,255,255,0.9)', 
                                            borderRadius: '5px', cursor: 'pointer',
                                            background: selectedItems.includes(item.id) ? '#6366f1' : 'rgba(0,0,0,0.3)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: 'white', fontWeight: 'bold', fontSize: '0.75rem',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                            zIndex: 6
                                        }}>
                                        {selectedItems.includes(item.id) && '✓'}
                                    </div>
                                    
                                    {/* Bottom-Right Save/Heart Button */}
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
                                            cursor: 'pointer', color: isSaved ? '#FF4D4F' : 'rgba(255,255,255,0.7)', fontSize: '1rem', transition: 'color 0.2s',
                                            zIndex: 6
                                        }}
                                        title="Save Item"
                                    >
                                        ♥
                                    </button>

                                    {/* Center Hover Overlay with Eye and Copy Link Buttons */}
                                    <div className="card-hover-overlay">
                                        <button 
                                            className="card-hover-eye-btn" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setPreviewModalImage({
                                                    id: item.id,
                                                    title: item.title || item.name || 'Uploaded Image',
                                                    img: item.img || item.url,
                                                    url: item.url || item.img
                                                });
                                            }}
                                        >
                                            <Eye size={22} strokeWidth={2.3} />
                                        </button>

                                        <button 
                                            className="card-hover-copy-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const copyText = item.url || item.img;
                                                const btn = e.currentTarget;
                                                const copy = (text) => {
                                                    if (navigator.clipboard && window.isSecureContext) {
                                                        return navigator.clipboard.writeText(text);
                                                    } else {
                                                        const ta = document.createElement('textarea');
                                                        ta.value = text;
                                                        ta.style.position = 'fixed';
                                                        ta.style.opacity = '0';
                                                        document.body.appendChild(ta);
                                                        ta.focus(); ta.select();
                                                        document.execCommand('copy');
                                                        document.body.removeChild(ta);
                                                        return Promise.resolve();
                                                    }
                                                };
                                                copy(copyText).then(() => {
                                                    btn.textContent = '✓ Copied!';
                                                    btn.style.background = '#10B981';
                                                    btn.style.color = '#FFFFFF';
                                                    setTimeout(() => {
                                                        btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>Copy Link';
                                                        btn.style.background = 'rgba(255, 255, 255, 0.95)';
                                                        btn.style.color = '#1E293B';
                                                    }, 1800);
                                                });
                                            }}
                                        >
                                            <LinkIcon size={13} strokeWidth={2.2} />
                                            Copy Link
                                        </button>
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                                    <button 
                                        onClick={() => setPreviewModalImage({
                                            id: item.id,
                                            title: item.title || item.name || 'Uploaded Image',
                                            img: item.img || item.url,
                                            url: item.url || item.img
                                        })}
                                        style={{
                                            flex: 1, padding: '5px 8px', height: '30px', background: '#6366f1', color: 'white',
                                            border: 'none', borderRadius: '6px', fontWeight: '600',
                                            fontSize: '0.72rem', cursor: 'pointer', transition: 'background 0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background='#4f46e5'}
                                        onMouseOut={e => e.currentTarget.style.background='#6366f1'}
                                    >
                                        <Eye size={13} />
                                        View Image
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            const copyText = item.url || item.img;
                                            const btn = e.currentTarget;
                                            const copy = (text) => {
                                                if (navigator.clipboard && window.isSecureContext) {
                                                    return navigator.clipboard.writeText(text);
                                                } else {
                                                    const ta = document.createElement('textarea');
                                                    ta.value = text;
                                                    ta.style.position = 'fixed';
                                                    ta.style.opacity = '0';
                                                    document.body.appendChild(ta);
                                                    ta.focus(); ta.select();
                                                    document.execCommand('copy');
                                                    document.body.removeChild(ta);
                                                    return Promise.resolve();
                                                }
                                            };
                                            copy(copyText).then(() => {
                                                btn.textContent = '✓ Copied!';
                                                btn.style.background = '#dcfce7';
                                                btn.style.color = '#16a34a';
                                                btn.style.border = '1px solid #86efac';
                                                setTimeout(() => {
                                                    btn.textContent = 'Copy Link';
                                                    btn.style.background = 'white';
                                                    btn.style.color = '#333';
                                                    btn.style.border = '1px solid #E5E5E5';
                                                }, 2000);
                                            });
                                        }}
                                        style={{
                                            flex: 1, padding: '5px 8px', height: '30px', background: 'white', color: '#333',
                                            border: '1px solid #E5E5E5', borderRadius: '6px', fontWeight: '600',
                                            fontSize: '0.72rem', cursor: 'pointer', transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            whiteSpace: 'nowrap'
                                        }}
                                        onMouseOver={e => { if (e.currentTarget.textContent !== '✓ Copied!') e.currentTarget.style.background='#F5F5F5'; }}
                                        onMouseOut={e => { if (e.currentTarget.textContent !== '✓ Copied!') e.currentTarget.style.background='white'; }}
                                    >
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        )})}
                    </div>    
                    {/* Move to Album Modal */}
                    {showMoveModal && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            padding: '20px'
                        }}>
                            <div style={{
                                background: 'white', borderRadius: '16px', padding: '30px',
                                width: '100%', maxWidth: '440px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                            }}>
                                <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem', color: '#1A1A1A', fontWeight: '700' }}>
                                    📁 Move to Album
                                </h3>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '20px' }}>
                                    Moving <strong>{selectedItems.length}</strong> selected image(s) to folder/album.
                                </p>

                                <form onSubmit={handleConfirmMove} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#666', marginBottom: '6px' }}>Select Target Album</label>
                                        <select 
                                            value={selectedAlbum} 
                                            onChange={(e) => setSelectedAlbum(e.target.value)}
                                            style={{
                                                width: '100%', padding: '10px 14px', borderRadius: '8px',
                                                border: '1px solid #E5E5E5', outline: 'none', fontSize: '0.95rem',
                                                background: 'white', color: '#333', cursor: 'pointer'
                                            }}
                                        >
                                            <option value="Nature">🌿 Nature</option>
                                            <option value="Architecture">🏛 Architecture</option>
                                            <option value="Products">📦 Products</option>
                                            <option value="Portraits">👤 Portraits</option>
                                            <option value="Interiors">🛋 Interiors</option>
                                            <option value="Cars">🚗 Cars</option>
                                            <option value="Minimal">🎨 Minimal</option>
                                            <option value="NEW">+ Create New Album...</option>
                                        </select>
                                    </div>

                                    {selectedAlbum === 'NEW' && (
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#666', marginBottom: '6px' }}>New Album Name</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Summer Vacation 2024"
                                                value={customAlbumName}
                                                onChange={(e) => setCustomAlbumName(e.target.value)}
                                                required
                                                style={{
                                                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                                                    border: '1px solid #E5E5E5', outline: 'none', fontSize: '0.95rem'
                                                }}
                                            />
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                                        <button 
                                            type="button" 
                                            onClick={() => setShowMoveModal(false)}
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
                                            Move Images
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirmModal && (
                        <div style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(5px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 9999, padding: '20px'
                        }}>
                            <div style={{
                                background: 'white', borderRadius: '24px', padding: '36px',
                                width: '100%', maxWidth: '480px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                                position: 'relative', display: 'flex', flexDirection: 'column', gap: '22px'
                            }}>
                                {/* Close Button */}
                                <button 
                                    onClick={() => setShowDeleteConfirmModal(false)}
                                    style={{
                                        position: 'absolute', top: '24px', right: '24px',
                                        background: 'none', border: 'none', color: '#94A3B8',
                                        fontSize: '1.2rem', cursor: 'pointer', padding: '4px',
                                        transition: 'color 0.2s'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.color='#0F172A'}
                                    onMouseOut={e => e.currentTarget.style.color='#94A3B8'}
                                >
                                    ✕
                                </button>

                                {/* Warning Icon Badge */}
                                <div style={{
                                    width: '54px', height: '54px', borderRadius: '50%',
                                    background: '#FEE2E2', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', color: '#EF4444'
                                }}>
                                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                        <line x1="12" y1="9" x2="12" y2="13"/>
                                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                                    </svg>
                                </div>

                                {/* Title & Body */}
                                <div>
                                    <h2 style={{ margin: '0 0 8px 0', fontSize: '1.5rem', fontWeight: '700', color: '#0F172A' }}>
                                        Delete Image(s)?
                                    </h2>
                                    <p style={{ margin: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.5' }}>
                                        You have selected <span style={{ color: '#EF4444', fontWeight: '600' }}>{selectedItems.length} image{selectedItems.length > 1 ? 's' : ''}</span>. Are you sure you want to delete {selectedItems.length > 1 ? 'them' : 'it'}? This action cannot be undone.
                                    </p>
                                </div>

                                {/* Selected Info Summary Box */}
                                <div style={{
                                    background: '#F8FAFC', borderRadius: '16px', padding: '16px 20px',
                                    display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid #F1F5F9'
                                }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '14px',
                                        background: '#EEF2FF', color: '#6366f1', display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                            <circle cx="8.5" cy="8.5" r="1.5"/>
                                            <polyline points="21 15 16 10 5 21"/>
                                        </svg>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: '700', color: '#1E293B' }}>Selected</div>
                                        <div style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '2px' }}>
                                            {selectedItems.length} image{selectedItems.length > 1 ? 's' : ''} • 2.4 MB
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div style={{ height: '1px', background: '#F1F5F9', margin: '2px 0' }}></div>

                                {/* Actions Footer */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button
                                        onClick={() => setShowDeleteConfirmModal(false)}
                                        style={{
                                            padding: '12px 28px', background: 'white', color: '#1E293B',
                                            border: '1px solid #E2E8F0', borderRadius: '12px', fontWeight: '600',
                                            fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background='#F8FAFC'}
                                        onMouseOut={e => e.currentTarget.style.background='white'}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDeleteModal}
                                        style={{
                                            padding: '12px 24px', background: '#DC2626', color: 'white',
                                            border: 'none', borderRadius: '12px', fontWeight: '600',
                                            fontSize: '0.95rem', cursor: 'pointer', display: 'flex',
                                            alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background='#B91C1C'}
                                        onMouseOut={e => e.currentTarget.style.background='#DC2626'}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="3 6 5 6 21 6"></polyline>
                                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                        </svg>
                                        Delete Image(s)
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Image Preview Lightbox Popup Modal */}
                    {previewModalImage && (
                        <div 
                            onClick={() => setPreviewModalImage(null)}
                            style={{
                                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                zIndex: 10000, padding: '20px'
                            }}
                        >
                            <div 
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                    background: 'white', borderRadius: '24px', width: '100%', maxWidth: '720px',
                                    overflow: 'hidden', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.35)',
                                    display: 'flex', flexDirection: 'column', position: 'relative'
                                }}
                            >
                                {/* Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                                        {previewModalImage.title}
                                    </h3>
                                    <button 
                                        onClick={() => setPreviewModalImage(null)}
                                        style={{
                                            width: '34px', height: '34px', borderRadius: '50%', background: '#F1F5F9',
                                            border: 'none', color: '#64748B', fontSize: '1.1rem', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'
                                        }}
                                        onMouseOver={e => e.currentTarget.style.background='#E2E8F0'}
                                        onMouseOut={e => e.currentTarget.style.background='#F1F5F9'}
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Image Stage */}
                                <div style={{ background: '#0F172A', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '340px', maxHeight: '520px' }}>
                                    <img 
                                        src={previewModalImage.img || previewModalImage.url} 
                                        alt={previewModalImage.title} 
                                        style={{ maxHeight: '480px', maxWidth: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
                                    />
                                </div>

                                {/* Footer Controls */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', background: 'white' }}>
                                    <button 
                                        onClick={() => {
                                            setPreviewModalImage(null);
                                            navigate(`/image/${previewModalImage.id || 1}`);
                                        }}
                                        style={{
                                            padding: '10px 18px', background: '#EEF2FF', color: '#6366f1',
                                            border: 'none', borderRadius: '10px', fontWeight: '600',
                                            fontSize: '0.88rem', cursor: 'pointer'
                                        }}
                                    >
                                        View Details Page →
                                    </button>

                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button
                                            onClick={(e) => {
                                                const btn = e.currentTarget;
                                                const targetUrl = previewModalImage.url || previewModalImage.img;
                                                navigator.clipboard.writeText(targetUrl);
                                                btn.textContent = '✓ Copied!';
                                                btn.style.background = '#DCFCE7';
                                                btn.style.color = '#16A34A';
                                                setTimeout(() => {
                                                    btn.textContent = 'Copy Link';
                                                    btn.style.background = 'white';
                                                    btn.style.color = '#334155';
                                                }, 2000);
                                            }}
                                            style={{
                                                padding: '10px 20px', background: 'white', color: '#334155',
                                                border: '1px solid #E2E8F0', borderRadius: '10px', fontWeight: '600',
                                                fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s'
                                            }}
                                        >
                                            Copy Link
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const imageUrl = previewModalImage.img || previewModalImage.url;
                                                if (!imageUrl) return;
                                                try {
                                                    const response = await fetch(imageUrl);
                                                    const blob = await response.blob();
                                                    const blobUrl = URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = blobUrl;
                                                    a.download = previewModalImage.title || 'image.jpg';
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    document.body.removeChild(a);
                                                    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
                                                } catch (err) {
                                                    window.open(imageUrl, '_blank');
                                                }
                                            }}
                                            style={{
                                                padding: '10px 22px', background: '#6366f1', color: 'white',
                                                border: 'none', borderRadius: '10px', fontWeight: '600',
                                                fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                                            }}
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Floating Toast Notification for Save */}
                    {toastMessage && (
                        <div style={{
                            position: 'fixed', bottom: '30px', right: '30px',
                            background: '#0F172A', color: 'white', padding: '14px 22px',
                            borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                            display: 'flex', alignItems: 'center', gap: '12px', zIndex: 99999,
                            fontSize: '0.9rem', fontWeight: '600', animation: 'fadeIn 0.3s'
                        }}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%',
                                background: '#16A34A', color: 'white', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'
                            }}>
                                ✓
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', color: 'white' }}>{toastMessage.title}</div>
                                <div style={{ fontSize: '0.78rem', color: '#94A3B8', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                                    {toastMessage.detail}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Floating Toast Notification for Link Copy */}
                    {copySuccessToast && (
                        <div style={{
                            position: 'fixed', bottom: '30px', right: '30px',
                            background: '#0F172A', color: 'white', padding: '14px 22px',
                            borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                            display: 'flex', alignItems: 'center', gap: '12px', zIndex: 99999,
                            fontSize: '0.9rem', fontWeight: '600', animation: 'fadeIn 0.3s'
                        }}>
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%',
                                background: '#22C55E', color: 'white', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold'
                            }}>
                                ✓
                            </div>
                            <div>
                                <div style={{ fontWeight: '700', color: 'white' }}>Link Copied to Clipboard!</div>
                                <div style={{ fontSize: '0.78rem', color: '#94A3B8', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                                    {copySuccessToast}
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

