import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { 
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
                
                <div style={{ padding: '30px 40px 10px 40px' }}>
                    <h1 style={{ margin: 0, fontSize: '1.8rem' }} className="page-title">Image Details</h1>
                    <div className="breadcrumbs" style={{ marginTop: '5px', fontSize: '0.85rem', color: '#999' }}>
                        <span style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>Dashboard</span> / <span style={{ color: '#6366f1', cursor: 'pointer' }} onClick={() => navigate('/my-images')}>My Images</span> / <span>Image Details</span>
                    </div>
                </div>

                <main className="dashboard-content" style={{ padding: '20px 40px', display: 'flex', gap: '30px', alignItems: 'flex-start' }}>
                    
                    {/* Left Column */}
                    <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Image Preview */}
                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #E5E5E5', background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: '500px' }}>
                            <img src={displayImage.img || displayImage.url} alt={fileName} style={{ width: '100%', maxHeight: '500px', display: 'block', objectFit: 'contain' }} />
                        </div>
                        
                        {/* Quick Actions */}
                        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid #E5E5E5', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                            <h3 style={{ margin: '0 0 15px 0', fontSize: '0.9rem', color: '#666', fontWeight: '600' }}>Quick Actions</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                                    onClick={() => {
                                        if (window.confirm("Are you sure you want to permanently delete this image?")) {
                                            fetch(`http://localhost:5000/api/images/${displayImage.id || displayImage._id}`, {
                                                method: 'DELETE'
                                            })
                                            .then(res => res.json())
                                            .then(data => {
                                                if (data.success) {
                                                    alert("Image deleted successfully!");
                                                    navigate('/dashboard');
                                                } else {
                                                    alert("Failed to delete image.");
                                                }
                                            })
                                            .catch(err => {
                                                console.error("Delete error:", err);
                                                alert("Error deleting image.");
                                            });
                                        }
                                    }}
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
                                    onClick={() => {
                                        const url = displayImage.url || displayImage.img;
                                        const a = document.createElement('a');
                                        a.href = url;
                                        a.download = fileName;
                                        a.target = '_blank';
                                        document.body.appendChild(a);
                                        a.click();
                                        document.body.removeChild(a);
                                    }}
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
        </div>
    );
};

export default ImageDetails;
