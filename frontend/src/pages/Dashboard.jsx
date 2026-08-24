import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [previewSrc, setPreviewSrc] = useState('/image/full-screen-size.png');
    const [currentImageBlob, setCurrentImageBlob] = useState(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [copyStatus, setCopyStatus] = useState('Copy Image');
    const [copyLinkStatus, setCopyLinkStatus] = useState('Copy Link');
    const fileInputRef = useRef(null);

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

    const handleFiles = (files) => {
        let imageFile = null;
        for (let i = 0; i < files.length; i++) {
            if (files[i].type.startsWith('image/')) {
                imageFile = files[i];
                break;
            }
        }
        
        if (imageFile) {
            setCurrentImageBlob(imageFile);
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewSrc(e.target.result);
            };
            reader.readAsDataURL(imageFile);
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
            // Copy the data URL to clipboard so it can be pasted in the browser
            await navigator.clipboard.writeText(previewSrc);
            
            setCopyStatus("URL Copied ✓");
            setTimeout(() => setCopyStatus("Copy Image"), 2000);
        } catch (err) {
            console.error("Failed to copy image: ", err);
            alert("Image URL copy fail ho gaya. Shayad browser permission required hai.");
        }
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText('http://localhost:5173/dashboard');
            setCopyLinkStatus('Link Copied ✓');
            setTimeout(() => setCopyLinkStatus('Copy Link'), 2000);
        } catch (err) {
            console.error("Failed to copy link: ", err);
            alert("Link copy fail ho gaya.");
        }
    };

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        return () => {
            document.body.classList.remove('dashboard-body');
        };
    }, []);

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
                    <Link to="/bids" className="nav-item"><span className="icon">📈</span> Bids</Link>
                    <Link to="/saved" className="nav-item"><span className="icon">♡</span> Saved</Link>
                    <Link to="/creators" className="nav-item"><span className="icon">👥</span> Creators</Link>
                    <Link to="/wallet" className="nav-item"><span className="icon">👛</span> Wallet</Link>
                </nav>
                
                <div className="guidance-card">
                    <div className="guidance-icon">ℹ</div>
                    <h4>Need Guidance?</h4>
                    <p>See the video, it can help you to understand the application.</p>
                    <button className="btn-play">Play Video</button>
                </div>
            </aside>

            <div className="main-wrapper">
                <Header title="Create Item" breadcrumbs="Create Item" onToggleSidebar={toggleSidebar} />
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

                    <div className="purchase-type-section">
                        <h3>Purchase Type</h3>
                        <div className="type-cards">
                            <label className="type-card active">
                                <input type="radio" name="purchase_type" defaultChecked />
                                <span className="radio-custom"></span>
                                <div className="type-info">
                                    <h4>Fixed Price</h4>
                                    <p>Set fixed price for people to buy your product instantly</p>
                                </div>
                            </label>
                            <label className="type-card">
                                <input type="radio" name="purchase_type" />
                                <span className="radio-custom"></span>
                                <div className="type-info">
                                    <h4>Timed Auction</h4>
                                    <p>Set fixed price for people to buy your product instantly</p>
                                </div>
                            </label>
                            <label className="type-card">
                                <input type="radio" name="purchase_type" />
                                <span className="radio-custom"></span>
                                <div className="type-info">
                                    <h4>Open for Bids</h4>
                                    <p>Set fixed price for people to buy your product instantly</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="main-details-section">
                        <h3>Main Details</h3>
                        <div className="form-grid">
                            <div className="form-group title-group">
                                <label>Title</label>
                                <input type="text" defaultValue="Abstract 3D Design" />
                            </div>
                            <div className="form-group price-group">
                                <label>Price</label>
                                <input type="text" defaultValue="2.55 ETH" />
                            </div>
                            <div className="form-group">
                                <label>Size</label>
                                <input type="text" defaultValue="Abstract 3D Design" />
                            </div>
                            <div className="form-group">
                                <label>Propertie</label>
                                <input type="text" defaultValue="Abstract 3D Design" />
                            </div>
                            <div className="form-group">
                                <label>Royality</label>
                                <input type="text" defaultValue="Abstract 3D Design" />
                            </div>
                            <div className="form-group">
                                <label>Currency</label>
                                <input type="text" defaultValue="Abstract 3D Design" />
                            </div>
                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea rows="4"></textarea>
                            </div>
                        </div>
                        
                        <div className="bottom-actions">
                            <button className="btn-create" onClick={() => {
                                const title = document.querySelector('.title-group input').value || 'Untitled Item';
                                const price = document.querySelector('.price-group input').value || '0 ETH';
                                const purchaseType = document.querySelector('input[name="purchase_type"]:checked')?.nextElementSibling?.nextElementSibling?.querySelector('h4')?.innerText || 'Fixed Price';
                                
                                const newItem = {
                                    id: Date.now(),
                                    title: title,
                                    price: price,
                                    status: purchaseType,
                                    img: previewSrc
                                };
                                
                                const existingItems = JSON.parse(localStorage.getItem('userItems') || '[]');
                                localStorage.setItem('userItems', JSON.stringify([newItem, ...existingItems]));
                                
                                alert('Item created successfully!');
                                navigate('/profile');
                            }}>Create Item</button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;

