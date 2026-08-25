import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
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
                    <div className="logo">
                        <div className="logo-icon"></div>
                        <span>Lumina</span>
                    </div>
                </div>
                
                <nav className="sidebar-nav">
                    <Link to="/dashboard" className="nav-item active"><span className="icon">⊞</span> Dashboard</Link>
                    <Link to="/saved" className="nav-item"><span className="icon">♡</span> Saved</Link>
                </nav>
                
                <div className="guidance-card">
                    <div className="guidance-icon">ℹ</div>
                    <h4>Need Guidance?</h4>
                    <p>See the video, it can help you to understand the application.</p>
                    <button className="btn-play">Play Video</button>
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



                    <h3 className="section-title" style={{ marginTop: '40px', marginBottom: '20px' }}>Current Bidding List</h3>
                    <div className="bids-grid">
                        {bidItems.map(item => {
                            const savedList = JSON.parse(localStorage.getItem('savedItems') || '[]');
                            const isSaved = savedList.some(s => s.id === item.id);
                            return (
                            <div key={item.id} className="bid-card">
                                <div className="bid-img" style={{ height: '220px', position: 'relative' }}>
                                    <img src={item.img} alt="Uploaded Item" />
                                    <button 
                                        onClick={(e) => {
                                            const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
                                            if (saved.some(s => s.id === item.id)) {
                                                localStorage.setItem('savedItems', JSON.stringify(saved.filter(s => s.id !== item.id)));
                                                e.target.style.color = '#ccc';
                                            } else {
                                                localStorage.setItem('savedItems', JSON.stringify([...saved, item]));
                                                e.target.style.color = '#FF4D4F';
                                            }
                                        }}
                                        style={{
                                            position: 'absolute', top: '10px', right: '10px', background: 'white', 
                                            border: 'none', borderRadius: '50%', width: '35px', height: '35px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', 
                                            color: isSaved ? '#FF4D4F' : '#ccc', fontSize: '1.2rem', transition: 'color 0.2s'
                                        }}
                                        title="Save Item"
                                    >
                                        ♥
                                    </button>
                                </div>
                                <div className="bid-info-box" style={{ padding: '15px' }}>
                                    <button 
                                        className="btn-purple full-btn" 
                                        onClick={(e) => {
                                            const btn = e.target;
                                            navigator.clipboard.writeText(item.img)
                                                .then(() => {
                                                    const oldText = btn.innerText;
                                                    btn.innerText = 'Copied ✓';
                                                    setTimeout(() => btn.innerText = oldText, 2000);
                                                });
                                        }}
                                    >
                                        Copy Link
                                    </button>
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

