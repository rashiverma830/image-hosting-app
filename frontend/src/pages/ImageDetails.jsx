import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
    ArrowLeft,
    Share2, 
    FolderPlus, 
    Edit2, 
    Heart, 
    Trash2, 
    Download, 
    MoreHorizontal 
} from 'lucide-react';
import '../styles/dashboard.css';

const ImageDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copyStatus, setCopyStatus] = useState('Copy Link');
    const [isSaved, setIsSaved] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    
    const confirmDelete = () => {
        setIsDeleting(true);
        fetch(`http://localhost:5000/api/images/${displayImage.id || displayImage._id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            setIsDeleting(false);
            if (data.success) {
                setShowDeleteModal(false);
                navigate('/dashboard');
            } else {
                alert("Failed to delete image.");
            }
        })
        .catch(err => {
            setIsDeleting(false);
            console.error("Delete error:", err);
            alert("Error deleting image.");
        });
    };
    const handleDownloadImage = async () => {
        const imageUrl = displayImage.img || displayImage.url;
        if (!imageUrl) return;

        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = blobUrl;
            const saveName = fileName.includes('.') ? fileName : `${fileName}.jpg`;
            a.download = saveName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        } catch (err) {
            console.error("Fetch blob failed, fallback download:", err);
            const a = document.createElement('a');
            a.href = imageUrl;
            a.download = fileName;
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    useEffect(() => {
        document.body.classList.add('dashboard-body');
        
        // Fetch image details from backend
        fetch('http://localhost:5000/api/images')
            .then(res => res.json())
            .then(data => {
                const found = data.find(item => item.id === id || item._id === id);
                if (found) {
                    setImage(found);
                    
                    const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
                    setIsSaved(saved.some(s => s.id === (found.id || found._id)));
                } else if (data && data.length > 0) {
                    // Fallback to the latest image if the hardcoded ID /image/1 is used
                    setImage(data[0]);
                    
                    const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
                    setIsSaved(saved.some(s => s.id === (data[0].id || data[0]._id)));
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load image:", err);
                setLoading(false);
            });

        return () => document.body.classList.remove('dashboard-body');
    }, [id]);

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading image details...</div>;
    
    // If not found, use mock data to show the design anyway
    const displayImage = image || {
        title: 'mountain-lake.jpg',
        url: 'https://picsum.photos/seed/mountain/800/600',
        createdAt: new Date().toISOString()
    };

    const fileName = displayImage.title ? (displayImage.title.includes('.') ? displayImage.title : `${displayImage.title.toLowerCase().replace(/\s+/g, '-')}.jpg`) : 'mountain-lake.jpg';
    
    return (
        <div className="dashboard-layout">
            <aside className="sidebar open" id="sidebar" style={{ display: 'none' }}></aside>
            <div className="main-wrapper" style={{ marginLeft: 0, width: '100%' }}>
                
                <div style={{ padding: '24px 40px 10px 40px' }}>
                    <button 
                        onClick={() => navigate(-1)} 
                        style={{ 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '6px', 
                            padding: '6px 14px', 
                            background: '#F1F5F9', 
                            border: '1px solid #E2E8F0', 
                            borderRadius: '20px', 
                            cursor: 'pointer', 
                            fontWeight: '600', 
                            fontSize: '0.82rem', 
                            color: '#475569',
                            marginBottom: '12px',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#0F172A'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#475569'; }}
                    >
                        <ArrowLeft size={14} /> Back
                    </button>
                    <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700' }} className="page-title">Image Details</h1>
                    <div className="breadcrumbs" style={{ marginTop: '6px', fontSize: '0.85rem', color: '#94A3B8' }}>
                        <span style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Dashboard</span> / <span style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => navigate('/my-images')}>My Images</span> / <span>Image Details</span>
                    </div>
                </div>

                <main className="dashboard-content" style={{ padding: '20px 40px 60px 40px', display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                    
                    {/* Left Column */}
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Image Preview */}
                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E5E5', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '340px', padding: '15px' }}>
                            <img src={displayImage.img || displayImage.url} alt={fileName} style={{ maxHeight: '100%', maxWidth: '100%', display: 'block', objectFit: 'contain', borderRadius: '6px' }} />
                        </div>
                        
                        {/* Quick Actions */}
                        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div 
                                    onClick={handleDownloadImage}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#6366f1' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Download size={18} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Download</span>
                                </div>
                                <div 
                                    onClick={() => {
                                        const url = displayImage.url || displayImage.img;
                                        if (navigator.share) {
                                            navigator.share({ title: fileName, url: url }).catch(console.error);
                                        } else {
                                            navigator.clipboard.writeText(url);
                                            alert("Link copied to share!");
                                        }
                                    }}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#666' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Share2 size={18} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Share</span>
                                </div>
                                <div 
                                    onClick={() => {
                                        const albumName = prompt("Enter album name to add to:");
                                        if (albumName) {
                                            alert(`Added to album: ${albumName}`);
                                        }
                                    }}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#666' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FolderPlus size={18} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Add to Album</span>
                                </div>
                                <div 
                                    onClick={() => navigate('/image-tools')}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#666' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Edit2 size={18} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Edit Image</span>
                                </div>
                                <div 
                                    onClick={() => {
                                        const saved = JSON.parse(localStorage.getItem('savedItems') || '[]');
                                        const itemId = displayImage.id || displayImage._id;
                                        if (isSaved) {
                                            localStorage.setItem('savedItems', JSON.stringify(saved.filter(s => s.id !== itemId)));
                                            setIsSaved(false);
                                        } else {
                                            localStorage.setItem('savedItems', JSON.stringify([...saved, displayImage]));
                                            setIsSaved(true);
                                        }
                                    }}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', color: isSaved ? '#FF4D4F' : '#666' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isSaved ? '#FFF1F0' : '#F5F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Heart size={18} fill={isSaved ? '#FF4D4F' : 'none'} color={isSaved ? '#FF4D4F' : 'currentColor'} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{isSaved ? 'Saved' : 'Add to Favorites'}</span>
                                </div>
                                <div 
                                    onClick={() => setShowDeleteModal(true)}
                                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#EF4444' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#FFF1F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Trash2 size={18} />
                                    </div>
                                    <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>Delete</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Right Column */}
                    <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        
                        <div style={{ background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#1A1A1A', fontWeight: '600' }}>Details</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Name</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F5F5F5', padding: '5px 10px', borderRadius: '6px', fontSize: '0.85rem', color: '#333' }}>
                                        <Edit2 size={12} color="#999" /> {fileName}
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Size</span>
                                    <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>2.4 MB</span>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Dimensions</span>
                                    <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>5172 x 3048</span>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Format</span>
                                    <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>JPG</span>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Uploaded</span>
                                    <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>May 26, 2024, 10:45 AM</span>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Location</span>
                                    <span style={{ fontSize: '0.9rem', color: '#333', fontWeight: '500' }}>Palo Alto, California</span>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>Visibility</span>
                                    <span style={{ background: '#EEF2FF', color: '#6366f1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>Private</span>
                                </div>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>URL Security</span>
                                    <span style={{ background: '#EEF2FF', color: '#6366f1', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600' }}>Protected</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button 
                                    onClick={() => {
                                        const url = displayImage.url || displayImage.img;
                                        navigator.clipboard.writeText(url)
                                            .then(() => {
                                                setCopyStatus('Copied ✓');
                                                setTimeout(() => setCopyStatus('Copy Link'), 2000);
                                            })
                                            .catch(err => {
                                                console.error("Failed to copy link:", err);
                                                alert("Failed to copy link");
                                            });
                                    }}
                                    style={{ flex: '1', padding: '12px', background: '#6366f1', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}
                                >
                                    {copyStatus}
                                </button>
                                <button 
                                    onClick={handleDownloadImage}
                                    style={{ flex: '1', padding: '12px', background: 'white', color: '#333', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem' }}
                                >
                                    <Download size={16} /> Download
                                </button>
                            </div>
                            
                            <button style={{ width: '100%', padding: '12px', background: 'white', color: '#333', border: '1px solid #E5E5E5', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.95rem' }}>
                                More Actions
                            </button>
                        </div>
                        
                    </div>
                </main>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: 'white', padding: '30px', borderRadius: '16px',
                        width: '90%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        textAlign: 'center'
                    }}>
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                            <Trash2 size={28} color="#EF4444" />
                        </div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#111', fontSize: '1.25rem' }}>Delete Image?</h3>
                        <p style={{ color: '#666', marginBottom: '25px', fontSize: '0.95rem', lineHeight: '1.5' }}>
                            Are you sure you want to permanently delete this image? This action cannot be undone.
                        </p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                style={{ flex: 1, padding: '12px', background: '#F5F5F5', color: '#333', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmDelete}
                                disabled={isDeleting}
                                style={{ flex: 1, padding: '12px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', opacity: isDeleting ? 0.7 : 1 }}
                            >
                                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageDetails;
